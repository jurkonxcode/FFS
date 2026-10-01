export class WorldInitializer {
    constructor(realWorldData) {
        this.realWorldData = realWorldData;
    }

    createInitialWorld() {
        const startYear = this.realWorldData.timeline.startYear;

        return {
            world_id: "world_001",
            world_code: "FFS_MAIN",
            name: "Founder Fantasy Simulator World",

            real_world_reference_year: startYear,

            status: "active"
        };
    }
}
