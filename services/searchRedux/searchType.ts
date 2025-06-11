export interface ReqSearch {
    page?: number;
    limit?: number;
    refreshToken: string;
    keyword: string;
}

export interface ReqSearchUser {
    refreshToken?: string;
    mode?: string;
    keyword?: string;
    page?: number;
    limit?: number;
}

export interface UserPost {
    _id: string;
    handleName: string;
    profilePic: string;
}

export interface Media {
    _id: string;
    postID: string;
    imageUrl?: string;
    videoUrl?: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface Item {
    _id?: string;
    userID?: string;
    type?: string;
    caption?: string;
    isFlagged?: boolean;
    nsfw?: boolean;
    isEnable?: boolean;
    location?: string;
    isArchived?: string;
    viewCount?: number;
    createdAt?: string;
    updatedAt?: string;
    media?: Media[];
    user?: UserPost;
    commentCount?: number;
    likeCount?: number;
    isLiked?: boolean;
}

export interface Post {
    items: Item[];
    pagination: Pagination;
}

export interface ResSearchPost {
    message: string;
    posts: Post;
    reels: Post;
}

export interface User {
    _id?: string;
    username?: string;
    phoneNumber?: string;
    handleName?: string;
    bio?: string;
    address?: string;
    gender?: string;
    profilePic?: string;
    isVip?: boolean;
    userFollowing?: boolean;
}

export interface UserR {
    items: User[];
    pagination: Pagination;
}

export interface ResSearchUser {
    message: string;
    users: UserR;
}