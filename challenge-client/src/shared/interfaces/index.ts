export interface IUser {
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
  token: string;
}

export interface IArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
  tagList: string[];
  favoritesCount: number;
  favorited: boolean;
}
