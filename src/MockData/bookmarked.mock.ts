export interface BookmarkedItem {
  id: string;
  image: string;
  type: 'post' | 'music';
  isVideo?: boolean;
  thumbnail?: string;
}

export const bookmarked: BookmarkedItem[] = [
  { id: '1', image: 'https://res.cloudinary.com/degdvuuhd/image/upload/v1747379448/zwnpogj0teinqgbi0jmq.gif', type: 'post', isVideo: false },  { id: '2', image: 'https://picsum.photos/150/150?random=52', type: 'post', isVideo: false },  { id: '3', image: 'https://picsum.photos/150/150?random=53', type: 'post', isVideo: false },  { id: '4', image: 'https://picsum.photos/150/150?random=54', type: 'post', isVideo: false },  { id: '5', image: 'https://picsum.photos/150/150?random=55', type: 'post', isVideo: false },  { id: '6', image: 'https://picsum.photos/150/150?random=56', type: 'post', isVideo: false },  { id: '7', image: 'https://picsum.photos/150/150?random=57', type: 'post', isVideo: false },  { id: '8', image: 'https://picsum.photos/150/150?random=58', type: 'post', isVideo: false },  { id: '9', image: 'https://picsum.photos/150/150?random=59', type: 'post', isVideo: false },  { id: '10', image: 'https://picsum.photos/150/150?random=510', type: 'post', isVideo: false },
  { id: '11', image: 'https://picsum.photos/150/150?random=511', type: 'post', isVideo: false },
  { id: '12', image: 'https://picsum.photos/150/150?random=512', type: 'post', isVideo: false },
  { id: '13', image: 'https://picsum.photos/150/150?random=513', type: 'post', isVideo: false },
  { id: '14', image: 'https://picsum.photos/150/150?random=514', type: 'post', isVideo: false },
  { id: '15', image: 'https://picsum.photos/150/150?random=515', type: 'post', isVideo: false },
  { id: '16', image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail: 'https://picsum.photos/150/150?random=516', type: 'music', isVideo: true },
  { id: '17', image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnail: 'https://picsum.photos/150/150?random=517', type: 'music', isVideo: true },
  { id: '18', image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail: 'https://picsum.photos/150/150?random=518', type: 'music', isVideo: true },
  { id: '19', image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnail: 'https://picsum.photos/150/150?random=519', type: 'music', isVideo: true },
  { id: '20', image: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnail: 'https://picsum.photos/150/150?random=520', type: 'music', isVideo: true },
  { id: '21', image: 'https://res.cloudinary.com/degdvuuhd/video/upload/v1747040358/zqo2titvgjtxklfeqivm.mp4', thumbnail: 'https://picsum.photos/150/150?random=220', type: 'music', isVideo: true },
];