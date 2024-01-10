import { RightAgent, TuesdayAgent, CycleAgent, StairAgent, AgentBehavior, Motion, Player } from "./Agent";
import { scheduleNextUpdate, updateApples, updateLost } from "./DrawingLibrary";
import { Cell, draw, GameScreen } from "./GameScreen";

// a MaybeCell is either a Cell or the string "outside"
export type MaybeCell = Cell | "outside";

// a ScreenPart is a 5x5 array of MaybeCell arrays
export type ScreenPart = MaybeCell[][];

/**
 * The Point class simply holds x and y coordinates for plotting points in the game.
 */
export class Point {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
/**
 * The SnakeState class contains information about apples gathered, win/loss state. 
 */
export class SnakeState extends Point {
  public apples: number;
  public lost: boolean;
  constructor(x: number, y: number) {
    super(x, y); // call Point constructor to set x and y
    this.apples = 0;
    this.lost = false;
  }
  public setPoint(p: Point): void {
    this.x = p.x;
    this.y = p.y;
  }
}

// x and y are the left and top coordinate of a 5x5 square region.
// cells outside the bounds of the board are represented with "outside"
export function getScreenPart(screen: GameScreen, s: SnakeState): ScreenPart {
  const part: ScreenPart = new Array<MaybeCell[]>(5);
  for (let j = 0; j < 5; j++) {
    part[j] = new Array<MaybeCell>(5);
    for (let i = 0; i < 5; i++) {
      if (s.x + i - 2 >= 0 && s.y - 2 + j >= 0 && s.x - 2 + i < screen.length && s.y - 2 + j < screen.length)
        part[j][i] = screen[s.y + j - 2][s.x + i - 2];
      else
        part[j][i] = "outside";
    }
  }
  return part;
}

/**
 * To Add a new agent:
 * 1. Create a new agent in agent.ts by implementing the agent behavior interface. This includes creating a function that
 *    recieves a screenpart as input and motion as output. The agents can control their own state and next moves independently.
 * 2. Add the agents to the list of agents in the run function by modifying the list. They will match with the corresponding player by
 *    index value.
 *
 * To change the agent for a given player change them in the corresponding index of the agents array in the run function.
 */
export function run(waitTimeInMilliseconds: number, newApplesEachStep: number, screen: GameScreen): void {
  const playerNames: Player[] = ["A", "B", "C", "D"];
  const agents: AgentBehavior[] = [<AgentBehavior>new RightAgent(), <AgentBehavior>new TuesdayAgent(), <AgentBehavior>new CycleAgent(), <AgentBehavior>new StairAgent()];
  const startPositions: number[][] = [[0, 0], [screen.length - 1, 0], [0, screen.length - 1], [screen.length - 1, screen.length - 1]];
  const snakes: SnakeState[] = new Array<SnakeState>(startPositions.length);

  setupGameAndPlayers(screen, snakes, startPositions, playerNames);
  draw(screen);
  scheduleNextUpdate(waitTimeInMilliseconds, () => runGameStep(waitTimeInMilliseconds, newApplesEachStep, screen, snakes, agents, playerNames));
  // the "() =>" part is important!
  // without it, step will get called immediately instead of waiting
}


function setupGameAndPlayers(screen: GameScreen, snakes: SnakeState[], startPositions: number[][], playerNames: Player[]): void {
  for (let i = 0; i < snakes.length; i++) {
    const [x, y] = startPositions[i];
    snakes[i] = new SnakeState(x, y);
    screen[y][x] = playerNames[i];
  }
}

function locationAfterMotion(motion: Motion, snake: SnakeState): Point {
  switch (motion) {
    case "left": return new Point(snake.x - 1, snake.y);
    case "right": return new Point(snake.x + 1, snake.y);
    case "up": return new Point(snake.x, snake.y - 1);
    case "down": return new Point(snake.x, snake.y + 1);
  }
}

export function plotMove(snake: SnakeState, moveLocation: Point, screen: GameScreen, playerNames: Player): void {
  snake.setPoint(moveLocation);
  screen[moveLocation.y][moveLocation.x] = playerNames;
}

function isEdgeOfScreen(moveLocation: Point, screen: GameScreen): boolean {
  return moveLocation.x < 0 || moveLocation.y < 0 || moveLocation.x >= screen.length || moveLocation.y >= screen.length
}

export function updatePosition(agent: AgentBehavior,
  screen: GameScreen, snake: SnakeState, playerNames: Player): void {
  if (!snake.lost) {
    const moveLocation = locationAfterMotion(agent.agentMove(getScreenPart(screen, snake)), snake);
    if (isEdgeOfScreen(moveLocation, screen)) // hit the edge of the screen
      snake.lost = true;
    else
      switch (screen[moveLocation.y][moveLocation.x]) {
        case "empty": {
          plotMove(snake, moveLocation, screen, playerNames)
          break;
        }
        case "apple": {
          plotMove(snake, moveLocation, screen, playerNames)
          snake.apples++;
          break;
        }
        default: {
          snake.lost = true;
          break;
        }
      }
  }
}

export function runGameStep(
  waitTimeInMilliseconds: number,
  newApplesEachStep: number,
  screen: GameScreen,
  snakes: SnakeState[],
  agents: (RightAgent | TuesdayAgent | CycleAgent | StairAgent)[],
  playerNames: Player[] = ["A", "B", "C", "D"]
): void {
  generateApples(newApplesEachStep, screen)
  rotatePlayersInOrder(snakes, screen, agents, playerNames);
  draw(screen);
  updateSnakeStats(playerNames, snakes);
  if (gameIsNotOver(snakes)) {
    scheduleNextUpdate(waitTimeInMilliseconds, () => runGameStep(waitTimeInMilliseconds, newApplesEachStep, screen, snakes, agents, playerNames));
  }
}

function generateApples(newApplesEachStep: number, screen: GameScreen): void {
  // generate new apples
  for (let i = 0; i < newApplesEachStep; i++) {
    // random integers in the closed range [0, screen.length]
    const x = Math.floor(Math.random() * screen.length);
    const y = Math.floor(Math.random() * screen.length);
    // if we generated coordinates that aren't empty, skip this apple
    if (screen[y][x] == "empty")
      screen[y][x] = "apple";
  }
}

function updateSnakeStats(playerNames: Player[], snakes: SnakeState[]): void {
  for (let i = 0; i < snakes.length; i++) {
    updateLost(playerNames[i], snakes[i].lost);
    updateApples(playerNames[i], snakes[i].apples);
  }
}

function rotatePlayersInOrder(snakes: SnakeState[], screen: GameScreen, agents: AgentBehavior[], playerNames: Player[]): void {
  for (let i = 0; i < snakes.length; i++) {
    const snake = snakes[i];
    if (!snake.lost) {
      updatePosition(agents[i], screen, snake, playerNames[i]);
    }
  }
}

function gameIsNotOver(snakes: SnakeState[]): boolean {
  for (const snake of snakes) {
    if (!snake.lost) {
      return true
    }
  }
  return false
} 