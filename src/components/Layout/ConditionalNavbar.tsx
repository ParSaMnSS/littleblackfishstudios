'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar({ locale }: { locale: string }) {
  const pathname = usePathname();
  
  // Don't show navbar on admin pages
  const isAdminPage = pathname.includes(`/${locale}/admin`);
  
  if (isAdminPage) return null;
  
  return <Navbar locale={locale} />;
}
