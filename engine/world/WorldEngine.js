import REAL_WORLD_DATA from "../../data/real_world/index.js";
import { WorldState } from "./WorldState.js";
import { WorldInitializer } from "./WorldInitializer.js";

export class WorldEngine {
    constructor() {
        this.realWorldData = REAL_WORLD_DATA;

        this.state = new WorldState();

        this.initializer = new WorldInitializer(
            this.realWorldData
        );
    }

    initialize() {
        console.log("[WorldEngine] Initializing FFS World...");

        const world =
            this.initializer.createInitialWorld();

        this.state.world = world;

        console.log(
            "[WorldEngine] World initialized:",
            this.state.world
        );

        return this.state;
    }

    getState() {
        return this.state;
    }

    getRealWorldData() {
        return this.realWorldData;
    }
}
