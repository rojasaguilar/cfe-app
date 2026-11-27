import { eventEmitter } from "./../eventEmmiter.js";
import {
  sendEventToRole,
  sendEventToUser,
} from "./../../events/events.controller.js";

export const loginListener = () => {
  eventEmitter.on("login", (userAccount) => {
    console.log("Usuario logeado:", userAccount);
    sendEventToUser(userAccount.usuarioid, "logger", "new user logged");
    sendEventToRole("administrador", "logger", "admin logged");
  });
};
