import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-x grid min-h-svh place-content-center gap-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display text-h2">Test failed.</h1>
      <p className="text-muted">This page doesn&apos;t exist.</p>
      <Link href="/" className="btn btn-primary mx-auto">
        Back home
      </Link>
    </main>
  );
}
