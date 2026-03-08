import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
}: SearchBarProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">
          Blog sur le développement Web
        </CardTitle>
        <CardDescription>
          Découvrez les derniers articles ou recherchez par titre.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form
          className="flex flex-col gap-2 md:flex-row md:items-center"
          role="search"
          aria-label="Rechercher des articles par titre"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="sr-only" htmlFor="search">
            Rechercher un article par titre
          </label>
          <Input
            id="search"
            type="search"
            placeholder="Rechercher un article par titre…"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            className="md:flex-1"
          />
          <Button
            type="submit"
            className="md:ml-2"
            disabled={isLoading}
          >
            {isLoading ? "Recherche en cours…" : "Rechercher"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


