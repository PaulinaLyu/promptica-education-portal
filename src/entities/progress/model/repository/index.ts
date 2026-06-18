import { LocalStorageProgressStorage } from "../storage";
import { DefaultProgressRepository } from "./DefaultProgressRepository";

export { DefaultProgressRepository } from "./DefaultProgressRepository";
export type { ProgressRepository } from "./ProgressRepository";

export const progressRepository = new DefaultProgressRepository(new LocalStorageProgressStorage());
