// A Room value is exactly one of these four strings.
// It is impossible for a Room variable to contain any other string.
type Room = "A" | "B" | "C" | "Exit";

export function getPlayerInput(input: string): string {
  let playerInput: string | null = prompt(input);
  while (playerInput == null || playerInput == "") {
    console.error("Invalid input.");
    playerInput = prompt(input);
  }
  console.log(playerInput);
  return playerInput
}
export function operateRoomA(command: string, currentRoom: Room, hasKey: boolean): Room {
  let currRoom: Room = currentRoom;
  switch (command) {
    case "east":
      currRoom = "B";
      console.info("You go through the east door. You are in a room with a table.");
      if (!hasKey) {
        console.info("On the table there is a key.");
      }
      console.info("There is a door on the west wall of this room.");
      break;
    case "north":
      if (hasKey) {
        currRoom = "C";
        console.info("You unlock the north door with the key and go through the door.");
        console.info("You are in a bright room. There is a door on the south wall of this room and a window on the east wall.");
      } else {
        console.error("You try to open the north door, but it is locked.");
      }
      break;
    default:
      console.error("Unrecognized command.");
      break;
  }
  return currRoom
}
export function operateRoomB(command: string, currentRoom: Room, hasKey: boolean): [Room, boolean] {
  let currRoom: Room = currentRoom
  let ownKey: boolean = hasKey
  switch (command) {
    case "west":
      currRoom = "A";
      console.info("You are in an empty room. There are doors on the north and east walls of this room.");
      break;
    case "take key":
      if (ownKey) {
        console.error("You already have the key.");
      } else {
        console.info("You take the key from the table.");
        ownKey = true;
      }
      break;
    default:
      console.error("Unrecognized command.");
      break;
  }
  return [currRoom, ownKey]
}
export function operateRoomC(command: string, currentRoom: Room, hasKey: boolean): [Room, boolean] {
  let currRoom: Room = currentRoom
  let isWindowOpen: boolean = hasKey
  switch (command) {
    case "south":
      currRoom = "A";
      console.info("You are in an empty room. There are doors on the north and east walls of this room.");
      break;
    case "east":
      if (isWindowOpen) {
        currRoom = "Exit";
        console.info("You step out from the open window.");
      } else {
        console.error("The window is closed.");
      }
      break;
    case "open window":
      if (isWindowOpen) {
        console.error("The window is already open.");
      } else {
        console.info("You open the window.");
        isWindowOpen = true;
      }
      break;
    default:
      console.error("Unrecognized command.");
      break;
  }
  return [currRoom, isWindowOpen]
}
export function startAdventure(): void {
  let currentRoom: Room = "A";
  let hasKey: boolean = false;
  let windowOpen: boolean = false;
  while (currentRoom != "Exit") {
    console.warn("Please enter a command.");
    const command = getPlayerInput("Please enter your command.");
    switch (currentRoom) {
      case "A":
        currentRoom = operateRoomA(command, currentRoom, hasKey)
        break;
      case "B":
        [currentRoom, hasKey] = operateRoomB(command, currentRoom, hasKey)
        break;
      case "C":
        [currentRoom, windowOpen] = operateRoomC(command, currentRoom, windowOpen)
        break;
    }
  }
}
export function play(): void {
  console.info("Welcome to the text adventure! Open your browser's developer console to play.");

  console.warn("Please enter your name.");
  const playerName: string = getPlayerInput("Please enter your name.");
  console.info("Hello, " + playerName + ".");

  console.info("You are in a building. Your goal is to exit this building.");
  console.info("You are in an empty room. There are doors on the north and east walls of this room.");

  startAdventure();

  console.info("You have exited the building. You win!");
  console.info("Congratulations, " + playerName + "!");
}


