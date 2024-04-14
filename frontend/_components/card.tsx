export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
      {children}
    </div>
  );
}
