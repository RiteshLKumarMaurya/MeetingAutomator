"use client";
import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WorkflowDownload } from "@/components/WorkflowDownload";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const admin = pathname?.startsWith("/admin");
  const hasInlineWorkflow = pathname === "/" || pathname === "/workflow";
  if (admin) return <main>{children}</main>;
  return <><SiteHeader />{!hasInlineWorkflow && <WorkflowDownload />}<main>{children}</main><SiteFooter /></>;
}
