import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function LoadingState() {
  return (
    <div className="flex justify-center py-10">
      <Spinner label="Chargement des articles" />
    </div>
  );
}

type ErrorStateProps = {
  message?: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <span>
        {message ?? "Une erreur est survenue lors du chargement des articles."}
      </span>
    </Alert>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent />
    </Card>
  );
}


