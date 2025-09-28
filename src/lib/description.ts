/**
 * Extract description from Markdown content with multi-language support
 * @param content Markdown content
 * @param maxLength Maximum length, defaults to 160 characters
 * @param locale Language code for optimized processing logic, auto-detected by default
 * @returns Extracted description
 */
export function extractDescription(
  content: string,
  maxLength: number = 160,
  locale?: string
): string {
  if (!content) return '';

  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '');

  // Remove Markdown syntax
  let cleanText = withoutFrontmatter
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // Remove headings
    .replace(/^#{1,6}\s+.*$/gm, '')
    // Remove links, keep text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
    // Remove bold and italic markers
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/__([^_]*)__/g, '$1')
    .replace(/_([^_]*)_/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove list markers
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove extra whitespace
    .replace(/\n\s*\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  // Return empty string if no content
  if (!cleanText) return '';

  // Detect language type
  const detectedLocale = locale || detectLanguage(cleanText);

  // Choose appropriate sentence splitting strategy based on language
  let description = '';

  if (isCJK(detectedLocale)) {
    // CJK language processing
    description = extractCJKDescription(cleanText, maxLength);
  } else {
    // Latin script processing
    description = extractLatinDescription(cleanText, maxLength);
  }

  return description;
}

/**
 * Detect the primary language of the text
 */
function detectLanguage(text: string): string {
  // Count the proportion of different character types
  const cjkCount = (text.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/g) || [])
    .length;
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = text.length;

  if (cjkCount / totalChars > 0.3) {
    // Further distinguish between Chinese, Japanese, and Korean
    const chineseCount = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const japaneseCount = (text.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
    const koreanCount = (text.match(/[\uac00-\ud7af]/g) || []).length;

    if (japaneseCount > chineseCount && japaneseCount > koreanCount) return 'ja';
    if (koreanCount > chineseCount && koreanCount > japaneseCount) return 'ko';
    return 'zh';
  }

  return 'en'; // Default to English
}

/**
 * Check if the language is CJK (Chinese, Japanese, Korean)
 */
function isCJK(locale: string): boolean {
  return ['zh', 'ja', 'ko', 'zh-CN', 'zh-TW', 'ja-JP', 'ko-KR'].includes(locale);
}

/**
 * Extract description for CJK languages (Chinese, Japanese, Korean)
 */
function extractCJKDescription(text: string, maxLength: number): string {
  // Sentence delimiters for CJK languages
  const sentenceEnders = /[。！？．！？]/;
  const sentences = text.split(sentenceEnders);

  let description = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    // For CJK languages, we don't need to add periods as the original text might already have them
    const newDescription = description ? `${description}${trimmed}` : trimmed;

    // Check if punctuation needs to be added
    const needsPunctuation = !sentenceEnders.test(trimmed.slice(-1));
    const finalDescription = needsPunctuation ? `${newDescription}。` : newDescription;

    // Stop if adding this sentence would exceed the maximum length
    if (finalDescription.length > maxLength) {
      break;
    }

    description = finalDescription;

    // Stop if we have appropriate length content
    if (description.length >= Math.min(50, maxLength * 0.6)) {
      break;
    }
  }

  // If no suitable sentences found, truncate to maxLength characters
  if (!description && text.length > 0) {
    description = text.slice(0, maxLength);
    if (description.length < text.length) {
      description += '...';
    }
  }

  return description;
}

/**
 * Extract description for Latin script languages
 */
function extractLatinDescription(text: string, maxLength: number): string {
  // Sentence delimiters for Latin script languages
  const sentences = text.split(/[.!?]+\s+/);

  let description = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    const newDescription = description ? `${description} ${trimmed}` : trimmed;

    // Ensure sentences end with appropriate punctuation
    const needsPunctuation = !/[.!?]$/.test(trimmed);
    const finalDescription = needsPunctuation ? `${newDescription}.` : newDescription;

    // Stop if adding this sentence would exceed the maximum length
    if (finalDescription.length > maxLength) {
      break;
    }

    description = finalDescription;

    // Stop if we have appropriate length content
    if (description.length >= Math.min(80, maxLength * 0.7)) {
      break;
    }
  }

  // If no suitable sentences found, truncate to maxLength characters
  if (!description && text.length > 0) {
    description = text.slice(0, maxLength);
    // Ensure we don't break in the middle of a word
    if (description.length < text.length) {
      const lastSpace = description.lastIndexOf(' ');
      if (lastSpace > maxLength * 0.8) {
        description = description.slice(0, lastSpace);
      }
      description += '...';
    }
  }

  return description;
}
