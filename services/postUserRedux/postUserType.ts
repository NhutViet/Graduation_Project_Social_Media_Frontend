export interface ReqGetPosts {
    type?: string;
    page?: number;
    limit?: number;
    refreshToken: string;
}

export interface Media {
    _id: string;
    postID: string;
    videoUrl: string;
}

export interface MediaR {
    _id: string;
    postID: string;
    imageUrl: string;
}

export interface Item {
    _id: string;
    userID: string;
    type: string;
    caption: string;
    isFlagged: boolean;
    nsfw: boolean;
    isEnable: boolean;
    location: string;
    isArchived: string;
    viewCount: number,
    createdAt: string;
    updatedAt: string;
    share?: number;
    media: Media[] | MediaR[];
    likeCount: number;
    isLike: boolean;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface Load {
    items: Item[] | [];
    pagination: Pagination;
}

export interface ResGetPost {
    message: string;
    posts: Load;
}

export interface ResGetReels {
    message: string;
    reels: Load;
}