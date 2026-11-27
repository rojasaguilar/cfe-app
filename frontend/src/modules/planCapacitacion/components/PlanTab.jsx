import { useState } from "react";
import { useSSEEvent } from "../../../hooks/useSSEEvent";

export const PlanTab = () => {
  const [plan, setPlan] = useState({});

  useSSEEvent("plan.created", (data) => {
    console.log("Nuevo Plan:", data);
    setPlan(data);
  });

  if (!plan) return ( <h1>No hay plan</h1>)

  return (
    <>
      <div>Planes Capacitacion</div>

      <div>{plan.planid}</div>
    </>
  );
};
