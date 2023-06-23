import { randomUUID } from "crypto";
import { response } from "express";

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
  turn = -1
  curr_player = null
  turn_promises = []

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
          response_message: `You have joined ${this.game_master.player_name}'s Game. Waiting for them to start the game.`,
          player_id: player.player_id,
          game_id: this.game_id
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
      message: 'player-joined',
      player_name: player.player_name,
      current_lineup: this.game_lineup.map(player => player.player_name) 
    })
  }

  start = (player_id, websocket) => {
    if (player_id === this.game_master.player_id && websocket === this.game_master.websocket){
      shuffleArray(this.game_lineup)
      this.started = true
    }

    this.broadcast({
      message_type: 'notification',
      message: 'game-started',
      notification_message: 'the game has begun'
    })

    this.next()
  }

  next = () => {
    this.turn = ((this.turn + 1) % this.game_lineup.length)

    this.broadcast(
      {
        message_type: 'notification',
        message: 'player-lineup',
        current_lineup: this.game_lineup.map( player => ({
          name: player.player_name,
          time: player.total_time - player.time_spent
        })),
        turn: this.turn
      }
    )

    this.curr_player = this.game_lineup[this.turn]

    this.curr_player.websocket.send(
      JSON.stringify({
        message_type: 'notification',
        message: 'your-turn',
        time_to_play: this.curr_player.total_time - this.curr_player.time_spent
      })
    )

    //todo: work on reducing remaining time for players
    //this.curr_player.timer = new Promise(resolve => setTimeout(resolve, this.curr_player.total_time - this.curr_player.time_spent))

  }

  play = (word, player_id, websocket) => {
    if (player_id === this.curr_player.player_id && this.curr_player.websocket === websocket){
      this.broadcast({
        message_type: 'notification',
        action: 'word-played',
        message: `${this.curr_player.player_name} played the word ${word}`,
        word: word
      })
      
      this.next()

    } else {
      this.curr_player.websocket.send(
        JSON.stringify({
          message_type: 'response',
          message_status: 'failure',
          response_message:  'it\'s not your turn bro'
        })
      )
    }
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
  total_time = 20000 // ms
  time_spent = 0

  constructor (player_name, websocket) {
    this.websocket = websocket
    this.player_name = player_name
    this.player_id = randomUUID();
  }
}
