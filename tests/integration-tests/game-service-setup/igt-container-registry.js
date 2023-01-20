import { asClass } from "awilix";
import SlotGameContainerRegistry from "../../../src/slot-game-container-registry";
import IGTSlotHttpRouter from "./igt-slot-http-router";

export default class IGTSlotGameContainerRegistry extends SlotGameContainerRegistry {
    registerRouters() {
        super.registerRouters();

        this.container.register({
            httpRouter: asClass(IGTSlotHttpRouter),
        });
    }
}
