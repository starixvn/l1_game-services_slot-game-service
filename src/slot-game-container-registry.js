import awilix from "awilix";
import * as Slot from "sc-slot-game-base";
import { fames, freeSpins, rounds, tmpRounds, jackpot } from "./models";

const { asValue } = awilix;

export default class SlotGameContainerRegistry extends Slot.SlotContainerRegistry {
    registerModels() {
        const definition = this.container.resolve("definition");

        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds(definition.configName)),
            tmpRoundsRepository: asValue(tmpRounds(definition.configName)),
            famesRepository: asValue(fames(definition.configName)),
            freeSpinsRepository: asValue(freeSpins(definition.configName)),
            jackpotsRepository: asValue(jackpot(definition.configName)),
        });
    }
}
