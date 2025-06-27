export interface Post {
    id: string;
    caption: string;
}

export interface User {
    id: string;
    username: string;
    handleName: string;
    profilePic: string;
}

export interface Noti {
    id: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    actors: User[];
    caption: string;
    extraCount: number;
    postId: string;
    image?: string | null;
}
