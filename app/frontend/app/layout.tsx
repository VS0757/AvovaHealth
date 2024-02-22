import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Include the Inter font using a traditional link tag */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
        {/* Ensure your title and meta description are handled per-page or in a custom _document.js */}
      </head>
      <body>{children}</body>
    </html>
  );
}
