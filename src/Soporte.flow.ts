import { addKeyword, EVENTS } from "@builderbot/bot";

import { createFlow } from "@builderbot/bot";
import { ExistsEvent, validateGraduate } from "src/services/backend";

const flowSoporte= addKeyword(["3", "tres", "TRES", "tercera"])
.addAction(async (_, { flowDynamic }) => {
    await flowDynamic('Hemos avisado a un Planner acerca de tu solicitud de soporte. En un momento te contactará.');

});

 export { flowSoporte };