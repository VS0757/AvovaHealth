"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getUserName(): Promise<string> {
  const { getIdToken } = getKindeServerSession();
  return (await getIdToken()).name ?? "";
}

export async function getUserId(): Promise<string> {
  const { getIdToken } = getKindeServerSession();
  return (await getIdToken()).sub ?? "";
}
