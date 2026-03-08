import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import {
  useCreateArticleMutation,
  useGetCategoriesQuery,
} from "@/graphql/generated/schema";

type FieldErrors = {
  title?: string;
  categoryId?: string;
  mainPictureUrl?: string;
  body?: string;
};

export default function CreateArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mainPictureUrl, setMainPictureUrl] = useState("");
  const [body, setBody] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const { data: categoriesData, loading: loadingCategories, error: categoriesError } =
    useGetCategoriesQuery();

  const [createArticle, { loading: creating }] = useCreateArticleMutation();

  const categories = categoriesData?.categories ?? [];

  const validate = (): boolean => {
    const errors: FieldErrors = {};

    if (!title.trim()) {
      errors.title = "Le titre est obligatoire.";
    }
    if (!categoryId) {
      errors.categoryId = "La catégorie est obligatoire.";
    }
    if (!mainPictureUrl.trim()) {
      errors.mainPictureUrl = "L’URL de l’image principale est obligatoire.";
    }
    if (!body.trim()) {
      errors.body = "Le corps de l’article est obligatoire.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    const categoryIdNumber = Number(categoryId);
    if (Number.isNaN(categoryIdNumber)) {
      setFieldErrors((prev) => ({
        ...prev,
        categoryId: "La catégorie sélectionnée est invalide.",
      }));
      return;
    }

    try {
      const result = await createArticle({
        variables: {
          data: {
            title,
            body,
            mainPictureUrl,
            category: {
              id: categoryIdNumber,
            },
          },
        },
      });

      const created = result.data?.createArticle;
      if (created) {
        await router.push(`/articles/${created.id}`);
      } else {
        setFormError("Impossible de créer l’article. Veuillez réessayer.");
      }
    } catch (error) {
      setFormError("Une erreur est survenue lors de la création de l’article.");
    }
  };

  return (
    <>
      <Head>
        <title>Créer un article – DevBlog</title>
        <meta
          name="description"
          content="Créer un nouvel article pour le blog de développement Web."
        />
      </Head>
        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel article</CardTitle>
          </CardHeader>
          <CardContent>
            {categoriesError ? (
              <Alert variant="destructive" className="mb-4">
                Impossible de charger les catégories. Veuillez recharger la page.
              </Alert>
            ) : null}

            {formError ? (
              <Alert variant="destructive" className="mb-4">
                {formError}
              </Alert>
            ) : null}

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-describedby={
                formError ? "form-error" : undefined
              }
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    aria-describedby={
                      fieldErrors.title ? "title-error" : undefined
                    }
                  />
                  {fieldErrors.title ? (
                    <p
                      id="title-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {fieldErrors.title}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    name="category"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    disabled={loadingCategories}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-describedby={
                      fieldErrors.categoryId ? "category-error" : undefined
                    }
                  >
                    <option value="">
                      {loadingCategories
                        ? "Chargement des catégories…"
                        : "Sélectionnez une catégorie"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.categoryId ? (
                    <p
                      id="category-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {fieldErrors.categoryId}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="mainPictureUrl">
                    URL de l’image principale
                  </Label>
                  <Input
                    id="mainPictureUrl"
                    name="mainPictureUrl"
                    type="url"
                    value={mainPictureUrl}
                    onChange={(event) =>
                      setMainPictureUrl(event.target.value)
                    }
                    aria-describedby={
                      fieldErrors.mainPictureUrl
                        ? "mainPictureUrl-error"
                        : undefined
                    }
                  />
                  {fieldErrors.mainPictureUrl ? (
                    <p
                      id="mainPictureUrl-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {fieldErrors.mainPictureUrl}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="body">Contenu de l’article</Label>
                  <Textarea
                    id="body"
                    name="body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    aria-describedby={
                      fieldErrors.body ? "body-error" : undefined
                    }
                  />
                  {fieldErrors.body ? (
                    <p
                      id="body-error"
                      className="mt-1 text-sm text-red-600"
                    >
                      {fieldErrors.body}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={creating || loadingCategories}
                >
                  {creating ? "Création en cours…" : "Créer l’article"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </>
  );
}

