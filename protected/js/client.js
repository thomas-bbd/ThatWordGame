// This file needs to create the socket connection, then adjust the DOM to display the right stuff.

// Example on how to handle the socket below.

const wsURL = window.location.host.includes("localhost") ? `ws://${window.location.host}/` : `wss://${window.location.host}/`;
const socket = new WebSocket(wsURL);

socket.onopen = () => {
    // check if url containers the parameter create or join
    let urlParams = new URLSearchParams(window.location.search);
    let create = urlParams.get('create');
    let join = urlParams.get('join');

    if (create != null && join == null) {
        console.log('create')
        // showGameOptions();
    } else if (create == null && join != null) {
        // document.getElementById('join-code-header').textContent = "Enter the game pin to join";
        console.log('join')
        // createJoinCodeForm(join);
    } else if (create == null && join == null) {
        // window.location = "/home";
        console.log('neither')
    }
}
