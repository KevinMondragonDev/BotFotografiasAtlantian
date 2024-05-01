import { addKeyword, EVENTS } from "@builderbot/bot";
import { generateTimer } from "../utils/generateTimer";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import AIClass from "../services/ai";
import { getFullCurrentDate } from "src/utils/currentDate";
import { pdfQuery } from "src/services/pdf";
/**### EJEMPLOS DE RESPUESTAS IDEALES(Basate en ellos pero no los uses, formula nuevos con esa informacion):
-Bienvenido con el Doctor Carlos Mendoza!
-Que tal estoy para ayudarte con tu necesidades -
Bienvenido a la consulta del Dr.Carlos Mendoza, especialista en cardiología con más de 20 años de experiencia. ¿Cómo puedo asistirte hoy? 😊
¡Hola! Estoy aquí para ayudarte con cualquier información que necesites sobre los servicios del Doctor Mendoza , ¿Tienes alguna pregunta específica
-Nunca separes su nombre del Doctor Carlos Mendoza
 */
const PROMPT_SELLER =  ` Como asistente virtual experto en resolver dudas de acerca de los servicios e informacion del Doctor Carlos Mendoza tu mayor funcion es brindar informacion que el usuario te solicite.
### DÍA ACTUAL
{CURRENT_DAY}

### HISTORIAL DE CONVERSACIÓN (Cliente/Vendedor)
{HISTORY}

### BASE DE DATOS
{DATABASE}

NOMBRE_DEL_CLIENTE="{customer_name}"

Para proporcionar respuestas más útiles, puedes utilizar la información proporcionada en la base de datos. El contexto es la única información que tienes. Ignora cualquier cosa que no esté relacionada con el contexto.



### INTRUCCIONES
-Debes de  agregar emojis acorde a la conversacion,
-- Evita decir "Hola"; puedes usar el NOMBRE_DEL_CLIENTE directamente.
- Utiliza el NOMBRE_DEL_CLIENTE para personalizar tus respuestas y hacer la conversación más amigable (ejemplo: "como te mencionaba...", "es una buena idea...").
- Mantén un tono profesional y siempre responde en primera persona.
- NO ofrescas promociones que no existe en la BASE DE DATOS
-NO Repitas mensajes, trata de siempre orientar sin repetir mensajes
-Tu meta es proporcionar informacion sobre el medico y responder dudas
-NO insistas en la cita 
- Utiliza el NOMBRE_DEL_CLIENTE para personalizar tus respuestas y hacer la conversación más amigable (ejemplo: "como te mencionaba...", "es una buena idea...").

##SI EL CLIENTE TIENE UNA EMERGENCIA MEDICA O DE OTRO TIPO
--Como asistente Digital estoy aquí es ayudarle a reservar una cita con el Doctor Carlos Mendoza. No puedo ayudarle con otros temas "
--"Mi función como asistente digital es ayudarle a agendar una cita con el Doctor Carlos Mendoza. Lamentablemente, no estoy equipado para asistir en otros temas."
--"Como asistente digital, mi tarea es facilitar la reserva de su cita con el Doctor Carlos Mendoza y por ley no puedo proporcionarte informacion."
Respuesta útil adecuadas para enviar por WhatsApp :

##SI EL CLIENTE SE DESVIA DEL TEMA DE AGENDAR UNA CITA O INFORMACION
--Como asistente Digital estoy aquí es ayudarle a reservar una cita con el Doctor Carlos Mendoza. No puedo ayudarle con otros temas "
--"Mi función como asistente digital es ayudarle a agendar una cita con el Doctor Carlos Mendoza. Lamentablemente, no estoy equipado para asistir en otros temas."
--"Como asistente digital, mi tarea es facilitar la reserva de su cita con el Doctor Carlos Mendoza y no puedo proporcionar asistencia en otros temas."
Respuesta útil adecuadas para enviar por WhatsApp :`


/**
 * 
 * @param name 
 * @returns 
 */

 
export const generatePromptSeller = ( history: string, database:string,name:string) => {
    const nowDate = getFullCurrentDate()
 
    return PROMPT_SELLER
        .replace('{HISTORY}', history)
        .replace('{CURRENT_DAY}', nowDate)
        .replace('{DATABASE}', database)
        .replace('{customer_name}', name )
       
};

const flowSeller = addKeyword(EVENTS.ACTION)
    .addAnswer(``)
    .addAction(async (ctx, { state, flowDynamic, extensions }) => {
        try {

            const ai = extensions.ai as AIClass
            const history = getHistoryParse(state)
            const name = ctx?.pushName ?? ''

            const dataBase = await pdfQuery(ctx.body)
            console.log({dataBase})
            const promptInfo = generatePromptSeller(history, dataBase,name)

            const response = await ai.createChat([
                {
                    role: 'system',
                    content: promptInfo
                }
            ])

            await handleHistory({ content: response, role: 'assistant' }, state)
            const chunks = response.split(/(?<!\d)\.\s+/g);
            for (const chunk of chunks) {
                await flowDynamic([{ body: chunk.trim(), delay: generateTimer(150, 250) }]);
            }
        } catch (err) {
            console.log(`[ERROR]:`, err)
            return
        }
    })

export { flowSeller }