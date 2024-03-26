import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Name() {
  const { getIdToken } = getKindeServerSession();
  const userName = (await getIdToken()).name;

  return <p className={`h-fit opacity-50`}>{userName}</p>;
}
