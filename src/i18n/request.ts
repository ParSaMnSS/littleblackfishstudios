import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocales = ['en', 'fa'];
  const activeLocale = validLocales.includes(locale as any) ? locale : 'en';

  return {
    locale: activeLocale as string,
    messages: (await import(`../messages/${activeLocale}.json`)).default
  };
});
