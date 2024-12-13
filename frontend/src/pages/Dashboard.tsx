import React from "react";
import { useSession } from "../context/Session";

function Dashboard() {
  const session = useSession();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>{JSON.stringify(session)}</p>
      <p>{import.meta.env.VITE_SERVER_URL}</p>
    </div>
  );
}

export default Dashboard;
