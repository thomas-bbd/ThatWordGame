import { Game, Player } from "./entities.js"

let active_games = new Map()

export const initiate_game = (player_name, websocket) => {
 const new_game = new Game(player_name, websocket);
 active_games.set(new_game.game_id, new_game)
}

export const join_game = (game_id, player_name, websocket) => {
  let game = active_games.get(game_id)
  if (game !== undefined && !game.started && !game.complete) {
    game.join(new Player(player_name, websocket))
  } else {
    websocket.send(JSON.stringify({
      response_status: 'failure',
      response_message: 'that game does not exist'
    }))
  }
}

const start_game = () => {

}