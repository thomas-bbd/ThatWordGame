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

export function selectFederatedCredentialsByIdRequest(provider, subject) {

    const sql = `
        SELECT [user_id]
        FROM [dbo].[federated_credentials]
        WHERE [provider] = @provider and [subject] = @subject;
    `;

    const params = [
        {
            name: "provider",
            type: TYPES.VarChar,
            value: provider
        },
        {
            name: "subject",
            type: TYPES.VarChar,
            value: subject
        }
    ];

    return execSQLRequest(sql, params);
}

export function insertUserRequest(name){

    const sql = `
        INSERT INTO [dbo].[user] (
            [username],
            [name]
        ) 
        OUTPUT inserted.[user_id]
        VALUES (
            'N/A',
            @name
        );
    `;

    const params = [
        {
            name: "name",
            type: TYPES.VarChar,
            value: name
        }
    ];

    return execSQLRequest(sql, params);
}

export function insertFederatedCredentialsRequest(userId, provider, subject){
    const sql = `
        INSERT INTO [dbo].[federated_credentials] (
            [user_id],
            [provider],
            [subject]
        )
        OUTPUT inserted.[federated_credentials_id]
        VALUES (
            @userId,
            @provider,
            @subject
        );
    `;

    const params = [
        {
            name: "userId",
            type: TYPES.BigInt,
            value: userId
        },
        {
            name: "provider",
            type: TYPES.VarChar,
            value: provider
        },
        {
            name: "subject",
            type: TYPES.VarChar,
            value: subject
        }
    ];

    return execSQLRequest(sql, params);
}