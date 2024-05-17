import { MongoAdapter } from '@builderbot/database-mongo'

export type IDatabase = typeof MongoAdapter
export const adapterDB = new MongoAdapter({
    dbUri: "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5",
    dbName: "conversaciones",
})

