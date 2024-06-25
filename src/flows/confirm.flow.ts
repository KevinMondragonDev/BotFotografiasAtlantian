import { addKeyword, EVENTS } from "@builderbot/bot";
import { clearHistory as importedClearHistory } from "../utils/handleHistory";
import { addMinutes, format } from "date-fns";
import { createFlow } from "@builderbot/bot";
import { ExistsEvent, validateGraduate } from "src/services/calendar";
import { payFlow } from "./pay.flow";
const flowConfirm = addKeyword(["pagar", "uno", "UNO", "primera"])
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic(`Muy bien, ¡Vamos a buscar tu evento! 📝👀 Necesito algunos datos importantes de su parte.🌟`);
        await flowDynamic('🗣️Puedes cancelar el proceso en cualquier momento con la palabra "Cancelar"🚫');
        await flowDynamic('¿Cuál es la clave de su evento? 🔑📅');
    })
    .addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack, endFlow }) => {
        localClearHistory(state);
        if (ctx.body.toLowerCase().includes('cancelar')) {
            localClearHistory(state);
            return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬");
        }

        if (!state.get('counter')) {
            await state.update({ counter: 0 });
        }

        // Obtain and update the event key in the state
        await state.update({ key: ctx.body });
        const key = state.get('key');
        const counter = state.get('counter');

        const verificate = await ExistsEvent(key);
        console.warn(counter);

        if (verificate.success) {
            localClearHistory(state);
            await flowDynamic("¡Evento encontrado con éxito! 🎉📅");
            await flowDynamic(`Tu evento es '${verificate.title}' 🎈🎊`);
            flowDynamic("Por favor nos podria proporcionar su nombre o Correo Electronico");
            flowDynamic("(con el que te registraste en nuestra plataforma Luxze📝📧)");
            
        } else {
            if (counter < 2) {
                await state.update({ counter: counter + 1 });
                return fallBack("No encuentro esta clave. Prueba con algo como 'MKT2025' o 'INGSALLE24'🤔❓");
            } else {
                localClearHistory(state);
                return endFlow("Lo siento, no puedo encontrar el evento. Llamaré a un asesor para asistirte. 📞👨‍💼");
            }
        }
    })


    .addAction({ capture: true }, async (ctx, { state, flowDynamic,fallBack, endFlow }) => {
          
         if (ctx.body.toLowerCase().includes('cancelar')) {
            localClearHistory(state);
            return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬");
        }

        if (!state.get('counter')) {
            await state.update({ counter: 0 });
        }

        // Obtain and update the event key in the state
        await state.update({ email_or_name: ctx.body });
        const email_or_name = state.get('email_or_name');
        const counter = state.get('counter');

        const user = await validateGraduate(email_or_name);
        console.warn(counter);

        if (user.success) {
            //localClearHistory(state);
            console.log(user)
            const { id_graduado, nombre_graduado, correo_graduado, clave_graduado, tipo_usuario, estado_graduado, id_evento_graudado, boletos_contrato, boletos_pagados, mesas_graduado, contrato_graduado } = user.graduate;
            await state.update({
                graduate: user.graduate,
                from: ctx.from,
                id_graduado,
                nombre_graduado,
                correo_graduado,
                clave_graduado,
                tipo_usuario,
                estado_graduado,
                id_evento_graudado,
                boletos_contrato,
                boletos_pagados,
                mesas_graduado,
                contrato_graduado
            });
            

            
            await flowDynamic(  `'${nombre_graduado}', tienes ${boletos_contrato} boletos en contrato, de los cuales has pagado: ${boletos_pagados}`);
            await flowDynamic(`El precio por boleto es de $ ' dato Faltante del Backend'`);
            await flowDynamic( " ");
           

            if( boletos_pagados === boletos_contrato  ){
                return endFlow("Dado a que has pagado todos los boletos, de mi parte seria todo 📞👨‍💼");
            }
            
                await flowDynamic( "¿Qué le gustaría hacer? 😊");
                await flowDynamic( "1️⃣ Pagar tus boletos 🎫");
                await flowDynamic( "2️⃣ Salir 👋🏽");        
            
            
            
            flowDynamic("(Responde con el numero de la accion que deseas📝📧)");
            
        } else {
            if (counter < 2) {
                await state.update({ counter: counter + 1 });
                return fallBack("No encuentro este usuario . Prueba con algo como 'MKT2025' o 'INGSALLE24'🤔❓");
            } else {
                localClearHistory(state);
                return endFlow("Lo siento, no puedo encontrar el evento. Llamaré a un asesor para asistirte. 📞👨‍💼");
            }
        }
    })
    
    //hasta aqui me quede 

     
    .addAction({ capture: true }, async (ctx, { state, flowDynamic, endFlow }) => {
        if (ctx.body.toLowerCase().includes('2')) {
            localClearHistory(state);
            return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬");
        }
        await flowDynamic(`Vamooos a pagar esos boletos`);
        // Save the person to visit
        
        await flowDynamic(`¿Cuantos boletos va a comprar?`);
        
       
        
        
    })
    .addAction({ capture: true }, async (ctx, { state, flowDynamic,fallBack, endFlow }) => {

        const boletos_contrato = state.get('boletos_contrato');
        const boletos_pagados = state.get('boletos_pagados');
        const boletos_restantes =boletos_contrato - boletos_pagados;

        if (ctx.body.toLowerCase().includes('Cancelar')) {
            localClearHistory(state);
            return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬");
        }
        

        // Obtain and update the event key in the state
        await state.update({ Number_tickets: ctx.body });
            
        
        const Number_tickets = state.get('Number_tickets');

        if(Number_tickets > 12 || Number_tickets < 1 || Number_tickets < boletos_restantes ){
            if (Number_tickets > boletos_restantes){
                return fallBack("No puedes pagar mas de lo que debes🤔❓");
            } else if(Number_tickets > 12 || Number_tickets < 1) {
                return fallBack("No pueden ser mayor que 12 o menor que 1🤔❓");
            }
            
        }
        flowDynamic('Por favor realiza una transferencia SPEI por la cantidad de $cantidad que me falta del backend ' )
        flowDynamic('y envia como imagen el comprobante para guardar tu registro. ' )
        flowDynamic('Informacion Bancaria: 124324132134234 ' )
        
         
    })
    
    .addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack, endFlow }) => {
        if (ctx.body.toLowerCase().includes('cancelar')) {
            localClearHistory(state);
            return endFlow("¿Tiene alguna otra consulta o algo en que pueda asistirte? 🤔💬");
        }

        await state.update({ Voucher: ctx.body });
        const Voucher = state.get('Voucher');

        // Retrieve graduate details and ctx.from from state
        const id_graduado = state.get('id_graduado');
        const nombre_graduado = state.get('nombre_graduado');
        const correo_graduado = state.get('correo_graduado');
        const Number_tickets = state.get('Number_tickets');
        const from = state.get('from');

        // Prepare form data for image upload
        const formData = new FormData();
        formData.append('graduate_id', id_graduado);
        formData.append('image', Voucher); // Assuming Voucher is a file or base64 string
        formData.append('quantity', Number_tickets);
        formData.append('amount', '120000'); // Replace with actual amount if needed
        
        
        

        localClearHistory(state);
    });
    
function localClearHistory(state) {
    state.update({ key: null, counter: 0, email: null, personaAVisitar: null, motivo: null, telefono: null });
}

export { flowConfirm };
