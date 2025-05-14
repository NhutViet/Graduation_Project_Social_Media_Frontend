declare module 'react-native-link-preview' {
  interface LinkPreviewData {
    url: string;
    title?: string;
    description?: string;
    images?: string[];
    mediaType?: string;
    contentType?: string;
    favicons?: string[];
  }

  const LinkPreview: {
    getPreview: (text: string) => Promise<LinkPreviewData>;
  };

  export default LinkPreview;
}