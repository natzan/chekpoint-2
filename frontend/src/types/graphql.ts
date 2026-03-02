export type Article = {
  id: string;
  title: string;
  mainPictureUrl: string;
  createdAt: string;
};

export type GetLatestArticlesData = {
  articles: Article[];
};
