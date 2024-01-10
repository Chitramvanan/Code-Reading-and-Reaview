import {ScreenPart } from "./GameRunner"; 
import { AgentBehavior, Motion } from "./AgentType";
import { LocalDate, DayOfWeek } from "@js-joda/core";

export class TuesdayAgent implements AgentBehavior {
  agentMove(screenPart: ScreenPart): Motion {
    const today: LocalDate = LocalDate.now();
    const dayOfWeek = today.dayOfWeek();

    if (dayOfWeek.equals(DayOfWeek.TUESDAY)) {
      return "up";
    } else {
      return "down";
    }
  }
}
