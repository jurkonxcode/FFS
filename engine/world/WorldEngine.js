// ============================================================
// FFS - WORLD ENGINE
// Living City Foundation
// ============================================================

import { WorldState } from "./WorldState.js";
import { WorldInitializer } from "./WorldInitializer.js";


export class WorldEngine {

    constructor(realWorldData) {

        this.realWorldData = realWorldData;

        this.state =
            new WorldState();

        this.initializer =
            new WorldInitializer(
                realWorldData
            );
    }


    // ========================================================
    // INITIALIZE WORLD
    // ========================================================

    initialize() {

        const world =
            this.initializer
                .createInitialWorld();

        const regions =
            this.initializer
                .createInitialRegions();

        const locations =
            this.initializer
                .createInitialLocations();

        const infrastructure =
            this.initializer
                .createInitialInfrastructure();


        this.state.world =
            world;

        this.state.regions =
            regions;

        this.state.locations =
            locations;

        this.state.roads =
            this.buildRoadData(
                infrastructure.roads
            );

        this.state.buildings =
            this.buildBuildingData();

        this.state.terrain =
            this.buildTerrainData();

        this.state.environment =
            this.buildEnvironmentData();

        return this.state;
    }


    // ========================================================
    // TERRAIN
    // ========================================================

    buildTerrainData() {

        return {

            width: 16,

            height: 12,

            type: "grass",

            mapType: "isometric",

            era: 1996
        };
    }


    // ========================================================
    // ROADS
    // ========================================================

    buildRoadData(roads) {

        return {

            ...roads,

            road_001: {

                id: "road_001",

                cityId: "city_001",

                type: "road",

                name: "Main Road",

                map: {

                    x: 1,

                    y: 6,

                    width: 14,

                    direction: "horizontal"
                }
            },


            road_002: {

                id: "road_002",

                cityId: "city_001",

                type: "road",

                name: "Central Avenue",

                map: {

                    x: 8,

                    y: 1,

                    width: 10,

                    direction: "vertical"
                }
            }
        };
    }


    // ========================================================
    // BUILDINGS
    // ========================================================

    buildBuildingData() {

        return {


            // =================================================
            // RESIDENTIAL DISTRICT
            // =================================================

            house_001: {

                id: "house_001",

                name: "Red Brick House",

                type: "house",

                district: "residential",

                cityId: "city_001",

                map: {

                    x: 3,

                    y: 3,

                    width: 2,

                    height: 2
                }
            },


            house_002: {

                id: "house_002",

                name: "Concrete Residence",

                type: "house",

                district: "residential",

                cityId: "city_001",

                map: {

                    x: 11,

                    y: 3,

                    width: 2,

                    height: 2
                }
            },


            house_003: {

                id: "house_003",

                name: "Suburban House",

                type: "house",

                district: "residential",

                cityId: "city_001",

                map: {

                    x: 3,

                    y: 9,

                    width: 2,

                    height: 2
                }
            },


            house_004: {

                id: "house_004",

                name: "Family Residence",

                type: "house",

                district: "residential",

                cityId: "city_001",

                map: {

                    x: 11,

                    y: 9,

                    width: 2,

                    height: 2
                }
            },


            // =================================================
            // COMMERCIAL DISTRICT
            // =================================================

            shop_001: {

                id: "shop_001",

                name: "Downtown Shop",

                type: "shop",

                district: "commercial",

                cityId: "city_001",

                map: {

                    x: 4,

                    y: 6,

                    width: 2,

                    height: 2
                }
            },


            shop_002: {

                id: "shop_002",

                name: "Corner Store",

                type: "shop",

                district: "commercial",

                cityId: "city_001",

                map: {

                    x: 10,

                    y: 6,

                    width: 2,

                    height: 2
                }
            },


            // =================================================
            // CBD
            // =================================================

            cbd_001: {

                id: "cbd_001",

                name: "FFS Tower",

                type: "office",

                district: "cbd",

                cityId: "city_001",

                map: {

                    x: 8,

                    y: 4,

                    width: 2,

                    height: 2
                }
            },


            cbd_002: {

                id: "cbd_002",

                name: "Central Glass Tower",

                type: "office",

                district: "cbd",

                cityId: "city_001",

                map: {

                    x: 8,

                    y: 8,

                    width: 2,

                    height: 2
                }
            },


            // =================================================
            // PUBLIC SPACE
            // =================================================

            park_001: {

                id: "park_001",

                name: "Central Park",

                type: "park",

                district: "public",

                cityId: "city_001",

                map: {

                    x: 6,

                    y: 2,

                    width: 3,

                    height: 3
                }
            }
        };
    }


    // ========================================================
    // ENVIRONMENT
    // ========================================================

    buildEnvironmentData() {

        return {

            era: 1996,

            season: "temperate",

            weather: "clear",

            lighting: "day",

            trees: true,

            streetLights: true,

            roadMarkings: true,

            ambientProps: true
        };
    }


    // ========================================================
    // GET STATE
    // ========================================================

    getState() {

        return this.state;
    }
}
