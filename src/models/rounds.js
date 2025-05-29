import mongoose from "mongoose";
import { Models } from "sc-slot-game-base";

const tmpRounds = (gameConfigName) => {
    return mongoose.model(`${gameConfigName}_tmpround`, Models.RoundsSchema);
};

const rounds = (gameConfigName) => {
    return mongoose.model(`${gameConfigName}_round`, Models.RoundsSchema);
};

export { tmpRounds, rounds };
