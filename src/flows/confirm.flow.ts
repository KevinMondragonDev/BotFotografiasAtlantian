import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { addMinutes, eachMonthOfInterval, format, addDays } from "date-fns";
import { appToCalendar } from "src/services/calendar";

const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowConfirm = addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic }) => {
    await flowDynamic(`Muy bien, ¡Vamos a agendar tu cita! 📝👀 Necesito algunos datos importantes de su parte.🌟Este es un proceso un poquito mas rigido`)
    await flowDynamic('🗣️Puedes cancelar el proceso en cualquier momento con la palabra "Cancelar"🚫')
    await flowDynamic('¿Cuál es su nombre? 👤😊')
})
.addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬")

    }
    await state.update({ name: ctx.body })
   
    await flowDynamic(`Este proceso es opcional`)
    await flowDynamic("¿Cual es su email? 📧")
})

    .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {

        const dateObject = {
            name: state.get('name'),
            email: ctx.body,
            startDate: format(state.get('desiredDate'), 'yyyy/MM/dd HH:mm:ss'),
            endData: format(addMinutes(state.get('desiredDate'), + DURATION_MEET), 'yyyy/MM/dd HH:mm:ss'),
            phone: ctx.from
        }
        
        await appToCalendar(dateObject)
        await flowDynamic(`👍 ¡Perfecto, ${dateObject.name}! Tu cita ya quedo registrada con el Dr.Carlos,esta tendra una duracion promedio de: ${DURATION_MEET} minutos 📅. Está programada para el día ${dateObject.startDate}. En https://maps.app.goo.gl/j7LVb6VQcEeE4kj27 ¡Nos vemos entonces! 🎉`)
        await flowDynamic( `"Recuerda que tu número de teléfono (${dateObject.phone}) es tu clave única para identificarte y resolver cualquier inconveniente" 🗝️📱`)

       
        clearHistory(state)
        })

export { flowConfirm }