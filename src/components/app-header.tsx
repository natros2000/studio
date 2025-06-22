import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="border-b border-border/40 bg-card shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Image
            src="https://placehold.co/50x50.png"
            alt="Logo de la Banda"
            width={50}
            height={50}
            className="rounded-full"
            data-ai-hint="music band"
          />
          <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Banda Show Tepuy Roraima
          </h1>
        </div>
      </div>
    </header>
  );
}
