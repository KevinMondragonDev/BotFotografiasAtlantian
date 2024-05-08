import 'dotenv/config'
import { createBot, MemoryDB } from '@builderbot/bot'
import AIClass from './services/ai';
import flow from './flows';
// import { providerTelegram as provider } from './provider/telegram';
import { provider } from './provider';
import { adapterDB } from './mongo-database';

const PORT = 3301;
//const PORT = process.env.PORT ?? 3301
const ai = new AIClass(process.env.OPEN_API_KEY, 'gpt-3.5-turbo')

const main = async () => {

    const { httpServer } = await createBot({
        database: adapterDB,
        provider,
        flow,
    }, { extensions: { ai } })

    httpServer(+PORT)
    console.log(`Ready for ${PORT}`)
}
main()