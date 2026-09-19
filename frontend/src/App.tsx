import GhostFiberGlass from "./components/background/GhostFiberGlass";

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <GhostFiberGlass />

      {/* Content */}
      <div className="relative z-10 p-10">
        <h1 className="text-4xl font-bold text-white">
          Inventory Manager
        </h1>

        <p className="mt-4 text-white/70">
          Manage your inventory easily.
        </p>
      </div>
    </main>
  );
}

export default App;