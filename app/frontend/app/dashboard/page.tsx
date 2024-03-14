import FileUpload from "../upload/FileUpload";
import IntegrateEpic from "../epicIntegration/IntegrateEpic";
import Link from "next/link";
import Image from "next/image";
import { poppins } from "../fonts";
import RetrieveEpic from "../epicIntegration/RetrieveEpic";
import DisplayEpic from "../epicIntegration/DisplayEpic";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default function Dashboard() {
  const {
    getAccessToken,
    getBooleanFlag,
    getFlag,
    getIdToken,
    getIntegerFlag,
    getOrganization,
    getPermission,
    getPermissions,
    getStringFlag,
    getUser,
    getUserOrganizations,
    isAuthenticated,
  } = getKindeServerSession();
  console.log("my user", getUser());

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
          <FileUpload />
          <IntegrateEpic />
          <RetrieveEpic />
          <DisplayEpic />
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
