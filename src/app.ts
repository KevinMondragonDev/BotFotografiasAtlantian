import 'dotenv/config'
import { createBot, MemoryDB } from '@builderbot/bot'
import flow from './flows';
// import { providerTelegram as provider } from './provider/telegram';
import { provider } from './provider';
import { adapterDB } from './mongo-database';

const PORT = 3301;
//const PORT = process.env.PORT ?? 3301

const main = async () => {

    const { httpServer } = await createBot({
        database: new MemoryDB(),
        provider,
        flow,
    })

    httpServer(+PORT)
    console.log(`Ready for ${PORT}`)
}
main()