import { addKeyword, EVENTS } from "@builderbot/bot";

import { createFlow } from "@builderbot/bot";
import { ExistsEvent, validateGraduate, GetURLWeb } from "src/services/backend";
import {flowfinish} from "src/Adios";

const flowpagarBoletos = addKeyword(["2", "dos", "DOS", "boletos"])
.addAction(async (_, { flowDynamic }) => {
    await flowDynamic(`Por favor, proporciona el nombre completo o correo electrónico con el que te registraste en nuestra plataforma Luxze.`);
})
/*
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
            await flowDynamic("Por favor nos podria proporcionar su nombre o Correo Electronico");
            await flowDynamic("(con el que te registraste en nuestra plataforma Luxze📝📧)");
            
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
*/

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
       const {
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
       } = user.graduate;

       await state.update({
           graduate: user.graduate,
           amount: user.amount,
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

       await flowDynamic(`'${nombre_graduado}', tienes ${boletos_contrato} boletos en contrato, de los cuales has pagado: ${boletos_pagados}`);
       await flowDynamic(`El precio por boleto es de ${user.amount} pesos💰🎫`);
       await flowDynamic(`Tu deuda actual sería de ${boletos_contrato - boletos_pagados} boletos por un total de ${user.amount * (boletos_contrato - boletos_pagados)} pesos💰🎫`);

      

       if( boletos_pagados === boletos_contrato  ){
           return endFlow("Dado a que has pagado todos los boletos, de mi parte seria todo 📞👨‍💼");
       }
       
           await flowDynamic( "Selecciona qué quieres hacer:");
           await flowDynamic( "1️⃣ Pagar tus boleto(s)");
           await flowDynamic( "2️⃣ Finalizar conversación");        
       
       
       
           await flowDynamic("Por favor, responde ingresando el número de la opción que deseas. ✨");


           
           
   } else {
       if (counter < 2) {
           await state.update({ counter: counter + 1 });
           return fallBack("No encuentro este usuario . Prueba con algo como 'Atlantian@gmail.com' o 'tunombre@gmail.com'🤔❓");
       } else {
           localClearHistory(state);
           return endFlow("Hasta luego. 🌟👋");
       }
   }
})

//hasta aqui me quede 

    
    //hasta aqui me quede 

     
    .addAction({ capture: true }, async (ctx, { state, flowDynamic,fallBack, endFlow }) => {
        if (ctx.body.toLowerCase().includes('1')) {
            localClearHistory(state);
            
            await flowDynamic(`¿Cuántos boletos quieres pagar?`);
            await flowDynamic(`Escribe el número de boletos que deseas adquirir. ✨`);
            // Save the person to visit
            
        }
        if (ctx.body === '2') { 
            localClearHistory(state);
            return endFlow("Hasta luego 🌟👋");
            // Save the person to visit
            
        }
        if (ctx.body !== '1') { 
            localClearHistory(state);
            return fallBack("Selecciona una opción válida como 1️⃣ o 2️⃣ 🤔🚀");
            // Save the person to visit
            
        }
       
        
        
    })
    .addAction({ capture: true }, async (ctx, { state, flowDynamic,fallBack, endFlow }) => {
        const id_graduado = state.get('id_graduado');
        const boletos_contrato = state.get('boletos_contrato');
        const boletos_pagados = state.get('boletos_pagados');
        const boletos_restantes =boletos_contrato - boletos_pagados;


        // Obtain and update the event key in the state
        await state.update({ Number_tickets: ctx.body });
        const amount = state.get('amount'); 
        const Number_tickets = state.get('Number_tickets');

        if(Number_tickets > 12 || Number_tickets < 1 || Number_tickets < boletos_restantes ){
            if (Number_tickets > boletos_restantes){
                return fallBack("No puedes pagar mas de lo que debes🤔❓");
            } else if(Number_tickets > 12 || Number_tickets < 1) {
                return fallBack("No pueden ser mayor que 12 o menor que 1🤔❓");
            }
            
        }
        
        const WebURL = await GetURLWeb( id_graduado, Number_tickets, amount);
        console.warn(WebURL);
    
        if (WebURL.success) {
            //localClearHistory(state);
            console.log(WebURL)
            const {
                success,
                url
            } = WebURL.url;
     
            await state.update({
                success,
                url
            });
        }
        const totalAmount = Number_tickets * amount;

        await flowDynamic(`💳 Por favor realiza una transferencia SPEI por la cantidad de ${totalAmount} pesos a la siguiente información bancaria:💳 0957987465234233 Clabe: 0847575893020`);
        // Añadir detalles sobre cómo y dónde enviar el comprobante, con uso de emojis para destacar acciones
        await flowDynamic(`📸 Una vez realizada la transferencia, por favor envía una imagen del comprobante para confirmar tu pago. Puedes hacerlo accediendo a este enlace: ${WebURL.url}`);
        
         
    })
    .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
        await flowDynamic("¿Confirmarmos el pago? 😊");
        await flowDynamic("1️⃣ Confirmo que ya realicé mi pago🧾");
        await flowDynamic("2️⃣ Finalizar conversación");
    })
    .addAction({ capture: true }, async (ctx, { state, flowDynamic, fallBack, endFlow }) => {
        const userInput = ctx.body.toLowerCase();

        if (userInput === '1') {
            localClearHistory(state);
            return endFlow("Perfecto, tu pago será revisado y te confirmamos su realización 🤔💬");
        }

        if (userInput === '2') {
            localClearHistory(state);
            return endFlow("Hasta luego. 🌟👋");
        }

        return fallBack("Necesitas escoger alguna opción válida como 3️⃣ o 4️⃣ 🤔🚀");
        localClearHistory(state);
    })
    
    
    
function localClearHistory(state) {
    state.update({ key: null, counter: 0, email: null, personaAVisitar: null, motivo: null, telefono: null });
}

export { flowpagarBoletos };
