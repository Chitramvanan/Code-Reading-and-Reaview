import { ScreenPart } from "./GameRunner";
export type Player = "A" | "B" | "C" | "D";

export type Motion = "up" | "down" | "left" | "right";


export interface AgentBehavior {
  agentMove(screenPart: ScreenPart): Motion;
}
