import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory } from "../utils/handleHistory";
import { addMinutes, format } from "date-fns";
import { appToCalendar } from "src/services/calendar";

const flowConfirm = addKeyword("F1g1ksba").addAction(async (_, { flowDynamic }) => {
    await flowDynamic(`Muy bien, ¡Vamos a registrar la visita! 📝👀 Necesito algunos datos importantes de su parte.🌟`)
    await flowDynamic('🗣️Puedes cancelar el proceso en cualquier momento con la palabra "Cancelar"🚫')
    await flowDynamic('¿Cuál es nombre del visitante? 👤😊')
    
})
.addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬")

    }
    //Aqui guardo un nombre
    await state.update({ nombre: ctx.body })
    await flowDynamic("¿Cual es su email?📝📧")
})
.addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬")

    }
    //Aqui guardo el email
    await state.update({ email: ctx.body })
    await flowDynamic(`Este proceso es opcional`)
    await flowDynamic("¿Cual es su persona a Visitar? 👤 📧")
})

.addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬")

    }
    //Aqui guardo el email
    await state.update({ personaAVisitar: ctx.body })
    await flowDynamic(`Este proceso es opcional`)
    await flowDynamic("¿Cual es su motivo? 🤔💬")
})

.addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {

    if (ctx.body.toLocaleLowerCase().includes('cancelar')) {
        clearHistory(state)
        return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬")

    }
    //Aqui guardo el email
    await state.update({ motivo: ctx.body })
    await flowDynamic(`Este proceso es opcional`)
    await flowDynamic("¿Cual es su su numero telefonico? 📧")
})
    .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
        await state.update({ telefono: ctx.body })

        const dateObject = {
            nombre: state.get('nombre'),
            email: state.get('email'),
            telefono: state.get('telefono'),
            personaAVisitar: state.get('personaAVisitar'),
            motivo: state.get('motivo'),
            empleado: ctx.from,
            
        }
        
        await appToCalendar(dateObject)
        await flowDynamic( `"listo has registrado a nuestro visitante:  (${dateObject.nombre})" 🗝️📱`)
        await flowDynamic( `"Estos serian sus datos:  (${dateObject.nombre}),(${dateObject.email})(${dateObject.telefono})", ya se ha enviado su registro con tu numero de empleado 🗝️📱`)
        console.log(dateObject)
        console.log(ctx.from)
        console.log(dateObject.telefono);
        clearHistory(state)
        })


export { flowConfirm }
