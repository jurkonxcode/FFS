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
        const baselineYear = this.getBaselineYear();
        const baseline = this.getBaselineData();

        if (!baseline) {
            throw new Error(
                `[WorldInitializer] Baseline data for ${baselineYear} was not found.`
            );
        }

        return {
            world_id: "world_001",
            world_code: "FFS_MAIN",
            name: "Founder Fantasy Simulator World",

            real_world_reference_year: baselineYear,
            current_year: baselineYear,

            status: "active",

            divergence: {
                active: false,
                firstOccurredAt: null,
                reason: null
            },

            metadata: {
                source: "Real World Database",
                baselineYear: baselineYear
            }
        };
    }

    createInitialRegions() {
        const baseline = this.getBaselineData();

        if (!baseline) {
            return {};
        }

        return {
            ...baseline.regions
        };
    }

    createInitialLocations() {
        const baseline = this.getBaselineData();

        if (!baseline) {
            return {};
        }

        return {
            ...baseline.cities
        };
    }

    createInitialInfrastructure() {
        const baseline = this.getBaselineData();

        if (!baseline) {
            return {
                roads: {}
            };
        }

        return {
            roads: {
                ...baseline.infrastructure?.roads
            }
        };
    }

    initialize() {
        return {
            world: this.createInitialWorld(),
            regions: this.createInitialRegions(),
            locations: this.createInitialLocations(),
            infrastructure: this.createInitialInfrastructure()
        };
    }
}
