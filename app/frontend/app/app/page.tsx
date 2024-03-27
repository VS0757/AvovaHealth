import BentoCard from "./_components/bento/BentoCard";
import UploadComponent from "./_components/upload/UploadComponent";

export default function App() {
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="mt-16">
        <BentoCard>
          Upload PDF
          <UploadComponent />
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
