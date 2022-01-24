import User from "./users"
import Reply from "./replies"

export default class Post {
 postText: string;
 postedByUserId: string;
 postDate: Date;
 _id: string;
 postUser: User;
 parentId: string;
 replies: Array<Reply>=[];
}
