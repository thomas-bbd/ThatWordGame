import { ClientPlayer } from "./player-state-machine.js"
import { STATE } from "./player-state-machine.js"

export const populate_lobby = (player_list) => {
    console.log('populating')
    try {
        document.getElementById('player_list').innerHTML = 
        player_list.map(client => `<li>${client}</li>`).join('\n')
    } catch {}
}

export const show_lobby = (client) => {
    fetch('/game/play.html').then( async result => {
        const text = await Promise.resolve(result.text())
        document.body.innerHTML = (text)
        populate_lobby(client.player_list)

        if (client.is(STATE.GAME_MASTER)){
            show_code(client.game_id)
        } else {
            show_join(client)
        }
    })   
}

export const show_code = (code) => {
    const parent = document.getElementById('game-section')
    parent.innerHTML = `<section> ${code} </section>`
}

export const enable_start = () => {
    document.getElementById('start-btn').removeAttribute('disabled')
}

export const show_join = (client) => {
    console.log(client)
    const parent = document.getElementById('game-section')

    parent.innerHTML = 
    `
    <section>
        <label for="join-code-input"></label>
        <input type="text" id="join-code-input"></input>
        <button id="join-btn">Join</button>
    </section>
    `

    const join_btn = document.getElementById('join-btn')
    const input_text = document.getElementById('join-code-input')

    join_btn.onclick = event => {
        console.log(input_text.value)
        client.join_game(input_text.value)
    }
}
