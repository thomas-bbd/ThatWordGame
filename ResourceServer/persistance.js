import { TYPES } from "tedious"
import execSQLRequest from "../db/resourcedb.js"
import { Game } from "./entities.js"
import { query } from "express"

export const persist_game = async (game) => {

    const sql = `
    INSERT INTO [dbo].[History] 
    (complete) 
    OUTPUT INSERTED.id 
    values (1)
    `
    
    const params = []

    let result = await Promise.resolve(execSQLRequest(sql, params))

    if (!result || result.length == 0) return 'failed'
    const h_id = result[0].get('id')


    const detail_sql = `
        INSERT INTO [dbo].[PlayerHistoryElement] values (@h_id, @p_id, @score)
    `

    game.game_lineup.forEach(player => {

        const player_params = [
            {
                name: 'h_id',
                type: TYPES.Int,
                value: h_id
            },

            {
                name: 'p_id',
                type: TYPES.Int,
                value: player.player_id
            },

            {
                name: 'score',
                type: TYPES.Int,
                value: player.score
            }

        ]

        return execSQLRequest(detail_sql, player_params)
    });
    
}
