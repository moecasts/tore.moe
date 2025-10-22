/**
 * Generate language alternate links for SEO
 */
export function generateLanguageAlternates(
  canonicalUrl: string,
  currentLocale: string,
  supportedLocales: string[]
): Array<{ href: string; hrefLang: string }> {
  const alternates = supportedLocales.map((locale) => {
    const currentLangPattern = `/${currentLocale}/`;
    const targetLangPattern = `/${locale}/`;

    // Replace language part in URL
    const href = canonicalUrl.includes(currentLangPattern)
      ? canonicalUrl.replace(currentLangPattern, targetLangPattern)
      : canonicalUrl.replace(/\/$/, '') + targetLangPattern;

    return { href, hrefLang: locale };
  });

  // Add x-default pointing to current page
  alternates.push({ href: canonicalUrl, hrefLang: 'x-default' });

  return alternates;
}

/**
 * Get supported locales from i18next configuration
 */
export function getSupportedLocales(i18n: any): string[] {
  return (i18n.options.supportedLngs || []).filter((lang: string) => lang !== 'cimode');
}

/**
 * Get locale-specific Open Graph locale format
 */
export function getOGLocale(locale: string): string {
  // Convert locale format: zh-CN -> zh_CN, en-US -> en_US
  return locale.replace('-', '_');
}

/**
 * Get alternate locales for Open Graph
 */
export function getOGLocaleAlternates(currentLocale: string, supportedLocales: string[]): string[] {
  return supportedLocales
    .filter((locale) => locale !== currentLocale)
    .map((locale) => getOGLocale(locale));
}
