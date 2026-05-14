'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter({ locale }: { locale: string }) {
  const pathname = usePathname();
  const isAdminPage = pathname.includes(`/${locale}/admin`);
  const isLoginPage = pathname.includes(`/${locale}/login`);

  if (isAdminPage || isLoginPage) return null;

  return <Footer locale={locale} />;
}
