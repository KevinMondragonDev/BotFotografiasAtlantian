import { addKeyword, EVENTS } from "@builderbot/bot";
import AIClass from "../services/ai";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import { generateTimer } from "../utils/generateTimer";
import { getCurrentCalendar } from "../services/calendar";
import { getFullCurrentDate } from "src/utils/currentDate";
import { flowConfirm } from "./confirm.flow";

import { clearHistory } from "../utils/handleHistory";
import { addMinutes, isWithinInterval, format, parse } from "date-fns";
import { welcomeFlow } from "./welcome.flow";
const DURATION_MEET = process.env.DURATION_MEET ?? 45

const PROMPT_FILTER_DATE = `
### Contexto
Eres un asistente de inteligencia artificial. Tu propósito es determinar la fecha y hora que el cliente quiere, en el formato yyyy/MM/dd HH:mm:ss.

### Fecha y Hora Actual:
{CURRENT_DAY}

### Registro de Conversación:
{HISTORY}

Asistente: "{respuesta en formato (yyyy/MM/dd HH:mm:ss)}"
`;

const generatePromptFilter = (history: string) => {
    const nowDate = getFullCurrentDate();
    const mainPrompt = PROMPT_FILTER_DATE
        .replace('{HISTORY}', history)
        .replace('{CURRENT_DAY}', nowDate);

    return mainPrompt;
}

const flowSchedule = addKeyword(EVENTS.ACTION).addAction(async (ctx, { extensions, state, flowDynamic, endFlow }) => {
    await flowDynamic('Dame un momento para consultar la agenda...');
    const ai = extensions.ai as AIClass;
    const history = getHistoryParse(state);
    const list = await getCurrentCalendar()

    const listParse = list
        .map((d) => parse(d, 'yyyy/MM/dd HH:mm:ss', new Date()))
        .map((fromDate) => ({ fromDate, toDate: addMinutes(fromDate, +DURATION_MEET) }));

    const promptFilter = generatePromptFilter(history);

    const { date } = await ai.desiredDateFn([
        {
            role: 'system',
            content: promptFilter
        }
    ]);

    const desiredDate = parse(date, 'yyyy/MM/dd HH:mm:ss', new Date());

    const isDateAvailable = listParse.every(({ fromDate, toDate }) => !isWithinInterval(desiredDate, { start: fromDate, end: toDate }));
    /* Kevin Mondragon
    Elimine esta parte del codigo para que busque una opcion directo para agendar un dia de consulta
    if(!isDateAvailable){
        const m = ' Podria ser  ⏰';
        await flowDynamic(m);
        await handleHistory({ content: m, role: 'assistant' }, state);
        return endFlow()
    }
    */
    const formattedDateFrom = format(desiredDate, 'hh:mm a');
    const formattedDateTo = format(addMinutes(desiredDate, +DURATION_MEET), 'hh:mm a');
    const message = `¡Perfecto! Tenemos disponibilidad de ${formattedDateFrom} a ${formattedDateTo} el día ${format(desiredDate, 'dd/MM/yyyy')}. ¿Confirmo tu reserva? Responda *SI* o *NO*`;
    await handleHistory({ content: message, role: 'assistant' }, state);
    await state.update({ desiredDate })

    const chunks = message.split(/(?<!\d)\.\s+/g);
    for (const chunk of chunks) {
        await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
    }
})

.addAction({capture:true}, async ({body, ctx},{gotoFlow, flowDynamic, state, endFlow }) => {
   
    if (body.toLocaleLowerCase().includes('si')) {
        return gotoFlow(flowConfirm)
    } 
    if (body.toLocaleLowerCase().includes('no')) {
        clearHistory(state)
        return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬")
    }
    
})

export { flowSchedule }
