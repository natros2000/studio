import { Music2 } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Music2 className="h-6 w-6" />
          </div>
          <h1 className="font-headline text-xl font-bold tracking-tight text-foreground md:text-2xl">
            Registro Banda Show Tepuy Roraima
          </h1>
        </div>
      </div>
    </header>
  );
}
