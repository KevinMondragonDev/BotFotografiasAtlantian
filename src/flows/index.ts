import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";

import { flowConfirm } from "./confirm.flow";
import { payFlow } from "./pay.flow";



export default createFlow([welcomeFlow, flowConfirm])