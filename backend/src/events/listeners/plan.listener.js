import { eventEmitter } from "./../eventEmmiter.js";
import {
  sendEventToRole,
  sendEventToUser,
} from "./../../events/events.controller.js";

export const registerPlanListeners = () => {
  eventEmitter.on("plan.created", (plan) => {
    console.log("Nuevo plan de capacitación creado:", plan);

    sendEventToRole("administrador", "plan.created", plan);
  });
};
