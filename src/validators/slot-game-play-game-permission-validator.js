import { PlayGamePermissionValidator } from "sc-game-base/src/core/validators";

export default class SlotGamePlayGamePermissionValidator extends PlayGamePermissionValidator {
    isHavePlayingPermission(userSession) {
        return !userSession.disableJackpotGames && super.isHavePlayingPermission(userSession);
    }
}
