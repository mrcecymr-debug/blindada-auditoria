import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Casa Blindada MR@</title>

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#060E1A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Casa Blindada" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <link rel="icon" href="/favicon.ico" />

        <ScrollViewStyleReset />

        <style
          dangerouslySetInnerHTML={{
            __html: `
html, body { height: 100%; }
body { overflow: hidden; }
#root { display: flex; height: 100%; flex: 1; }
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
