import IntegrateEpic from "../_components/integrations/IntegrateEpic";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import RetrieveEpic from "../_components/integrations/RetrieveEpic";
import DemographicsSettings from "../_components/settings/demographics";
import MedicationsSettings from "../_components/settings/medications";
import PatientHistorySettings from "../_components/settings/patienthistory";

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
        <section className="mt-8">
          <p>Demographics</p>
          <DemographicsSettings />
        </section>
        <section className="mt-8">
          <p>Medications</p>
          <MedicationsSettings />
        </section>
        <section className="mt-8">
          <p>Patient History</p>
          <PatientHistorySettings />
        </section>
      </div>
    </main>
  );
}
