import { EVENTS, addKeyword } from "@builderbot/bot";

    export const welcomeFlow = addKeyword(EVENTS.WELCOME).addAnswer(
        [
          " 👩🏽‍💻 ¡Hola! Soy Denisse, la asistente virtual de la UPSRJ. ",
          "",
          "¿En qué puedo ayudarte hoy? 🤔",
          "",
          "1️⃣ Registrar una Visita 📚",
          "2️⃣ loading... 📋",
          "3️⃣ loading... 🐺",
          "4️⃣ loading... 🏥",
          "5️⃣ Salir ❌",
        ],
        { capture: true },
        async (ctx, { fallBack }) => {
          if (!["1", "2", "3", "4", "5"].includes(ctx.body)) {
            return fallBack("Seleccione una opcion del menu✅💬");
          }
        }
      );