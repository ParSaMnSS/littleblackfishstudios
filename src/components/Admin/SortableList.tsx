'use client';

function getYouTubeThumbnail(url: string | null | undefined) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg` : null;
}

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Save, X, Check, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface SortableItem {
  id: string;
  title: string;
  image?: string | null;
  youtubeUrl?: string | null;
  active?: boolean;
}

interface SortableListProps {
  items: SortableItem[];
  onReorder: (items: SortableItem[]) => Promise<{ success: boolean; error?: string } | void> | void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onToggle?: (id: string, currentStatus: boolean) => void;
  isRtl?: boolean;
}

export default function SortableList({ items, onReorder, onEdit, onDelete, onToggle, isRtl }: SortableListProps) {
  const [localItems, setLocalItems] = useState(items);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isDirty) {
      setLocalItems(items);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map(i => i.id).join(','), isDirty]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const newItems = Array.from(localItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setLocalItems(newItems);
    setIsDirty(true);
    setSaveStatus('idle');
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= localItems.length) return;
    const newItems = Array.from(localItems);
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setLocalItems(newItems);
    setIsDirty(true);
    setSaveStatus('idle');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const result = await onReorder(localItems);
      if (result && result.success === false) {
        setSaveStatus('error');
        setErrorMsg(result.error || 'Save failed');
      } else {
        setSaveStatus('saved');
        setIsDirty(false);
        setTimeout(() => setSaveStatus('idle'), 2500);
      }
    } catch (e: any) {
      setSaveStatus('error');
      setErrorMsg(e?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setLocalItems(items);
    setIsDirty(false);
    setSaveStatus('idle');
    setErrorMsg(null);
  };

  return (
    <div>
    {/* Save / Status Bar */}
    <div className={`mb-4 flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
      isDirty ? 'border-yellow-500/40 bg-yellow-500/5' :
      saveStatus === 'saved' ? 'border-green-500/40 bg-green-500/5' :
      saveStatus === 'error' ? 'border-red-500/40 bg-red-500/5' :
      'border-zinc-800 bg-zinc-900/30'
    }`}>
      <div className="flex items-center gap-2 text-sm">
        {saveStatus === 'saved' && <><Check size={16} className="text-green-500" /><span className="text-green-400">{isRtl ? 'ذخیره شد' : 'Saved'}</span></>}
        {saveStatus === 'error' && <><AlertCircle size={16} className="text-red-500" /><span className="text-red-400">{errorMsg || (isRtl ? 'خطا در ذخیره' : 'Save failed')}</span></>}
        {saveStatus === 'idle' && isDirty && <span className="text-yellow-400">{isRtl ? 'تغییرات ذخیره نشده' : 'Unsaved changes'}</span>}
        {saveStatus === 'idle' && !isDirty && <span className="text-zinc-500">{isRtl ? 'برای تغییر ترتیب بکشید یا از فلش‌ها استفاده کنید' : 'Drag or use arrows to reorder'}</span>}
      </div>
      <div className="flex items-center gap-2">
        {isDirty && (
          <button
            onClick={handleDiscard}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:border-zinc-500 hover:text-white disabled:opacity-50"
          >
            <X size={16} />
            {isRtl ? 'لغو' : 'Discard'}
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          <Save size={16} />
          {isSaving ? (isRtl ? 'در حال ذخیره...' : 'Saving...') : (isRtl ? 'ذخیره ترتیب' : 'Save Order')}
        </button>
      </div>
    </div>

    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {localItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition-all ${
                      snapshot.isDragging ? 'scale-105 border-blue-500 bg-zinc-800 shadow-2xl z-50' : 'hover:bg-zinc-900'
                    }`}
                  >
                    <div {...provided.dragHandleProps} className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing">
                      <GripVertical size={20} />
                    </div>

                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        className="text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500"
                        aria-label="Move up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === localItems.length - 1}
                        className="text-zinc-500 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-500"
                        aria-label="Move down"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    {/* Thumbnail Logic */}
                    {(() => {
                      const mediaUrl = item.image || getYouTubeThumbnail(item.youtubeUrl);
                      const isVideo = mediaUrl?.toLowerCase().includes('.mp4') || mediaUrl?.toLowerCase().includes('.webm');
                      
                      return (
                        <div className="relative w-12 h-12 bg-zinc-800 rounded overflow-hidden shrink-0">
                          {isVideo ? (
                            <video 
                              src={mediaUrl!} 
                              className="object-cover w-full h-full" 
                              muted 
                              playsInline 
                            />
                          ) : mediaUrl ? (
                            <Image 
                              src={mediaUrl} 
                              alt={item.title || 'Thumbnail'} 
                              fill 
                              className="object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              {/* Fallback empty state */}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-sm font-medium text-white">{item.title}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      {onToggle && (
                        <button
                          onClick={() => onToggle(item.id, item.active ?? false)}
                          className={`p-2 transition-colors ${item.active ? 'text-blue-500 hover:bg-blue-500/10' : 'text-zinc-500 hover:bg-zinc-500/10'}`}
                        >
                          {item.active ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-zinc-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-2 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </div>
  );
}
