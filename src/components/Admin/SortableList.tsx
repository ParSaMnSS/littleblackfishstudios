'use client';

import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

interface SortableItem {
  id: string;
  title: string;
  image?: string | null;
  active?: boolean;
}

interface SortableListProps {
  items: SortableItem[];
  onReorder: (items: SortableItem[]) => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onToggle?: (id: string, currentStatus: boolean) => void;
}

export default function SortableList({ items, onReorder, onEdit, onDelete, onToggle }: SortableListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    onReorder(newItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition-all ${
                      snapshot.isDragging ? 'scale-105 border-blue-500 bg-zinc-800 shadow-2xl z-50' : 'hover:bg-zinc-900'
                    }`}
                  >
                    <div {...provided.dragHandleProps} className="text-zinc-600 hover:text-zinc-400">
                      <GripVertical size={20} />
                    </div>

                    <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-zinc-800">
                      {item.image && (
                        <Image src={item.image} alt="" fill className="object-cover" />
                      )}
                    </div>

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
  );
}
