export default function BentoCard({ children }: any) {
  return (
    <div
      className={`min-h-24 min-w-32 rounded-md border p-4 dark:border-stone-900`}
    >
      {children}
    </div>
  );
}
