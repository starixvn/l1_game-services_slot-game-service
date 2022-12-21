import awilix from "awilix";
import * as Slot from "sc-slot-game-base";
import SlotGamePlayGamePermissionValidator from "./validators/slot-game-play-game-permission-validator";

const { asClass } = awilix;

export default class SlotGameContainerRegistry extends Slot.SlotContainerRegistry {
    registerValidators() {
        this.container.register({
            playGamePermissionValidator: asClass(SlotGamePlayGamePermissionValidator).singleton(),
        });
    }
}
