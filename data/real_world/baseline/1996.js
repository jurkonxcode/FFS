const REAL_WORLD_1996 = {
    year: 1996,

    world: {
        referenceYear: 1996,
        status: "baseline"
    },

    regions: {
        region_001: {
            id: "region_001",
            name: "FFS Prototype Region",
            type: "region"
        }
    },

    cities: {
        city_001: {
            id: "city_001",
            name: "FFS Prototype City",
            regionId: "region_001",
            type: "city"
        }
    },

    infrastructure: {
        roads: {
            road_001: {
                id: "road_001",
                cityId: "city_001",
                type: "road",
                name: "Main Road"
            }
        }
    },

    population: {
        prototypePopulation: 100
    },

    economy: {
        status: "prototype"
    },

    technology: {
        status: "prototype"
    }
};

export default REAL_WORLD_1996;
