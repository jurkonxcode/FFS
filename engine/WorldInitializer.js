export class WorldInitializer {

    constructor(realWorldData) {
        this.realWorldData = realWorldData;
    }


    getBaselineYear() {
        return this.realWorldData.timeline.startYear;
    }


    getBaselineData() {
        const year = this.getBaselineYear();

        return this.realWorldData.baselines?.[year] ?? null;
    }


    createInitialWorld() {

        const baselineYear =
            this.getBaselineYear();

        const baseline =
            this.getBaselineData();


        if (!baseline) {
            throw new Error(
                `[WorldInitializer] Baseline data for ${baselineYear} was not found.`
            );
        }


        const world = {

            world_id: "world_001",

            world_code: "FFS_MAIN",

            name: "Founder Fantasy Simulator World",


            real_world_reference_year:
                baselineYear,


            current_year:
                baselineYear,


            status: "active",


            divergence: {
                active: false,

                firstOccurredAt: null,

                reason: null
            },


            metadata: {
                source: "Real World Database",

                baselineYear:
                    baselineYear
            }
        };


        return world;
    }


    createInitialRegions() {

        const baseline =
            this.getBaselineData();


        return {
            ...baseline.regions
        };
    }


    createInitialLocations() {

        const baseline =
            this.getBaselineData();


        return {
            ...baseline.cities
        };
    }


    createInitialInfrastructure() {

        const baseline =
            this.getBaselineData();


        return {
            roads: {
                ...baseline.infrastructure.roads
            }
        };
    }
}
