// ============================================================
// FFS - WORLD ENGINE v0.2
// ============================================================


import REAL_WORLD_DATA
    from "../../data/real_world/index.js";


import { WorldState }
    from "./WorldState.js";


import { WorldInitializer }
    from "./WorldInitializer.js";


// ============================================================
// WORLD ENGINE
// ============================================================

export class WorldEngine {


    constructor() {

        this.realWorldData =
            REAL_WORLD_DATA;


        this.state =
            new WorldState();


        this.initializer =
            new WorldInitializer(
                this.realWorldData
            );
    }


    // ========================================================
    // INITIALIZE WORLD
    // ========================================================

    initialize() {

        console.log(
            "[WorldEngine] Initializing FFS World..."
        );


        // ----------------------------------------------------
        // WORLD
        // ----------------------------------------------------

        this.state.world =
            this.initializer
                .createInitialWorld();


        // ----------------------------------------------------
        // REGIONS
        // ----------------------------------------------------

        this.state.regions =
            this.initializer
                .createInitialRegions();


        // ----------------------------------------------------
        // CITIES / LOCATIONS
        // ----------------------------------------------------

        this.state.locations =
            this.initializer
                .createInitialLocations();


        // ----------------------------------------------------
        // INFRASTRUCTURE
        // ----------------------------------------------------

        const infrastructure =
            this.initializer
                .createInitialInfrastructure();


        // ----------------------------------------------------
        // ROADS
        // ----------------------------------------------------

        for (
            const roadId
            in infrastructure.roads
        ) {

            const road =
                infrastructure.roads[roadId];


            this.state.roads[roadId] = {

                ...road,

                location_type: "road"
            };
        }


        // ----------------------------------------------------
        // INITIAL BUILDINGS
        // ----------------------------------------------------

        this.state.buildings = {

            building_001: {

                id: "building_001",

                cityId: "city_001",

                type: "house",

                category: "residential",

                name: "Prototype House",

                status: "active"
            },


            building_002: {

                id: "building_002",

                cityId: "city_001",

                type: "shop",

                category: "commercial",

                name: "Prototype Shop",

                status: "active"
            },


            building_003: {

                id: "building_003",

                cityId: "city_001",

                type: "park",

                category: "public",

                name: "Prototype Park",

                status: "active"
            }
        };


        // ----------------------------------------------------
        // NPC
        // ----------------------------------------------------

        // NPC belum dibuat.
        //
        // World harus terbentuk
        // sebelum NPC hidup di dalamnya.

        this.state.npcs = {};


        // ----------------------------------------------------
        // PLAYER
        // ----------------------------------------------------

        // Player belum dibuat.
        //
        // Player akan diperkenalkan
        // setelah World + NPC berjalan.

        this.state.players = {};

        this.state.characters = {};

        this.state.families = {};


        // ----------------------------------------------------
        // TIME
        // ----------------------------------------------------

        this.state.time = {

            year:
                this.state.world.current_year,

            referenceYear:
                this.state.world
                    .real_world_reference_year
        };


        // ----------------------------------------------------
        // DEBUG
        // ----------------------------------------------------

        console.log(
            "[WorldEngine] FFS World initialized:",
            this.state
        );


        return this.state;
    }


    // ========================================================
    // GET WORLD STATE
    // ========================================================

    getState() {

        return this.state;
    }


    // ========================================================
    // GET REAL WORLD DATA
    // ========================================================

    getRealWorldData() {

        return this.realWorldData;
    }


    // ========================================================
    // WORLD SUMMARY
    // ========================================================

    getWorldSummary() {

        return {

            world:
                this.state.world,

            regions:
                Object.keys(
                    this.state.regions
                ).length,

            locations:
                Object.keys(
                    this.state.locations
                ).length,

            roads:
                Object.keys(
                    this.state.roads
                ).length,

            buildings:
                Object.keys(
                    this.state.buildings
                ).length,

            npcs:
                Object.keys(
                    this.state.npcs
                ).length,

            players:
                Object.keys(
                    this.state.players
                ).length
        };
    }
}
