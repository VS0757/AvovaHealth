import { GeistSans } from "geist/font/sans";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Link from "next/link";
import Name from "./_components/kinde/Name";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`${GeistSans.className} flex min-h-screen flex-col bg-stone-100 text-sm text-stone-800 dark:bg-stone-950 dark:text-stone-400`}
    >
      <nav
        className={`fixed top-1/2 mx-2 max-w-12 -translate-y-1/2 transform overflow-clip rounded-3xl bg-stone-200 px-4 py-2 dark:bg-stone-900`}
      >
        <Link href="/app" className={`flex flex-row py-2`}>
          <FeatherIcon icon="home" className={`my-auto h-4 min-w-4`} />
        </Link>
        <Link href="/app" className={`flex flex-row py-2`}>
          <FeatherIcon icon="list" className={`my-auto h-4 min-w-4`} />
        </Link>
        <Link href="/app" className={`flex flex-row py-2`}>
          <FeatherIcon icon="trending-up" className={`my-auto h-4 min-w-4`} />
        </Link>
        <Link href="/app" className={`flex flex-row py-2`}>
          <FeatherIcon icon="inbox" className={`my-auto h-4 min-w-4`} />
        </Link>
        <Link href="/app" className={`flex flex-row py-2`}>
          <FeatherIcon icon="settings" className={`my-auto h-4 min-w-4`} />
        </Link>
      </nav>
      <section className={`mx-auto my-12 min-w-80 max-w-lg flex-1`}>
        {children}
      </section>
      <footer
        className={`fixed bottom-0 flex h-16 w-full justify-between border-t bg-stone-50 px-6 dark:border-stone-900 dark:bg-stone-950`}
      >
        <Image
          src="/avova_red.png"
          alt="Avova Health"
          height={48}
          width={100}
          className={`object-contain`}
        />
        <div className={`flex h-full flex-col items-end justify-center`}>
          <div className={`h-6 w-6 rounded-full bg-stone-500`}> </div>
          <Name />
        </div>
      </footer>
    </main>
  );
}
