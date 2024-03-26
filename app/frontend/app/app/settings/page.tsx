import IntegrateEpic from "../_components/integrations/IntegrateEpic";

export default function Settings() {
  return (
    <main>
      <h1>Settings</h1>
      <div className="mt-16">
        <section>
          <p>Manage Epic Integration</p>
          <IntegrateEpic />
        </section>
      </div>
    </main>
  );
}
