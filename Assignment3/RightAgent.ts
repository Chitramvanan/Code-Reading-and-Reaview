import { AgentBehavior, Player, Motion } from "./AgentType"
import { ScreenPart } from "./GameRunner"

export class RightAgent implements AgentBehavior {
    agentName(): Player {
        return "A";
    }
    agentMove(screenPart: ScreenPart): Motion {
        return "right";
    }

}