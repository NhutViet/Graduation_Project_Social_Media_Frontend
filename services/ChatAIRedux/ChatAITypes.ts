export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export interface ItemChatAI {
    _id?: string;
    userId?: string;
    prompt?: string;
    answer?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ResHistoryChatAI {
    data: ItemChatAI[];
    pagination: Pagination;
}

