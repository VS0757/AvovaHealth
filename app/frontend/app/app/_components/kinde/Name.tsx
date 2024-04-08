import { getUserName } from "@/_lib/actions";

export default async function Name() {
  const userName = (await getUserName());

  return <p className={`h-fit opacity-50`}>{userName}</p>;
}
