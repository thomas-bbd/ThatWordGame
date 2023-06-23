import { Game, Player } from "./entities.js"

let active_games = new Map()

const send_invalid_game_message = (websocket) => {
  websocket.send (JSON.stringify({
    response_status: 'failure',
    response_message: 'that game does not exist'
  }))
}

export const initiate_game = (player_name, websocket) => {
 const new_game = new Game(player_name, websocket);
 active_games.set(new_game.game_id, new_game)
}

export const join_game = (game_id, player_name, websocket) => {
  let game = active_games.get(game_id)
  if (game !== undefined && !game.started && !game.complete) {
    game.join(new Player(player_name, websocket))
  } else {
    send_invalid_game_message(websocket)
  }
}

export const start_game = (game_id, player_id, websocket) => {
  let game = active_games.get(game_id)
  if (game !== undefined && !game.started && !game.complete) {
    game.start(player_id, websocket)
  }
}

export const play_word = (word, game_id, player_id, websocket) => {
  let game = active_games.get(game_id)
  if (game !== undefined && game.started && !game.complete) {
    game.play(word, player_id, websocket)
  }
}
