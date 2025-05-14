import mongoose from "mongoose";
import { Models } from "sc-slot-game-base";

export default function (gameConfigName) {
    return mongoose.model(`${gameConfigName}_round`, Models.RoundsSchema);
}
