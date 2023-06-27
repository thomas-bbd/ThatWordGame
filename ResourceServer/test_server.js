import { ClientPlayer, STATE } from "./player_state_machine.js";

const player1 = new ClientPlayer("bob");
const player2 = new ClientPlayer("steve");

await new Promise((resolve) => setTimeout(resolve, 1000));

player1.create_game();

await new Promise((resolve) => setTimeout(resolve, 1000));

player2.join_game(player1.game_id);

await new Promise((resolve) => setTimeout(resolve, 1000));

player1.start_game();

await new Promise((resolve) => setTimeout(resolve, 1000));

let player_list = [player1, player2];

let wordlist =
  "this sentence probably won't make any logical sense at all because these agents are choosing words at random".split(
    " "
  );

for (let i = 0; i < 10; i++) {
  player_list.forEach((player) => {
    if (player.is(STATE.MY_TURN)) {
      const word = wordlist[Math.floor(Math.random() * wordlist.length)];
      player.play(word);
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));
}
