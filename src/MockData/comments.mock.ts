interface LikedBy {
  count: number;
  text: string;
}

interface Replies {
  count: number;
  text: string;
  items?: Comment[];
}

export interface Comment {
  avatar: string;
  content: string;
  id: string;
  replies?: Replies;
  timeAgo: string;
  username: string;
  isLiked?: boolean;
  likedBy?: LikedBy;
}
export const mockComments: Comment[] = [
  {
    id: '1',
    username: 'enzetto',
    avatar: 'https://picsum.photos/40/40?random=1',
    content: 'Nice one!',
    timeAgo: '13m',
    replies: {
      count: 2,
      text: '2 replies',
      items: [
        {
          id: '1.1',
          username: 'johndoe',
          avatar: 'https://picsum.photos/40/40?random=11',
          content: 'Thanks!',
          timeAgo: '10m',
          likedBy: {
            count: 1,
            text: 'Liked by 1 person',
          },
        },
        {
          id: '1.2',
          username: 'janedoe',
          avatar: 'https://picsum.photos/40/40?random=12',
          content: 'Great shot!',
          timeAgo: '5m',
        },
      ],
    },
  },
  {
    id: '2',
    username: 'cat_yay',
    avatar: 'https://picsum.photos/40/40?random=2',
    content: 'Love this ❤️',
    timeAgo: '30m',
    isLiked: true,
    likedBy: {
      count: 3,
      text: 'Liked by 3 people',
    },
  },
  {
    id: '3',
    username: 'allyoucaneat',
    avatar: 'https://picsum.photos/40/40?random=3',
    content: 'Looks good #epicness',
    timeAgo: '1h',
    replies: {
      count: 5,
      text: '5 replies',
      items: [
        {
          id: '3.1',
          username: 'user1',
          avatar: 'https://picsum.photos/40/40?random=31',
          content: 'Totally agree!',
          timeAgo: '45m',
          likedBy: {
            count: 2,
            text: 'Liked by 2 people',
          },
        },
        {
          id: '3.2',
          username: 'user2',
          avatar: 'https://picsum.photos/40/40?random=32',
          content: 'Amazing!',
          timeAgo: '30m',
          isLiked: true,
        },
        {
          id: '3.3',
          username: 'user3',
          avatar: 'https://picsum.photos/40/40?random=33',
          content: 'Perfect shot',
          timeAgo: '15m',
          replies: {
            count: 2,
            text: '2 replies',
            items: [
              {
                id: '3.3.1',
                username: 'nestedUser1',
                avatar: 'https://picsum.photos/40/40?random=331',
                content: 'Nested reply 1',
                timeAgo: '10m',
              },
              {
                id: '3.3.2',
                username: 'nestedUser2',
                avatar: 'https://picsum.photos/40/40?random=332',
                content: 'Nested reply 2',
                timeAgo: '5m',
              },
            ],
          },
        },
      ],
    },
    likedBy: {
      count: 12,
      text: 'Liked by 12 people',
    },
  },
  {
    id: '4',
    username: 'emmylee',
    avatar: 'https://picsum.photos/40/40?random=4',
    content: '👍🏆',
    timeAgo: '1h',
    likedBy: {
      count: 8,
      text: 'Liked by 8 people',
    },
  },
];
