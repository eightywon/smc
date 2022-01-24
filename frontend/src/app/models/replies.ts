import User from "./users"

export default class Reply {
    postText: string;
    postedByUserId: string;
    postDate: Date;
    _id: string;
    parentId: string;
    users: User;
    displayName: string;
   }
   