import FileUpload from "../upload/FileUpload";
import IntegrateEpic from "../epicIntegration/IntegrateEpic";
import Link from "next/link";
import Image from "next/image";
import { poppins } from "../fonts";
import RetrieveEpic from "../epicIntegration/RetrieveEpic";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Dashboard() {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).jti;
  return (
    <main className="flex min-h-screen flex-col align-middle">
      <header className="flex w-full flex-row justify-between border-b p-4 align-middle tracking-tighter">
        <Image
          src="/avova_red.png"
          alt="Avova Health"
          width={120}
          height={60}
        />
        <LogoutLink className={`text-sm text-gray-400 ${poppins.className}`}>
          Sign Out
        </LogoutLink>
      </header>
      <div className="mx-auto h-max max-w-lg flex-1 gap-x-4">
        <div className="rounded-lg p-4">
          <h1 className={`my-4 text-3xl font-extrabold ${poppins.className}`}>
            upload
          </h1>
          <FileUpload uniqueUserId={uniqueUserId}/>
          <IntegrateEpic />
          <RetrieveEpic uniqueUserId={uniqueUserId} />
        </div>
      </div>
      <footer className="flex w-full flex-row justify-end border-t p-4 text-xs text-gray-400">
        <Link href="/terms" className="mx-8">
          Terms and Conditions
        </Link>
        <p>Copyright Avova Health 2024</p>
      </footer>
    </main>
  );
}
