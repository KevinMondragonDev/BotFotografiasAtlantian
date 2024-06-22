import { EVENTS, addKeyword } from "@builderbot/bot";

    export const payFlow = addKeyword('2').addAnswer(
      
        [
         `🎉 ¡Hola!👩🏽`,
        "",
        "¿Qué necesitas hoy? 😊",
        "",
        "1️⃣ Pagar tus boletos 🎫",
        "2️⃣ Ver cuántos boletos tienes 📊",
        "3️⃣ Hablar con un asesor 📲",
        "4️⃣ Salir 👋🏽",
        ],
        { capture: true }, async (ctx, { state, flowDynamic, fallBack, endFlow }) => {
          const opciones:string[] = [
             "uno", "UNO", "pagar",
            "2", "dos", "DOS", "segunda",
            "3", "tres", "TRES", "tercera",
            "4", "cuatro", "CUATRO", "cuarta"
          ]
          if (!opciones.includes(ctx.body)) {
            return fallBack(`${ctx.name} Seleccione una opcion del menu✅💬`);
          }
        }
      );