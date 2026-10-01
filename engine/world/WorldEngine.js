// ============================================================
// FFS - WORLD ENGINE v0.3
// World foundation for Map v0.2
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
        // CITIES
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

        this.state.roads = {};


        for (
            const roadId
            in infrastructure.roads
        ) {

            const road =
                infrastructure.roads[roadId];


            this.state.roads[roadId] = {

                ...road,

                location_type:
                    "road",

                map: {

                    x: 6,

                    y: 5,

                    width: 10,

                    direction:
                        "horizontal"
                }
            };
        }


        // ----------------------------------------------------
        // TERRAIN
        // ----------------------------------------------------

        this.state.terrain = {

            width: 12,

            height: 9,

            type: "grass",

            mapType: "isometric"
        };


        // ----------------------------------------------------
        // BUILDINGS
        // ----------------------------------------------------

        this.state.buildings = {


            // ------------------------------------------------
            // HOUSE 001
            // ------------------------------------------------

            building_001: {

                id:
                    "building_001",

                cityId:
                    "city_001",

                type:
                    "house",

                category:
                    "residential",

                name:
                    "Prototype House",

                status:
                    "active",

                map: {

                    x: 3,

                    y: 3
                }
            },


            // ------------------------------------------------
            // HOUSE 002
            // ------------------------------------------------

            building_002: {

                id:
                    "building_002",

                cityId:
                    "city_001",

                type:
                    "house",

                category:
                    "residential",

                name:
                    "Prototype House 2",

                status:
                    "active",

                map: {

                    x: 8,

                    y: 3
                }
            },


            // ------------------------------------------------
            // SHOP 001
            // ------------------------------------------------

            building_003: {

                id:
                    "building_003",

                cityId:
                    "city_001",

                type:
                    "shop",

                category:
                    "commercial",

                name:
                    "Prototype Shop",

                status:
                    "active",

                map: {

                    x: 3,

                    y: 6
                }
            },


            // ------------------------------------------------
            // SHOP 002
            // ------------------------------------------------

            building_004: {

                id:
                    "building_004",

                cityId:
                    "city_001",

                type:
                    "shop",

                category:
                    "commercial",

                name:
                    "Prototype Shop 2",

                status:
                    "active",

                map: {

                    x: 8,

                    y: 6
                }
            },


            // ------------------------------------------------
            // PARK
            // ------------------------------------------------

            building_005: {

                id:
                    "building_005",

                cityId:
                    "city_001",

                type:
                    "park",

                category:
                    "public",

                name:
                    "Prototype Park",

                status:
                    "active",

                map: {

                    x: 6,

                    y: 2
                }
            }
        };


        // ----------------------------------------------------
        // NPC
        // ----------------------------------------------------

        // NPC belum dibuat.
        //
        // Tetapi koordinat dunia sekarang sudah tersedia.
        //
        // NPC nantinya akan menggunakan struktur map
        // yang sama untuk menentukan posisi dan pergerakan.

        this.state.npcs = {};


        // ----------------------------------------------------
        // PLAYER
        // ----------------------------------------------------

        this.state.players = {};

        this.state.characters = {};

        this.state.families = {};


        // ----------------------------------------------------
        // ECONOMY
        // ----------------------------------------------------

        this.state.companies = {};

        this.state.assets = {};

        this.state.transactions = {};


        // ----------------------------------------------------
        // HISTORY
        // ----------------------------------------------------

        this.state.events = {};

        this.state.history = {};


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
