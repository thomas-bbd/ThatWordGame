import express from "express";
import http from 'http'
import { WebSocketServer } from "ws";
import { initiate_game, join_game, play_word, start_game } from "./game-manager.js";

const PORT = process.env.PORT || 8081;
const app = express();

const server = http.createServer(app);

server.listen(
  PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  }
);

const wss = new WebSocketServer({server: server})

const handle_message = (message, websocket) => {
  console.log('handling...')
  console.log(message)
  switch (message.action) {
    case 'init-game': 
      initiate_game(message.player_name, websocket)
      break;
    case 'join-game': 
      join_game(message.game_id, message.player_name, websocket)
      break;
    case 'start-game': 
      start_game(message.game_id, message.player_id, websocket)
      break;
    case 'play-word': 
      play_word(message.word, message.game_id, message.player_id, websocket)
      break;
    default: break;
  }
}

wss.on('connection', ws => {
  console.log('new connection created')
  ws.on('message', msg => handle_message(JSON.parse(msg), ws))
})

app.get('game/init')

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.get('/2', (req, res) => {
    res.send('2nd endpoint.');
  });
app.listen(3000, () => console.log('Example app is listening on port 3000.'));
