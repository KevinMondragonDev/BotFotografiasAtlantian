import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";

import { flowConfirm } from "./confirm.flow";




export default createFlow([welcomeFlow, flowConfirm])