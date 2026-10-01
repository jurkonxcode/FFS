export class WorldState {
    constructor() {
        this.world = null;
        this.time = null;

        // World structure
        this.regions = {};
        this.locations = {};

        // Spatial world
        this.terrain = {};
        this.roads = {};
        this.buildings = {};
        this.environment = {};

        // Living world
        this.npcs = {};

        // Player systems
        this.players = {};
        this.characters = {};
        this.families = {};

        // Economy
        this.companies = {};
        this.assets = {};
        this.transactions = {};

        // Simulation
        this.events = {};
        this.history = {};
    }

    reset() {
        this.world = null;
        this.time = null;

        this.regions = {};
        this.locations = {};

        this.terrain = {};
        this.roads = {};
        this.buildings = {};
        this.environment = {};

        this.npcs = {};

        this.players = {};
        this.characters = {};
        this.families = {};

        this.companies = {};
        this.assets = {};
        this.transactions = {};

        this.events = {};
        this.history = {};
    }
}
