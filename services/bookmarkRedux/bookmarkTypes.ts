export interface ReqBookmark {
    postId?: string;
    playlistId?: string;
    refreshToken?: string;
};

export interface ReqRemoveBookmark {
    postId: string;
    playlistId?: string;
    refreshToken?: string;
};

export interface ResBookmark {
    playlistID: string;
    itemID: string;
    itemType: string;
    isDeleted: boolean;
    _id: string;
    createdAt: string;
    updateAt: string;
};

export interface ReqCreatePlaylist {
    playlistName: string;
    refreshToken: string;
}

export interface ResCreatePlaylist {
    id: string;
    playlistName: string;
    postCount: number;
    isDelete: boolean;
}

export interface Playlist {
    userID: string;
    playlistName: string;
    coverImage: string;
    postCount: number;
    isDeleted: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ResAllPlaylist {
    data: Playlist[];
}

export interface PlaylistItem {
    _id: string;
    playlistID: string;
    itemID: string;
    itemType: string;
    isDeleted: boolean;
    createdAt: string;
    updateAt: string;
}

export interface Pagination {
    currentPage: number;
    totalPage: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ResGetItemPlaylist {
    message: string;
    items: PlaylistItem[];
    pagination: Pagination;
    playlistId: string;
}

export interface ReqGetItemPlaylist {
    playlistId: string;
    refreshToken: string;
    page?: number;
    limit?: number;
}