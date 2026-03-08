import Link from "next/link";
import type { GetArticlesQuery } from "@/graphql/generated/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ArticleCardArticle = GetArticlesQuery["articles"][number];

type ArticleCardProps = {
  article: ArticleCardArticle;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const createdAt = new Date(article.createdAt).toLocaleDateString();

  return (
    <Card className="flex h-full flex-col overflow-hidden" role="article">
      {article.mainPictureUrl && (
        <div className="w-full overflow-hidden aspect-4/3">
          <img
            src={article.mainPictureUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          {article.category && (
            <Badge className="shrink-0">
              {article.category.name}
            </Badge>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Publié le {createdAt}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-end">
          <Link href={`/${article.id}`} aria-label={`Lire l’article ${article.title}`}>
            <Button variant="outline" size="sm">
              Lire
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

