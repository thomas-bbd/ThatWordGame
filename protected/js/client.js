// This file needs to create the socket connection, then adjust the DOM to display the right stuff.

//Example on how to handle the socket below.

import { show_join, show_lobby } from "./display-handler.js";
import { ClientPlayer } from "./player-state-machine.js"

let client = null

const wsURL = window.location.host.includes("localhost") ? `ws://${window.location.host}/` : `wss://${window.location.host}/`;
const socket = new WebSocket(wsURL);

socket.onopen = () => {
    // check if url containers the parameter create or join
    let urlParams = new URLSearchParams(window.location.search);
    let create = urlParams.get('create');
    let join = urlParams.get('join');

    if (create != null && join == null) {
        console.log('create')
        client = new ClientPlayer('name', socket)
        client.create_game()
    } else if (create == null && join != null) {
        console.log('join')
        client = new ClientPlayer('name', socket)
        show_lobby(client)
    } else if (create == null && join == null) {
        window.location = "/home";
    }
}
