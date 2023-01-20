import { SlotHttpRouter } from "sc-slot-game-base/src/routers";

export default class IGTSlotHttpRouter extends SlotHttpRouter {
    init(app) {
        super.init(app);

        app.post("/igt-api/set-board", (_req, res) => this.handleSetBoard(_req.body, res));
    }
}
