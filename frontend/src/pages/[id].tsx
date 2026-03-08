import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/Feedback";
import {
  type Article,
  useGetArticleQuery,
  useDeleteArticleMutation,
} from "@/graphql/generated/schema";

export default function ArticleDetailPage() {
  const router = useRouter();
  const idParam = router.query.id;
  const id = typeof idParam === "string" ? Number(idParam) : NaN;

  const [showConfirm, setShowConfirm] = useState(false);

  const { data, loading, error } = useGetArticleQuery({
    skip: Number.isNaN(id),
    variables: { id },
  });

  const [deleteArticle, { loading: deleting }] = useDeleteArticleMutation();

  const article = data?.article as Article | null | undefined;

  const handleDelete = async () => {
    if (!article) return;
    const result = await deleteArticle({
      variables: { id: article.id },
    });
    if (result.data?.deleteArticle) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("articleDeleted", "1");
      }
      await router.push("/");
    }
  };

  const pageTitle = article
    ? `${article.title} – DevBlog`
    : "Article – DevBlog";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {article ? (
          <meta
            name="description"
            content={article.body.slice(0, 150)}
          />
        ) : null}
      </Head>
        {loading && !data ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} />
        ) : !article ? (
          <EmptyState
            title="Article introuvable"
            description="L’article que vous recherchez n’existe pas ou plus."
          />
        ) : (
          <article className="space-y-6">
            <header className="space-y-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {article.title}
                  </h1>
                  <Badge>{article.category.name}</Badge>
                </div>
                <p className="text-sm text-slate-600">
                  Publié le{" "}
                  {new Date(article.createdAt).toLocaleDateString()}{" "}
                  {article.updatedAt !== article.createdAt && (
                    <span>
                      {" "}
                      · Mis à jour le{" "}
                      {new Date(article.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </header>

            {article.mainPictureUrl && (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={article.mainPictureUrl}
                  alt={article.title}
                  className="h-72 w-full object-cover"
                />
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Contenu de l’article</CardTitle>
                <CardDescription>
                  Corps de l’article tel qu’il a été publié.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-slate-800">
                  {article.body}
                </p>
              </CardContent>
            </Card>

            <section aria-labelledby="article-actions" className="space-y-3">
              <h2 id="article-actions" className="sr-only">
                Actions sur l’article
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  Retour
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowConfirm(true)}
                >
                  Supprimer l’article
                </Button>
              </div>

              {showConfirm ? (
                <Card
                  aria-live="polite"
                  aria-label="Confirmation de suppression de l’article"
                >
                  <CardHeader>
                    <CardTitle>Confirmer la suppression</CardTitle>
                    <CardDescription>
                      Cette action est définitive. L’article sera supprimé du
                      blog.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowConfirm(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleting}
                    >
                      {deleting ? "Suppression…" : "Confirmer la suppression"}
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </section>
          </article>
        )}
    </>
  );
}

