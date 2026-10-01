
export class WorldState {
    constructor() {
        this.world = null;

        this.time = null;

        this.regions = {};
        this.locations = {};
        this.buildings = {};

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

    reset() {
        this.world = null;
        this.time = null;

        this.regions = {};
        this.locations = {};
        this.buildings = {};

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
