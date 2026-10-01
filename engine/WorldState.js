export class WorldState {

    constructor() {

        this.world = null;

        this.time = null;


        // WORLD STRUCTURE

        this.regions = {};

        this.locations = {};

        this.roads = {};

        this.buildings = {};


        // LIVING WORLD

        this.npcs = {};


        // PLAYER SYSTEM

        this.players = {};

        this.characters = {};

        this.families = {};


        // ECONOMY

        this.companies = {};

        this.assets = {};

        this.transactions = {};


        // HISTORY

        this.events = {};

        this.history = {};
    }


    reset() {

        this.world = null;

        this.time = null;


        this.regions = {};

        this.locations = {};

        this.roads = {};

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
