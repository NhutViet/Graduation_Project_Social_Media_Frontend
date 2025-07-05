// Export a function that creates a fresh regex instance each time
export const createHashtagRegex = () => /(^|\s)(#\w+)\b/g;

// For simple testing without global flag
export const HASHTAG_REGEX_TEST = /(^|\s)(#\w+)\b/;

// If you need the regex pattern as a constant
export const HASHTAG_PATTERN = '(^|\\s)(#\\w+)\\b';

// Utility function to extract all hashtags from text
export const extractHashtags = (text: string): string[] => {
  const matches = text.matchAll(createHashtagRegex());
  return Array.from(matches).map(match => match[2]); 
};

// Utility function to check if text contains hashtags
export const hasHashtags = (text: string): boolean => {
  return HASHTAG_REGEX_TEST.test(text);
};