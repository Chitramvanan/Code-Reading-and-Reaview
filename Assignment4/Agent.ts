import { ScreenPart } from "./GameRunner";
import { LocalDate, DayOfWeek } from "@js-joda/core";

export type Player = "A" | "B" | "C" | "D";
export type Motion = "up" | "down" | "left" | "right";


export interface AgentBehavior {
  agentMove(screenPart: ScreenPart): Motion;
}

/**
 * Right agent always moves right.
 */
export class RightAgent implements AgentBehavior {
  public agentMove(screenPart: ScreenPart): Motion {
    return "right";
  }
}

/**
 * Tuesday agent always moves up on Tuesdays and always moves down on other days of the week.
 */
export class TuesdayAgent implements AgentBehavior {
  public agentMove(screenPart: ScreenPart): Motion {
    const today: LocalDate = LocalDate.now();
    const dayOfWeek = today.dayOfWeek();

    if (dayOfWeek.equals(DayOfWeek.TUESDAY)) {
      return "up";
    } else {
      return "down";
    }
  }
}

/**
 * Cycle agent cycles through these moves continuously - up, up, right, down, right.
 */
export class CycleAgent implements AgentBehavior {
  private cCycle: Motion[];
  private cIndex: number;
  constructor() {
    this.cIndex = 0
    this.cCycle = ["up", "up", "right", "down", "right"];
  }
  public agentMove(screenPart: ScreenPart): Motion {
    const generatedMotion: Motion = this.cCycle[this.cIndex];
    this.cIndex++;
    this.cIndex = this.cIndex % this.cCycle.length;
    return generatedMotion;
  }
}

/**
 * Stair agent moves left one time, up one time, left two times, up two times and so on so forth. 
 */
export class StairAgent implements AgentBehavior {
  private movesLeft: number = 1;
  private movesUp: number = 1;
  private direction: Motion = 'left';
  private moveCounter: number = 0;

  public agentMove(screenPart: ScreenPart): Motion {
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

