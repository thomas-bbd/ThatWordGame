import { json } from 'express'
import { WebSocket } from 'ws' 

const player1socket = new WebSocket('ws://localhost:8081')
let player1_id;
let game_id;
const player2socket = new WebSocket('ws://localhost:8081')
let player2_id;

// player 1 creates the game.

await new Promise(resolve => setTimeout(resolve, 100))

player1socket.send(JSON.stringify({
  action: 'init-game',
  player_name: 'player1'
}))


// player 1 receives the game_id and shows it to player2

player1socket.onmessage = async event => {
  let message = JSON.parse(event.data)
  player1_id = message.player_id
  game_id = message.game_id
  console.log(message)
  player1socket.onmessage = async event => {
    let message = JSON.parse(event.data)
    console.log(message)
  }
}

await new Promise(resolve => setTimeout(resolve, 100))

// player 2 joins player 1's game

player2socket.send(
  JSON.stringify({
    action: 'join-game',
    player_name: 'player2',
    game_id: game_id
  })
)

// both players notified

player1socket.onmessage = async event => {
  let message = JSON.parse(event.data)
  console.log('player 1:')
  console.log(message)
}

player2socket.onmessage = async event => {
  let message = JSON.parse(event.data)
  console.log('player 2:')
  console.log(message)
}

await new Promise(resolve => setTimeout(resolve, 100))

// player 1 starts the game
