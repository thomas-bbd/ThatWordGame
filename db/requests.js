import { TYPES } from "tedious";
import execSQLRequest from "./resourcedb.js";

export function testDbConnection(joinCode) {

    const sql = `
        SELECT * FROM dbo.test;
    `;

    const params = [
    ];

    return execSQLRequest(sql, params);
}