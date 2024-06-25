import mysql from 'mysql2/promise';
import { addKeyword } from "@builderbot/bot";

// Conexión a la base de datos
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydatabase'
});

// Definición del tipo BotContext
export type BotContext = {
    name?: string;
    body: string;
    from: string;
    media?: {
        mimeType: string;
        data: Buffer;
    };
    [key: string]: any;
};

// Función para almacenar la imagen en la base de datos
async function storeImage(context: BotContext) {
    if (!context.media) {
        throw new Error("No media data in context");
    }

    const { mimeType, data } = context.media;

    const query = 'INSERT INTO images (mimeType, imageData) VALUES (?, ?)';
    const values = [mimeType, data];

    try {
        const [result] = await connection.execute(query, values);
        console.log("Image stored successfully with ID:", result.insertId);
    } catch (error) {
        console.error("Error storing image:", error);
    }
}

// Integración en el flujo del bot
const flowConfirm = addKeyword(["imagen", "image"])
    .addAction(async (_, { flowDynamic }) => {
        await flowDynamic('Por favor, envía una imagen para almacenarla.');
    })
    .addAction({ capture: true }, async (ctx, { flowDynamic, endFlow }) => {
        if (ctx.media) {
            try {
                await storeImage(ctx);
                await flowDynamic('Imagen recibida y almacenada con éxito.');
            } catch (error) {
                await flowDynamic('Hubo un error al almacenar la imagen. Por favor, intenta nuevamente.');
            }
        } else {
            await flowDynamic('No se recibió ninguna imagen. Por favor, intenta nuevamente.');
        }
        endFlow();
    });

export { flowConfirm };
