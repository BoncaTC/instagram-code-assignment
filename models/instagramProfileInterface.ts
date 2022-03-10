export interface UserProfile {
  lastRetrievedDateTime: Date;
  biography: string;
  fullName: string;
  followersCount: number;
  mostRecentPost: MostRecentPost;
}

export interface MostRecentPost {
  mediaUrl: string;
  numberOfLikes: number;
  numberOfComments: number;
  postType: string;
}
