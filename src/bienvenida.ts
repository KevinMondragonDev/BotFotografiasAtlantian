import { addKeyword } from '@builderbot/bot';

import { flowtesting } from './confirm.flow';
import {flowpagarBoletos} from './CantidadBoletos.flow';
import { flowSoporte } from './Soporte.flow';
// Mensaje de respuesta predeterminado
const BackAnswer: any = "Por favor, responde ingresando el número de la opción que deseas. ✨";

// Definición del flujo de bienvenida
export const welcomeFlow = addKeyword(['hi', 'hello','hola' ,'Hola'])
    .addAnswer("👋 ¡Hola! Te puedo ayudar con las siguientes peticiones para tu evento:")
    .addAnswer(
        [
            "1️⃣ Pagar boleto(s) 🎟️",
            "2️⃣ Consultar cantidad de boletos asignados 📊",
            "3️⃣ Solicitar soporte con un asesor 🆘",
            "",
            "Por favor, responde ingresando el número de la opción que deseas. ✨"
        ].join('\n'),
        { delay: 800, capture: true },
        async (ctx, { fallBack }) => {
            const validOptions = [
                "1", "Pagar boleto", "pagar boletos", "pagar",
                "2", "Consultar cantidad de boletos", "consultar boletos", "consultar",
                "3", "Solicitar soporte", "soporte", "asesor"
            ];

            if (!validOptions.includes(ctx.body)) {
                return fallBack(BackAnswer);
            }
        },
        [
            flowtesting ,flowpagarBoletos,flowSoporte
        ]
    );
