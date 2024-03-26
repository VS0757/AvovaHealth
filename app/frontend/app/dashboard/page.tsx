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
  return <main className="flex min-h-screen flex-col align-middle"></main>;
}
