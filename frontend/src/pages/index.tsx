import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/Feedback";
import { useGetArticlesQuery } from "@/graphql/generated/schema";
import { useToast } from "@/components/ui/toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<string | undefined>(undefined);
  const { addToast } = useToast();

  const { data, loading, error, refetch } = useGetArticlesQuery({
    variables: {
      limit: 5,
      title: appliedSearch,
    },
    fetchPolicy: "network-only",
  });

  const handleSubmitSearch = () => {
    const value = search.trim();
    setAppliedSearch(value.length > 0 ? value : undefined);

    void refetch({
      limit: 5,
      title: value.length > 0 ? value : undefined,
    });
  };

  const articles = data?.articles ?? [];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const deleted = window.sessionStorage.getItem("articleDeleted");

    if (deleted) {
      window.sessionStorage.removeItem("articleDeleted");
      addToast({
        title: "Article supprimé",
        description: "L’article a été supprimé avec succès.",
      });
    }
  }, [addToast]);

  return (
    <>
      <Head>
        <title>DevBlog – Articles sur le développement Web</title>
        <meta
          name="description"
          content="Découvrez les derniers articles du blog sur le développement Web et recherchez des contenus par titre."
        />
      </Head>
        <div className="space-y-8">

          {/* HEADER */}
          <div className="space-y-3">
            <Badge className="bg-secondary text-secondary-foreground">
              DevBlog
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight">
              Articles sur le développement Web
            </h1>

            <p className="text-muted-foreground max-w-xl">
              Découvrez les derniers articles publiés et recherchez des contenus
              par titre.
            </p>
          </div>

          {/* SEARCH */}
          <Card>
            <CardHeader>
              <CardTitle>Rechercher un article</CardTitle>
              <CardDescription>
                Entrez un mot-clé pour filtrer les articles
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Rechercher un titre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <Button
                  onClick={handleSubmitSearch}
                  disabled={loading}
                >
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ARTICLES */}
          <section className="space-y-6">

            {loading && !data ? (
              <LoadingState />
            ) : error ? (
              <ErrorState message={error.message} />
            ) : articles.length === 0 ? (
              <EmptyState
                title="Aucun article trouvé"
                description={
                  appliedSearch
                    ? "Aucun article ne correspond à votre recherche."
                    : "Il n’y a pas encore d’articles publiés."
                }
              />
            ) : (
              <>
                {appliedSearch ? (
                  <p className="text-sm text-muted-foreground">
                    Résultats pour <strong>« {appliedSearch} »</strong> ({articles.length})
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Les 5 derniers articles publiés
                  </p>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}
          </section>
          <div className="flex justify-end pt-4">
            <Link href="/create">
              <Button size="sm">
                Créer un article
              </Button>
            </Link>
          </div>
        </div>
    </>
  );
}