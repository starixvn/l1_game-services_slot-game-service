import mongoose from "mongoose";
import { Models } from "sc-slot-game-base";

const freeSpinSchema = Models.FreeSpinsSchema;

export default function (gameConfigName) {
    return mongoose.model(`${gameConfigName}_freespin`, freeSpinSchema);
}
