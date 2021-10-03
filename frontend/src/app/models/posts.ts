import User from "./users"

export default class Post {
 postText: string;
 postedByUserId: string;
 postDate: Date;
 _id: string;
 users: Array<User>=[];
}
