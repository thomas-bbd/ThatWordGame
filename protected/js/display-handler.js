import { ClientPlayer } from "./player-state-machine.js"
import { STATE } from "./player-state-machine.js"

export const populate_lobby = (player_list) => {
    console.log('populating')
    try {
        document.getElementById('player_list').innerHTML = 
        player_list.map(client => {
            if (client.time) {
                return `<li>${client.name} ${client.time/1000}s remaining</li>`
            } else {
                return `<li>${client}</li>`
            }
            
        } ).join('\n')
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

export const enable_start = (client) => {
    document.getElementById('start-btn').removeAttribute('disabled')
    document.getElementById('start-btn').onclick = event => {
        console.log('start')
        client.start_game()
    }
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

export const show_game_start = (client) => {
    const parent = document.getElementById('game-section')
    console.log('the game has started')
    parent.innerHTML =
    `
    <section>
        <ul id="word-bar"> 
            fwrgerw
        <ul>
    </section>
    `
}

export const prompt_for_word = (client) => {
    let word = window.prompt("add a word","");
    word = word.trim().split(' ')[0]
    
    client.play(word)
}

export const show_eliminated = () => {
    window.alert('you have been eliminated')
}

export const update_word_list = (words_played) => {
    const parent = document.getElementById('word-bar')

    parent.innerHTML = words_played.map(word =>
        `<li> ${word} </li>`
    ).join('\n')
}

export const show_scores = (client) => {
    const parent = document.body
    console.log('the game has ended')

    const word_bar = document.getElementById('word-bar')
    parent.innerHTML =
    `
    <ul>
        ${word_bar.innerHTML}
    </ul>
    <section>
        <ul id="player_scores"> 

        <ul>
    </section>

    <a href="/">Done</a>
    `

    const element = document.getElementById('player_scores')
    element.innerHTML = client.player_list.map(player => `<li>${player.name} ${player.score}</li>`)
}
