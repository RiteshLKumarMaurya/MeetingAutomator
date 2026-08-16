"use client";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const admin = pathname?.startsWith("/admin");
  if (admin) return <main>{children}</main>;
  return <><SiteHeader /><main>{children}</main><SiteFooter /></>;
}
