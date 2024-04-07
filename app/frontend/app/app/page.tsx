import Card from "@/_components/card";
import BiomarkerTable from "@/_components/dashboard/biomarker_table";
import RangeGraphCard from "@/_components/dashboard/range_graph";
import SummaryCard from "@/_components/dashboard/summary";
import { Suspense } from "react";

export default function App() {
  return (
    <main>
      <div className="mb-16 grid grid-cols-[1fr_580px] gap-6">
        <Card>
          <SummaryCard />
        </Card>
        <Card>
          <Suspense fallback={null}>
            <RangeGraphCard />
          </Suspense>
        </Card>
      </div>
      <div className="mb-16">
        <h1 className="mb-6">Biomarkers</h1>
        <Card>
          <BiomarkerTable />
        </Card>
      </div>
    </main>
  );
}
