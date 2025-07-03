export interface Receiver {
    userId: string;
    isRead: boolean;
}

export interface ItemNoti {
    _id: string;
    receiver: Receiver[];
    senderId: string;
    title: string;
    body: string;
    data: any;
    createdAt: string;
    updatedAt: string;
    isRead: false;
}

export interface ResNoti {
    success: boolean;
    notifications: ItemNoti[];
}