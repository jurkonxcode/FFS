// ============================================================
// FFS - MAP ENGINE v0.3
// Converts WorldState into a spatial visual map model.
// ============================================================

export class MapEngine {

    constructor(worldState) {

        this.worldState =
            worldState;

        this.map =
            null;
    }


    // ========================================================
    // INITIALIZE MAP
    // ========================================================

    initialize() {

        if (!this.worldState) {

            throw new Error(
                "[MapEngine] WorldState is required."
            );
        }

        console.log(
            "[MapEngine] Initializing Map Engine v0.3..."
        );

        this.map = {

            id:
                "map_001",

            type:
                "isometric",

            version:
                "0.3",

            worldId:
                this.worldState.world?.world_id
                ?? null,

            terrain: {

                width:
                    this.worldState
                        .terrain
                        ?.width
                    ?? 12,

                height:
                    this.worldState
                        .terrain
                        ?.height
                    ?? 9,

                type:
                    this.worldState
                        .terrain
                        ?.type
                    ?? "grass"
            },

            regions: [],

            cities: [],

            roads: [],

            buildings: [],

            objects: [],

            environment:
                this.worldState.environment
                ?? {}
        };


        this.buildRegions();

        this.buildCities();

        this.buildRoads();

        this.buildBuildings();


        console.log(
            "[MapEngine] Map initialized:",
            this.map
        );


        return this.map;
    }


    // ========================================================
    // REGIONS
    // ========================================================

    buildRegions() {

        const regions =
            this.worldState.regions
            ?? {};


        this.map.regions =
            Object.values(regions)
                .map(
                    (region, index) => {

                        return {

                            id:
                                region.id
                                ?? `region_${index + 1}`,

                            name:
                                region.name
                                ?? "Unnamed Region",

                            type:
                                region.type
                                ?? "region"
                        };
                    }
                );
    }


    // ========================================================
    // CITIES
    // ========================================================

    buildCities() {

        const locations =
            this.worldState.locations
            ?? {};


        this.map.cities =
            Object.values(locations)

                .filter(
                    location =>
                        location.type === "city"
                )

                .map(
                    (city, index) => {

                        return {

                            id:
                                city.id
                                ?? `city_${index + 1}`,

                            name:
                                city.name
                                ?? "Unnamed City",

                            regionId:
                                city.regionId
                                ?? null,

                            type:
                                "city"
                        };
                    }
                );
    }


    // ========================================================
    // ROADS
    // ========================================================

    buildRoads() {

        const roads =
            this.worldState.roads
            ?? {};


        this.map.roads =
            Object.values(roads)

                .map(
                    (road, index) => {

                        return {

                            id:
                                road.id
                                ?? `road_${index + 1}`,

                            name:
                                road.name
                                ?? "Road",

                            cityId:
                                road.cityId
                                ?? null,

                            type:
                                "road",

                            map:
                                road.map
                                ?? {

                                    x: 0,

                                    y: 0,

                                    width: 1,

                                    direction:
                                        "horizontal"
                                }
                        };
                    }
                );
    }


    // ========================================================
    // BUILDINGS
    // ========================================================

    buildBuildings() {

        const buildings =
            this.worldState.buildings
            ?? {};


        this.map.buildings =
            Object.values(buildings)

                .map(
                    (building, index) => {

                        return {

                            id:
                                building.id
                                ?? `building_${index + 1}`,

                            cityId:
                                building.cityId
                                ?? null,

                            type:
                                building.type
                                ?? "building",

                            category:
                                building.category
                                ?? "generic",

                            name:
                                building.name
                                ?? "Building",

                            status:
                                building.status
                                ?? "active",

                            district:
                                building.district
                                ?? "generic",

                            map:
                                building.map
                                ?? {

                                    x: 0,

                                    y: 0,

                                    width: 1,

                                    height: 1
                                }
                        };
                    }
                );


        this.map.objects =
            this.map.buildings;
    }


    // ========================================================
    // GET MAP
    // ========================================================

    getMap() {

        return this.map;
    }


    // ========================================================
    // GET MAP SUMMARY
    // ========================================================

    getMapSummary() {

        return {

            mapId:
                this.map?.id
                ?? null,

            type:
                this.map?.type
                ?? null,

            version:
                this.map?.version
                ?? null,

            terrain:
                this.map?.terrain
                ?? null,

            regionCount:
                this.map?.regions?.length
                ?? 0,

            cityCount:
                this.map?.cities?.length
                ?? 0,

            roadCount:
                this.map?.roads?.length
                ?? 0,

            buildingCount:
                this.map?.buildings?.length
                ?? 0,

            environment:
                this.map?.environment
                ?? {}
        };
    }
}
