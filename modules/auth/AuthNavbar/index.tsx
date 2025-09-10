import Link from "next/link";

export default function AuthNavbar() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex h-12 md:h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold text-primary">
          MyStore
        </Link>
      </div>
    </header>
  );
}
