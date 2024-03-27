import IntegrateEpic from "../_components/integrations/IntegrateEpic";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import RetrieveEpic from "../_components/integrations/RetrieveEpic";

export default async function Settings() {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;
  return (
    <main>
      <h1>Settings</h1>
      <div className="mt-16">
        <section>
          <p>Manage Epic Integration</p>
          <IntegrateEpic />
          <RetrieveEpic uniqueUserId={uniqueUserId} />
        </section>
      </div>
    </main>
  );
}
