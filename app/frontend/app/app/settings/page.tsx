import DemographicsSettings from "../_components/settings/demographics";
import MedicationsSettings from "../_components/settings/medications";
import PatientHistorySettings from "../_components/settings/patienthistory";
import {
  UserData,
  externalGetUserData,
} from "../_components/settings/userDataActions";

export default async function Settings() {
  const userData: UserData = await externalGetUserData();

  return (
    <main>
      <h1>Profile</h1>
      <div className="mt-16">
        <section className="mt-8">
          <p>Demographics</p>
          <DemographicsSettings
            initialSex={userData.sex}
            initialBirthday={userData.birthday}
          />
        </section>
        <section className="mt-8">
          <p>Medications</p>
          <MedicationsSettings initialMedications={userData.medications} />
        </section>
        <section className="mt-8">
          <p>Patient History</p>
          <PatientHistorySettings initialConditions={userData.preconditions} />
        </section>
      </div>
    </main>
  );
}
