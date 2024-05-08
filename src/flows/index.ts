import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";
import { flowSeller } from "./seller.flow";
import { flowSchedule } from "./schedule.flow";
import { flowConfirm } from "./confirm.flow";
import { flowCancelar } from "./cancelFolio.flow";




export default createFlow([welcomeFlow, flowSeller, flowSchedule,flowCancelar, flowConfirm])