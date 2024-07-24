import awilix from "awilix";
import * as Slot from "sc-slot-game-base";
import { fames, freeSpins, rounds, CurrencyGroupGames } from "./models";
import jackpots from "./models/jackpots";

const { asValue } = awilix;

export default class SlotGameContainerRegistry extends Slot.SlotContainerRegistry {
    registerModels() {
        const definition = this.container.resolve("definition");

        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds(definition.configName)),
            famesRepository: asValue(fames(definition.configName)),
            freeSpinsRepository: asValue(freeSpins(definition.configName)),
            jackpotsRepository: asValue(jackpots),
            currencyGroupGamesRepository: asValue(CurrencyGroupGames),
        });
    }
}
