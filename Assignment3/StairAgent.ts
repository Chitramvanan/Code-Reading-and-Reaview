import { AgentBehavior, Motion } from "./AgentType";
import { ScreenPart } from "./GameRunner";

export class StairAgent implements AgentBehavior {
  private movesLeft: number = 1;
  private movesUp: number = 1;
  private direction: Motion = 'left';
  private moveCounter: number = 0;

  agentMove(screenPart: ScreenPart): Motion {
    this.moveCounter++;
    if (this.direction === 'left') {
      if (this.moveCounter === this.movesLeft) {
        this.moveCounter = 0;
        this.movesLeft++;
        this.direction = 'up';
      }
      return 'left';
    } else {
      if (this.moveCounter === this.movesUp) {
        this.moveCounter = 0;
        this.movesUp++;
        this.direction = 'left';
      }
      return 'up';
    }
  }
}
