const FFS_CONFIG = {
    realWorldStart: "2026-08-29T00:00:00Z",
    ffsWorldStart: "1996-08-29T00:00:00Z",

    // 1 real-world hour = 24 FFS hours
    ffsTimeMultiplier: 24
};

const FFS_TIME = {
    realWorld: new Date(FFS_CONFIG.realWorldStart),
    world: new Date(FFS_CONFIG.ffsWorldStart)
};
