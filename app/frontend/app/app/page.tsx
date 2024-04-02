import BentoCard from "./_components/bento/BentoCard";
import UploadComponent from "./_components/upload/UploadComponent";
import IntegrateEpic from "./_components/integrations/IntegrateEpic";
import RetrieveEpic from "./_components/integrations/RetrieveEpic";
import {
  UserData,
  externalGetUserData,
} from "./_components/settings/userDataActions";

export default async function App() {
  const userData: UserData = await externalGetUserData();

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="mt-16 flex flex-col gap-2">
        <BentoCard>
          Upload PDF
          <UploadComponent />
        </BentoCard>
        <BentoCard>
          <p>Manage Epic Integration</p>
          <IntegrateEpic />
          <RetrieveEpic uniqueUserId={userData.uniqueUserId} />
        </BentoCard>
        <div className={`mt-4 grid grid-cols-2 gap-2`}>
          <BentoCard>
            Timeline Preview Card
            <div className="mt-2 min-h-24 min-w-full rounded-md bg-stone-200 dark:bg-stone-900"></div>
          </BentoCard>
          <BentoCard>
            Trends Preview Card
            <div className="mt-2 min-h-24 min-w-full rounded-md bg-stone-200 dark:bg-stone-900"></div>
          </BentoCard>
          <BentoCard>
            Inbox Preview Card
            <div className="mt-2 min-h-24 min-w-full rounded-md bg-stone-200 dark:bg-stone-900"></div>
          </BentoCard>
          <BentoCard>
            Summary Preview Card
            <div className="mt-2 min-h-24 min-w-full rounded-md bg-stone-200 dark:bg-stone-900"></div>
          </BentoCard>
        </div>
      </div>
    </main>
  );
}
