import { eventEmitter } from "../eventEmmiter.js";
import {
  sendEventToRole,
  sendEventToUser,
} from "../events.controller.js";

export const NecesidadListeners = () => {
  eventEmitter.on("necesidad.created", (necesidad) => {
    console.log("Nueva necesidad de capacitación creada:", necesidad);

    sendEventToRole("administrador", "necesidad.created", necesidad);
  });
};
