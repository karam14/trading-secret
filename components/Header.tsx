
export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex gap-8 justify-center items-center">
        <a href="/" target="_blank" rel="noreferrer">

        </a>
        <span className="border-l rotate-45 h-6" />
        <a href="/about" target="_blank" rel="noreferrer">

        </a>
      </div>
      <h1 className="sr-only">Trading Academy</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        Welcome to the Trading Academy - Master the Art of Trading
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
