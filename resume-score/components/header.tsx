import Link from "next/link";
import { productName } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d8d1c5] bg-[#f3f0e9]/92 backdrop-blur-xl">
      <div className="nexx-shell flex items-center justify-between py-4">
      <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[#151512]">
        <span className="grid h-8 w-8 place-items-center rounded-full border border-[#151512] text-xs text-[#151512]">R</span>
        <span>{productName}</span>
      </Link>
      <nav className="hidden items-center gap-7 text-sm text-[#6f6a5f] sm:flex">
        <Link href="/#signals" className="hover:text-[#151512]">Signals</Link>
        <Link href="/#report" className="hover:text-[#151512]">Report</Link>
        <Link href="/#pricing" className="hover:text-[#151512]">Pricing</Link>
      </nav>
      <Link
        href="/upload"
        className="nexx-button-primary min-h-0 px-4 py-2"
      >
        Start free
      </Link>
      </div>
    </header>
  );
}
