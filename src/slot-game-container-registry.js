import awilix from "awilix";
import * as Slot from "sc-slot-game-base";
import { rounds, fames, freeSpins } from "./models/";
import SlotGamePlayGamePermissionValidator from "./validators/slot-game-play-game-permission-validator";

const { asClass } = awilix;

export default class SlotGameContainerRegistry extends Slot.SlotContainerRegistry {
    registerValidators() {
        this.container.register({
            playGamePermissionValidator: asClass(SlotGamePlayGamePermissionValidator).singleton(),
        });
    }

    registerModels() {
        const definition = this.container.resolve("definition");

        super.registerModels();
        
        this.container.register({
            roundsRepository: asValue(rounds(definition.configName)),
            famesRepository: asValue(fames(definition.configName)),
            freeSpinsRepository: asValue(freeSpins(definition.configName)),
        });
    }
}
