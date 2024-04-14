import { redirect } from "next/navigation";

export default async function Redirect() {
  redirect("/app");

  return <main>hi</main>;
}
