import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { addMinutes, format } from "date-fns";
import { appToCalendar, deleteDatesByFolio } from "src/services/calendar";

//uuid dependencias


// Ejemplo de uso


// Ejemplo de uso
const DURATION_MEET = process.env.DURATION_MEET ?? 45
/**
 * Encargado de pedir los datos necesarios para registrar el evento en el calendario
 */
const flowCancelar= addKeyword(EVENTS.ACTION).addAction(async (_, { flowDynamic }) => {
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
    await flowDynamic("¿Cual es su numero de folio 📧")
})

    .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {

        const dateObject = {
            
            
            folio: ctx.body,
            
        }
        
        await deleteDatesByFolio(dateObject)
       
        console.log(dateObject.folio);
        clearHistory(state)
        })

export { flowCancelar}
