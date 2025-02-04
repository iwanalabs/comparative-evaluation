import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-semibold text-xl">LLM Output Comparison</span>
        </Link>
      </div>
    </header>
  );
}
