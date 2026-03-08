import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            DevBlog
          </h1>
          <nav aria-label="Navigation principale" className="flex gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Accueil
              </Button>
            </Link>
            <Link href="/articles/create">
              <Button size="sm">
                Nouveau
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
