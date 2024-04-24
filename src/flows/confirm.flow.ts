import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { addMinutes, eachMonthOfInterval, format, addDays } from "date-fns";
import { appToCalendar } from "src/services/calendar";
import { v4 as uuidv4 } from 'uuid';

//uuid dependencias
let contador = 0;  // Contador global para asegurar un componente único

function generarCaracterAleatorio(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return caracteres.charAt(Math.floor(Math.random() * caracteres.length));
}

function generarFolio(): string {
    contador++;  // Incrementar el contador para cada folio generado
    const base = contador.toString().padStart(3, '0');  // Asegura una base de 3 dígitos
    let folio = `F${base}`;  // 'F' seguido de la base numérica
    
    while (folio.length < 8) {
        folio += generarCaracterAleatorio();
    }

    return folio;
}

// Ejemplo de uso


// Ejemplo de uso
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
            folio: generarFolio(),
            name: state.get('name'),
            email: ctx.body,
            startDate: format(state.get('desiredDate'), 'yyyy/MM/dd HH:mm:ss'),
            endData: format(addMinutes(state.get('desiredDate'), + DURATION_MEET), 'yyyy/MM/dd HH:mm:ss'),
            phone: ctx.from
        }
        
        await appToCalendar(dateObject)
        await flowDynamic(`👍 ¡Perfecto, ${dateObject.name}! Tu cita ya quedo registrada con el Dr.Carlos,esta tendra una duracion promedio de: ${DURATION_MEET} minutos 📅. Está programada para el día ${dateObject.startDate}. En https://maps.app.goo.gl/j7LVb6VQcEeE4kj27 ¡Nos vemos entonces! 🎉`)
        await flowDynamic( `"Recuerda que tu número de teléfono (${dateObject.phone}) es tu clave única para identificarte y resolver cualquier inconveniente" 🗝️📱`)
        await flowDynamic("Tu folio es: " + dateObject.folio)
        console.log(dateObject.folio);
        clearHistory(state)
        })

export { flowConfirm }