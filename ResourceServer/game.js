import { testDbConnection } from "../db/requests.js";

export async function testDb() {
    return await testDbConnection();
}