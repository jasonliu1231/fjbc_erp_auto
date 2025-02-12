import Navbar from "./navbar";

export default function Home({ children }) {
  return (
    <>
      <html
        lang="zh-Hant"
        className="min-h-screen bg-slate-300"
      >
        <head>
          <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>
        </head>
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </>
  );
}
