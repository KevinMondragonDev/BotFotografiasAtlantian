import { BotContext, BotMethods } from "@builderbot/bot/dist/types"
import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "../services/ai"
import { flowSeller } from "../flows/seller.flow"
import { flowSchedule } from "../flows/schedule.flow"
import { flowCancelar } from "src/flows/cancelFolio.flow"
flowCancelar
flowCancelar
const PROMPT_DISCRIMINATOR = `### Historial de Conversación (Vendedor/Cliente) ###
{HISTORY}

### Intenciones del Usuario ###

**HABLAR**: Selecciona esta acción si el cliente parece querer hacer una pregunta o necesita más información.
**AGENDAR**: Selecciona esta acción si el cliente muestra intención de programar una cita.
**CANCELAR**: Selecciona  esta opción si el cliente parece que quiere cancelar 

**TERMINAR**: Selecciona  esta opción si el cliente se desvía del tema principal y empieza a hablar de forma incoherente. Esta acción te permitirá redirigir la conversación de manera efectiva y mantener el enfoque en los puntos relevantes, asegurando una comunicación clara y productiva

### Instrucciones ###

Por favor, clasifica la siguiente conversación según la intención del usuario.`

export default async (_: BotContext, { state, gotoFlow,  endFlow ,extensions }: BotMethods) => {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    const prompt = PROMPT_DISCRIMINATOR


    console.log(prompt.replace('{HISTORY}', history))

    const { prediction } = await ai.determineChatFn([
        {
            role: 'system',
            content: prompt.replace('{HISTORY}', history)
        }
    ], 'gpt-3.5-turbo')


    console.log({ prediction })

    if (prediction.includes('HABLAR')) return gotoFlow(flowSeller)
    if (prediction.includes('AGENDAR')) return gotoFlow(flowSchedule)
    if (prediction.includes('CANCELAR')) return gotoFlow(flowCancelar)
     if (prediction.includes('TERMINAR')) return endFlow
}