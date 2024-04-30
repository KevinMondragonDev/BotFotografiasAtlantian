import { createFlow } from "@builderbot/bot";
import { welcomeFlow } from "./welcome.flow";
import { flowSeller } from "./seller.flow";
import { flowSchedule } from "./schedule.flow";
import { flowConfirm } from "./confirm.flow";
import { flowCancelar } from "./cancelFolio.flow";
flowCancelar
flowCancelar


export default createFlow([welcomeFlow, flowSeller, flowSchedule,flowCancelar, flowConfirm])