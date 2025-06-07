export interface Liker {
    userId: string;
    username: string;
    handleName: string;
    profilePic: string;
    userFollowing?: boolean;
}

export interface ResLikersAPost {
    message: string;
    data: Liker[];
}

export interface rejectValue {
    status: number;
    message: string;
}