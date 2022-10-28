// imports
import { CommandInt } from "../types/CommandInt";
import { setup } from "./setup";
import { updateevents } from "./updateevents";
import { updatesettings } from "./updatesettings";

// command list
// prettier-ignore
export const CommandList: CommandInt[] = [
  setup, updateevents, updatesettings
];
