import mongoose from "mongoose";
import { Models } from "sc-slot-game-base";

const roundSchema = Models.RoundsSchema;

export default function (gameConfigName) {
    return mongoose.model(`${gameConfigName}_round`, roundSchema);
}
