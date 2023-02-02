import { PlayGamePermissionValidator } from "sc-game-base/src/core/validators";
import SlotGamePlayGamePermissionValidator from "../../../src/validators/slot-game-play-game-permission-validator";

describe("SlotGamePlayGamePermissionValidator", () => {
    let permissionValidator;

    beforeEach(() => {
        permissionValidator = new SlotGamePlayGamePermissionValidator();
    });

    describe("isHavePlayingPermission", () => {
        describe("when userSession.disableJackpotGames is true", () => {
            it("should return false", async () => {
                // Arrange
                const userSession = { disableJackpotGames: true };

                // Act
                const actualValue = await permissionValidator.isHavePlayingPermission(userSession);

                // Assert
                expect(actualValue).toBeFalse();
            });
        });

        describe("when userSession.disableJackpotGames is false", () => {
            describe("when other conditions is not passed", () => {
                it("should return false", async () => {
                    // Arrange
                    const userSession = { disableJackpotGames: false };
                    jest.spyOn(PlayGamePermissionValidator.prototype, "isHavePlayingPermission").mockReturnValueOnce(false);

                    // Act
                    const actualValue = await permissionValidator.isHavePlayingPermission(userSession);

                    // Assert
                    expect(actualValue).toBeFalse();
                });
            });

            describe("when other conditions is  passed", () => {
                it("should return true", async () => {
                    // Arrange
                    const userSession = { disableJackpotGames: false };
                    jest.spyOn(PlayGamePermissionValidator.prototype, "isHavePlayingPermission").mockReturnValueOnce(true);

                    // Act
                    const actualValue = await permissionValidator.isHavePlayingPermission(userSession);

                    // Assert
                    expect(actualValue).toBeTrue();
                });
            });
        });
    });
});
