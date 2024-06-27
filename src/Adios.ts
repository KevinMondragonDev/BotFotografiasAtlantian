
import { addKeyword, EVENTS } from "@builderbot/bot";

import { createFlow } from "@builderbot/bot";
import { ExistsEvent, validateGraduate } from "src/services/backend";

const flowfinish = addKeyword(["2", "dos", "DOS", "segunda"])
.addAction(async (_, { flowDynamic }) => {
    await flowDynamic(`Genial. 👍`);
    await flowDynamic('Hasta luego. 🌟👋');

});

    export { flowfinish };