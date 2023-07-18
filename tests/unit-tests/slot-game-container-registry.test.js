import * as Slot from "sc-slot-game-base";
import SlotGameContainerRegistry from "../../src/slot-game-container-registry";

jest.mock(
    "awilix",
    () => {
        return {
            asValue: jest.fn((t) => t),
            asClass: () => ({ singleton: () => ({ proxy: () => {} }) }),
            InjectionMode: jest.fn(() => {}),
            createContainer: jest.fn(() => {}),
        };
    },
    { virtual: true }
);

describe("extends", () => {
    it("should extend Slot.SlotContainerRegistry", () => {
        //Arrange
        const registry = new SlotGameContainerRegistry();
        // Assert
        expect(registry instanceof Slot.SlotContainerRegistry);
    });
});
