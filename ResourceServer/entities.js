import { randomUUID } from "crypto";

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

export class Game {

  game_id
  game_master
  game_lineup = []
  started = false
  complete = false

  constructor(player_name, ws){
    this.game_id = randomUUID()
    let player = new Player(player_name, ws)

    this.game_master = player
    this.join(player, player.websocket)
  }

  broadcast = (message) => {
    this.game_lineup.forEach(player => {
      player.websocket.send(JSON.stringify(message))
    }) 
  }

  join = (player) => {
    if (this.game_lineup.length == 0) {
      this.game_lineup.push(player)
      this.game_master.websocket.send(
        JSON.stringify({
          message_type: 'response',
          response_status: 'success',
          response_message: `You have successfully created a new game.`,
          player_id: player.player_id,
          game_id: this.game_id
        })
      )
    } else if ( this.game_lineup.length < 4 ) {
      this.game_lineup.push(player)
      player.websocket.send(
        JSON.stringify({
          message_type: 'response',
          response_status: 'success',
          response_message: `You have joined ${this.game_master.player_name}'s Game. Waiting for them to start the game.`
        })
      )
    } else {
      player.websocket.send(
        JSON.stringify({
          message_type: 'response',
          response_status: 'fail',
          response_message: 'Game is full'
        })
      )
      player.websocket.close()
      return
    }

    this.broadcast({
      message_type: 'notification',
      notification_message: 'Player Joined',
      player_name: player.player_name,
      current_lineup: this.game_lineup.map(player => player.player_name) 
    })
  }

  start = (player_id) => {
    if (player_id === this.game_master.player_id){
      shuffleArray(this.game_lineup)
      this.started = true
    }
  }

  grant_turn = () => {

  }
}

export class User {
  user_id
  user_name

  constructor () {

  }
}

export class Player {
  websocket
  player_name
  player_id

  constructor (player_name, websocket) {
    this.websocket = websocket
    this.player_name = player_name
    this.player_id = randomUUID();
  }
}
