import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import GET_LATEST_ARTICLES from "@/graphql/queries/getLatestArticles.gql";
import type { GetLatestArticlesData } from "@/types/graphql";

export default function Home() {
  const { data, loading, error } = useQuery<GetLatestArticlesData>(GET_LATEST_ARTICLES);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des articles.</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Derniers articles</h1>

      <div style={{ display: "grid", gap: "2rem", marginTop: "2rem" }}>
        {data?.articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <div style={{ cursor: "pointer" }}>
              <Image
                src={article.mainPictureUrl}
                alt={article.title}
                width={600}
                height={400}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
              <h2 style={{ marginTop: "1rem" }}>{article.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
