import { randomUUID } from "crypto";
import { response } from "express";
import { resolve } from "path";

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
  eliminated_players = []
  words_played = []

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

  countdown(player){
    const time_remaining = player.total_time - player.time_spent
    const start_time = Date.now()
    player.start_time = start_time

    new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, time_remaining);
    }).then(() => {
      if (player.start_time === start_time) {
        console.log(player.player_name + ' has been eliminated')
        player.set_eliminated()
        this.eliminated_players.push(player)
        this.next()
      }
    })
  }

  next = () => {
    if (this.eliminated_players.length + 1 === this.game_lineup.length) {
      this.end()
      return
    }

    this.turn = ((this.turn + 1) % this.game_lineup.length)
    while(this.game_lineup[this.turn].is_eliminated()) this.turn = ((this.turn + 1) % this.game_lineup.length)

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

    this.countdown(this.curr_player)

  }

  play = (word, player_id, websocket) => {
    if (player_id === this.curr_player.player_id && this.curr_player.websocket === websocket){
      this.words_played.push(word)
      this.curr_player.words.push(word)
      this.broadcast({
        message_type: 'notification',
        action: 'word-played',
        message: `${this.curr_player.player_name} played the word ${word}`,
        word: word,
        words_played: this.words_played
      })

      this.curr_player.time_spent += Date.now() - this.curr_player.start_time
      this.curr_player.start_time = 0
      this.next()

    } else {
      this.curr_player.websocket.send(
        JSON.stringify({
          message_type: 'response',
          message_status: 'failure',
          message:  'it\'s not your turn bro'
        })
      )
    }
  }

  end = () => {
    console.log('game over')
    if (this.complete) return false
    this.complete = true
    this.broadcast({
      message_type: 'notification',
      message: 'game-over',
      final_lineup: this.game_lineup.map( player => ({
        name: player.player_name,
        score: player.words.map(word => word.length).reduce((total_score, word_len) => {
          return total_score + word_len
        }) * player.words.length
      }))
    })

    // TODO: persist the game
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
  total_time = 5000 // ms
  time_spent = 0
  eliminated = false
  words = []

  constructor (player_name, websocket) {
    this.websocket = websocket
    this.player_name = player_name
    this.player_id = randomUUID();
  }

  set_eliminated = () => this.eliminated = true
  is_eliminated = () => { return this.eliminated }
}
