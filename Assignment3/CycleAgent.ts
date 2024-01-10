import { AgentBehavior, Player, Motion } from "./AgentType"
import { ScreenPart } from "./GameRunner"

export class CycleAgent implements AgentBehavior {

    private cIndex: number;
    private cCycle: Motion[];

    constructor() {
        this.cIndex = 0
        this.cCycle = ["up", "up", "right", "down", "right"];
    }

    agentName(): Player {
        return "C";
    }

    agentMove(screenPart: ScreenPart): Motion {
        const generatedMotion: Motion = this.cCycle[this.cIndex];
        this.cIndex++;
        this.cIndex = this.cIndex % this.cCycle.length;
        return generatedMotion;
    }

}