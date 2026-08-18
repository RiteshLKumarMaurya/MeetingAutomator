import type { Metadata } from "next";
import "./globals.css";
import { SiteChrome } from "@/components/SiteChrome";

const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export const metadata: Metadata = {
  title: "Meeting Automator — Consultation Booking Systems for Agencies",
  description:
    "Meeting Automator builds and integrates one-to-one consultation booking systems for agencies, consultants and service businesses — reducing manual scheduling from booking to Google Meet and guest self-management.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const themeScript = `(() => {
  try {
    const saved = localStorage.getItem('meetingautomator-theme-v2');
    // Night mode is the product default. Respect an explicit user choice afterward.
    const theme = saved === 'light' || saved === 'dark' ? saved : 'dark';

    document.documentElement.dataset.theme = theme;
  } catch {}
})()`;

const clarityScript = `
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){
      (c[a].q=c[a].q||[]).push(arguments)
    };
    t=l.createElement(r);
    t.async=1;
    t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />

        {clarityId && (
          <script
            dangerouslySetInnerHTML={{
              __html: clarityScript,
            }}
          />
        )}
      </head>

      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}