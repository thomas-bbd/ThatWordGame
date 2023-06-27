import { WebSocket } from "ws";

export const STATE = {
  BLANK: 0,
  PLAYER: 1,
  GAME_MASTER: 2,
  BLANK: 3,
  LOBBY: 4,
  IN_GAME: 5,
  WAITING: 6,
  MY_TURN: 7,
  ELIMINATED: 8,
};

export class ClientPlayer {
  state_list = [STATE.BLANK];
  websocket = null;
  player_name = null;
  player_id = null;
  game_id = null;

  is = (state) => {
    return this.state_list.indexOf(state) >= 0;
  };

  set = (state) => {
    if (!this.is(state)) this.state_list.push(state);
  };

  unset = (state) => {
    if (this.is(state))
      this.state_list.splice(this.state_list.indexOf(state), 1);
  };

  constructor(player_name) {
    this.player_name = player_name;
    const websocket = new WebSocket("ws://localhost:5000");
    websocket.onopen = () => {
      this.websocket = websocket;
    };

    websocket.onerror = () => {
      throw new Error("failed to connect");
    };
  }

  create_game = () => {
    if (this.websocket !== null) {
      this.websocket.send(
        JSON.stringify({
          action: "init-game",
          player_name: this.player_name,
        })
      );

      this.websocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log("player: " + this.player_name);
        console.log(message);

        if (message.response_status === "success") {
          this.set(STATE.GAME_MASTER);
          this.set(STATE.PLAYER);
          this.set(STATE.LOBBY);
          this.unset(STATE.BLANK);

          this.game_id = message.game_id;
          this.player_id = message.player_id;

          // todo: show that the game has been created.
          // todo: display lobby
          // todo: give option to start game
        }

        if (
          message.message_type === "notification" &&
          message.message === "player-joined"
        ) {
          this.on_player_join(message);
        }

        if (
          message.message_type === "notification" &&
          message.message === "game-started"
        ) {
          this.on_game_start(message);
        }
      };
    }
  };

  join_game = (game_id) => {
    if (this.websocket !== null) {
      this.websocket.send(
        JSON.stringify({
          action: "join-game",
          player_name: this.player_name,
          game_id: game_id,
        })
      );

      this.websocket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        console.log("player: " + this.player_name);
        console.log(message);

        if (
          message.message_type === "response" &&
          message.response_status === "success"
        ) {
          this.set(STATE.PLAYER);
          this.unset(STATE.BLANK);

          this.game_id = game_id;
          this.player_id = message.player_id;

          // todo: show that the player has joined
          // todo: display lobby
        }

        if (
          message.message_type === "notification" &&
          message.message === "player-joined"
        ) {
          this.on_player_join(message);
        }

        if (
          message.message_type === "notification" &&
          message.message === "game-started"
        ) {
          this.on_game_start(message);
        }
      };

      this.websocket.on;
    }
  };

  on_player_join = (message) => {
    this.player_list = message.current_lineup;

    // todo: show that a player has joined
    // todo: refresh lobby
  };

  on_game_start = (message) => {
    this.player_list = message.current_lineup;
    this.game_started = true;
    this.unset(STATE.LOBBY);
    this.set(STATE.IN_GAME);

    this.websocket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log("player: " + this.player_name);
      console.log(message);

      if (message.message_type === "notification") {
        if (message.message === "player-lineup") {
          this.player_list = message.current_lineup;
          this.turn_index = message.turn;
          this.set(STATE.WAITING);
        }

        if (message.message === "your-turn") {
          this.player_list = message.current_lineup;
          this.turn_index = message.turn;
          this.time_to_play = message.time_to_play;

          this.unset(STATE.WAITING);
          this.set(STATE.MY_TURN);

          // todo: give player input box or something
          // todo: show countdown
          // todo: call play_word when input is submitted
        }

        if (message.message === "eliminated") {
          if ((message.player_id = this.player_id)) {
            // todo: exclude self from game
          }
        }

        if (message.message === "elimination") {
          const player_index = message.player_index;
          // todo: exclude player from game (maybe just show that their out)
        }

        if (message.message === "game-over") {
          // todo: show game leaderboard
          // todo: provide new game interface
        }
      }
    };
    // todo: get ready to start
  };

  start_game = () => {
    if (!this.is(STATE.GAME_MASTER)) return;

    this.websocket.send(
      JSON.stringify({
        action: "start-game",
        game_id: this.game_id,
        player_id: this.player_id,
      })
    );
  };

  play = (word) => {
    if (!this.is(STATE.MY_TURN)) return;

    this.websocket.send(
      JSON.stringify({
        action: "play-word",
        game_id: this.game_id,
        player_id: this.player_id,
        word: word,
      })
    );

    this.unset(STATE.MY_TURN);
    this.set(STATE.WAITING);
  };
}
