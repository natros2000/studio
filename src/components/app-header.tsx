import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="border-b border-border/40 bg-card shadow-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Image
            src="https://1.bp.blogspot.com/-N5-d1c8pM7k/YCx_c2E4qXI/AAAAAAAAABg/f5Y7cW_Qzoc2YFpE-yqfGgGvO4Fmv_g5gCLcBGAsYHQ/w400-h400/LOGO%2BDE%2BLA%2BBANDA.jpg"
            alt="Logo de la Banda"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Banda Show Tepuy Roraima
          </h1>
        </div>
      </div>
    </header>
  );
}
