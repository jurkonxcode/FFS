export default class MapRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        if (!this.container) {
            throw new Error(`MapRenderer: container "${containerId}" tidak ditemukan.`);
        }

        // =========================================================
        // FFS v0.9-G.1
        // FIRST LIVING CITY BLOCK
        // =========================================================

        // ---------------------------------------------------------
        // ISOMETRIC GEOMETRY
        // ---------------------------------------------------------
        this.tileWidth = 72;
        this.tileHeight = 36;

        this.halfTileWidth = this.tileWidth / 2;
        this.halfTileHeight = this.tileHeight / 2;

        this.heightUnit = 12;

        this.buildingDepth = 52;

        // ---------------------------------------------------------
        // ZOOM
        // ---------------------------------------------------------
        this.zoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 1.5;
        this.zoomStep = 0.1;

        // ---------------------------------------------------------
        // LAYERS
        // ---------------------------------------------------------
        this.layers = {};

        this.mapData = null;

        this.renderer = null;
        this.world = null;
        this.content = null;

        // ---------------------------------------------------------
        // DEFAULT MAP SIZE
        // ---------------------------------------------------------
        this.mapWidth = 12;
        this.mapHeight = 9;

        // ---------------------------------------------------------
        // PROJECTION ORIGIN
        // ---------------------------------------------------------
        this.origin = {
            x: 0,
            y: 0
        };

        this.contentOffset = {
            x: 0,
            y: 0
        };

        // ---------------------------------------------------------
        // LIVING WORLD
        // ---------------------------------------------------------
        this.animationFrame = null;
        this.animationTime = 0;

        this.animatedObjects = [];

        this.npcs = [];
        this.vehicles = [];
        this.ambientObjects = [];

        this.prefersReducedMotion =
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // ---------------------------------------------------------
        // RESIZE
        // ---------------------------------------------------------
        window.addEventListener("resize", () => {
            this.updateMapLayout();
        });
    }

    // ============================================================
    // MAIN RENDER
    // ============================================================

    render(mapData) {
        if (!mapData) {
            console.warn("MapRenderer: mapData tidak tersedia.");
            return;
        }

        this.stopAnimation();

        this.mapData = mapData;

        this.mapWidth =
            Number(mapData.width) ||
            Number(mapData.mapWidth) ||
            12;

        this.mapHeight =
            Number(mapData.height) ||
            Number(mapData.mapHeight) ||
            9;

        // --------------------------------------------------------
        // CLEAR
        // --------------------------------------------------------

        this.container.innerHTML = "";

        // --------------------------------------------------------
        // INTERNAL PROTOTYPE STYLE
        // --------------------------------------------------------

        this.injectPrototypeStyles();

        // --------------------------------------------------------
        // ROOT
        // --------------------------------------------------------

        this.renderer = document.createElement("div");
        this.renderer.className = "ffs-map-renderer";

        this.world = document.createElement("div");
        this.world.className = "ffs-map-world";

        this.content = document.createElement("div");
        this.content.className = "ffs-map-content";

        // --------------------------------------------------------
        // LAYERS
        // --------------------------------------------------------

        const layerNames = [
            "terrain",
            "roads",
            "sidewalks",
            "buildings",
            "trees",
            "props",
            "vehicles",
            "npcs",
            "signs",
            "labels",
            "environment"
        ];

        this.layers = {};

        layerNames.forEach((name) => {
            const layer = document.createElement("div");

            layer.className = `ffs-map-layer ffs-map-layer-${name}`;

            this.layers[name] = layer;

            this.content.appendChild(layer);
        });

        this.world.appendChild(this.content);
        this.renderer.appendChild(this.world);

        // --------------------------------------------------------
        // ZOOM CONTROLS
        // --------------------------------------------------------

        this.createZoomControls();

        // --------------------------------------------------------
        // MOUNT
        // --------------------------------------------------------

        this.container.appendChild(this.renderer);

        // --------------------------------------------------------
        // RENDER WORLD
        // --------------------------------------------------------

        this.renderTerrain(mapData);
        this.renderRoads(mapData);

        // v0.9-G.1
        // First Living City Block
        this.renderLivingBlock(mapData);

        this.renderBuildings(mapData);
        this.renderTrees(mapData);
        this.renderProps(mapData);

        this.renderVehicles(mapData);
        this.renderNPCs(mapData);

        this.renderSigns(mapData);
        this.renderDistrictLabels(mapData);
        this.renderEnvironment(mapData);

        this.renderCityTitle(mapData);

        // --------------------------------------------------------
        // LAYOUT
        // --------------------------------------------------------

        this.updateMapLayout();
        this.applyZoom();

        // --------------------------------------------------------
        // ANIMATION
        // --------------------------------------------------------

        this.startAnimation();
    }

    // ============================================================
    // PROTOTYPE STYLES
    // ============================================================

    injectPrototypeStyles() {
        if (document.getElementById("ffs-v09g-prototype-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "ffs-v09g-prototype-styles";

        style.textContent = `
            /* =====================================================
               FFS v0.9-G PROCEDURAL PROTOTYPE
               ===================================================== */

            .ffs-v09g-terrain-volume {
                position: absolute;
                pointer-events: none;
            }

            .ffs-v09g-terrain-side {
                position: absolute;
                pointer-events: none;
            }

            .ffs-v09g-terrain-side-left,
            .ffs-v09g-terrain-side-right {
                position: absolute;
                pointer-events: none;
            }

            .ffs-v09g-terrain-shadow {
                position: absolute;
                pointer-events: none;
            }

            /* -----------------------------------------------------
               NPC
               ----------------------------------------------------- */

            .ffs-v09g-npc {
                position: absolute;
                width: 18px;
                height: 28px;
                transform-origin: 50% 100%;
                pointer-events: none;
                z-index: 4;
            }

            .ffs-v09g-npc-shadow {
                position: absolute;
                width: 18px;
                height: 7px;
                left: 0;
                bottom: -2px;
                border-radius: 50%;
                background: rgba(0,0,0,.22);
                transform: scaleX(1.1);
            }

            .ffs-v09g-npc-head {
                position: absolute;
                width: 9px;
                height: 9px;
                left: 4.5px;
                top: 1px;
                border-radius: 50%;
                background: #f0c7a5;
                border: 1px solid rgba(0,0,0,.18);
            }

            .ffs-v09g-npc-body {
                position: absolute;
                width: 11px;
                height: 11px;
                left: 3.5px;
                top: 10px;
                border-radius: 4px 4px 3px 3px;
                background: #3f6f9f;
            }

            .ffs-v09g-npc-leg {
                position: absolute;
                width: 4px;
                height: 8px;
                top: 20px;
                border-radius: 2px;
                background: #30343a;
            }

            .ffs-v09g-npc-leg-left {
                left: 4px;
            }

            .ffs-v09g-npc-leg-right {
                right: 4px;
            }

            /* -----------------------------------------------------
               VEHICLE
               ----------------------------------------------------- */

            .ffs-v09g-vehicle {
                position: absolute;
                width: 42px;
                height: 20px;
                transform-origin: 50% 50%;
                pointer-events: none;
                z-index: 3;
            }

            .ffs-v09g-vehicle-shadow {
                position: absolute;
                width: 42px;
                height: 8px;
                left: 0;
                bottom: -3px;
                border-radius: 50%;
                background: rgba(0,0,0,.22);
            }

            .ffs-v09g-vehicle-body {
                position: absolute;
                left: 1px;
                top: 5px;
                width: 40px;
                height: 12px;
                border-radius: 5px 7px 4px 4px;
                background: #697783;
                border: 1px solid rgba(0,0,0,.28);
            }

            .ffs-v09g-vehicle-window {
                position: absolute;
                left: 13px;
                top: 3px;
                width: 14px;
                height: 7px;
                border-radius: 3px 3px 1px 1px;
                background: #9cb5c7;
                border: 1px solid rgba(0,0,0,.18);
            }

            .ffs-v09g-vehicle-wheel {
                position: absolute;
                width: 7px;
                height: 7px;
                bottom: 0;
                border-radius: 50%;
                background: #20242a;
            }

            .ffs-v09g-vehicle-wheel-left {
                left: 6px;
            }

            .ffs-v09g-vehicle-wheel-right {
                right: 6px;
            }

            /* -----------------------------------------------------
               ENVIRONMENT
               ----------------------------------------------------- */

            .ffs-v09g-cloud {
                position: absolute;
                width: 90px;
                height: 28px;
                border-radius: 30px;
                background: rgba(255,255,255,.72);
                pointer-events: none;
            }

            .ffs-v09g-life-label {
                position: absolute;
                pointer-events: none;
                white-space: nowrap;
                font-size: 10px;
                letter-spacing: .04em;
                opacity: .7;
            }

            .ffs-v09g-bird {
                position: absolute;
                width: 18px;
                height: 8px;
                pointer-events: none;
            }

            .ffs-v09g-bird::before,
            .ffs-v09g-bird::after {
                content: "";
                position: absolute;
                top: 2px;
                width: 8px;
                height: 5px;
                border-top: 2px solid rgba(40,40,40,.55);
            }

            .ffs-v09g-bird::before {
                left: 0;
                transform: rotate(25deg);
            }

            .ffs-v09g-bird::after {
                right: 0;
                transform: rotate(-25deg);
            }
        `;

        document.head.appendChild(style);
    }

    // ============================================================
    // v0.9-G.1
    // FIRST LIVING CITY BLOCK
    // ============================================================

    renderLivingBlock(mapData) {
        if (!this.layers.props) {
            return;
        }

        // --------------------------------------------------------
        // ROOT
        // --------------------------------------------------------

        const block = document.createElement("div");

        block.className = "ffs-v09g1-living-block";

        // --------------------------------------------------------
        // INTERNAL STYLE
        // --------------------------------------------------------

        if (!document.getElementById("ffs-v09g1-living-block-style")) {
            const style = document.createElement("style");

            style.id = "ffs-v09g1-living-block-style";

            style.textContent = `
                /* =================================================
                   FFS v0.9-G.1
                   FIRST LIVING CITY BLOCK
                   ================================================= */

                .ffs-v09g1-living-block {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 1;
                }

                .ffs-v09g1-zone {
                    position: absolute;
                    box-sizing: border-box;
                    pointer-events: none;
                }

                /* -------------------------------------------------
                   CENTRAL PLAZA
                   ------------------------------------------------- */

                .ffs-v09g1-plaza {
                    width: 150px;
                    height: 92px;

                    border-radius: 14px;

                    background:
                        linear-gradient(
                            135deg,
                            rgba(224,215,190,.94),
                            rgba(193,184,161,.94)
                        );

                    border:
                        2px solid rgba(88,80,68,.25);

                    box-shadow:
                        0 10px 18px rgba(0,0,0,.13);

                    transform:
                        translate(-50%, -50%)
                        rotate(0deg);
                }

                .ffs-v09g1-plaza-inner {
                    position: absolute;
                    left: 50%;
                    top: 50%;

                    width: 76px;
                    height: 48px;

                    transform:
                        translate(-50%, -50%)
                        rotate(0deg);

                    border-radius: 50%;

                    border:
                        2px solid rgba(117,105,84,.25);

                    background:
                        rgba(232,224,201,.45);
                }

                /* -------------------------------------------------
                   PEDESTRIAN PATHS
                   ------------------------------------------------- */

                .ffs-v09g1-path {
                    background:
                        rgba(213,204,181,.92);

                    border:
                        1px solid rgba(95,88,76,.18);

                    box-shadow:
                        0 3px 7px rgba(0,0,0,.08);
                }

                .ffs-v09g1-path-horizontal {
                    width: 210px;
                    height: 18px;
                }

                .ffs-v09g1-path-vertical {
                    width: 18px;
                    height: 150px;
                }

                /* -------------------------------------------------
                   CROSSWALK
                   ------------------------------------------------- */

                .ffs-v09g1-crosswalk {
                    width: 58px;
                    height: 12px;

                    display: flex;
                    gap: 4px;

                    align-items: center;
                    justify-content: center;
                }

                .ffs-v09g1-crosswalk span {
                    display: block;

                    width: 8px;
                    height: 12px;

                    border-radius: 2px;

                    background:
                        rgba(244,239,222,.95);
                }

                .ffs-v09g1-crosswalk-horizontal {
                    transform:
                        translate(-50%, -50%);
                }

                .ffs-v09g1-crosswalk-vertical {
                    transform:
                        translate(-50%, -50%)
                        rotate(90deg);
                }

                /* -------------------------------------------------
                   ACTIVITY POINT
                   ------------------------------------------------- */

                .ffs-v09g1-activity {
                    width: 14px;
                    height: 14px;

                    border-radius: 50%;

                    background:
                        rgba(112,145,107,.86);

                    border:
                        2px solid rgba(255,255,255,.7);

                    box-shadow:
                        0 3px 7px rgba(0,0,0,.18);

                    transform:
                        translate(-50%, -50%);
                }

                .ffs-v09g1-activity::after {
                    content: "";

                    position: absolute;

                    width: 5px;
                    height: 5px;

                    left: 50%;
                    top: 50%;

                    transform:
                        translate(-50%, -50%);

                    border-radius: 50%;

                    background:
                        rgba(255,255,255,.75);
                }

                /* -------------------------------------------------
                   BLOCK LABEL
                   ------------------------------------------------- */

                .ffs-v09g1-label {
                    position: absolute;

                    transform:
                        translate(-50%, -50%);

                    padding:
                        4px 9px;

                    border-radius: 999px;

                    background:
                        rgba(30,36,40,.72);

                    color:
                        rgba(255,255,255,.92);

                    font-size: 9px;
                    font-weight: 700;

                    letter-spacing: .12em;

                    white-space: nowrap;

                    box-shadow:
                        0 3px 8px rgba(0,0,0,.16);
                }

                /* -------------------------------------------------
                   SMALL STREET FURNITURE
                   ------------------------------------------------- */

                .ffs-v09g1-planter {
                    width: 16px;
                    height: 16px;

                    border-radius: 4px;

                    background:
                        rgba(113,91,66,.85);

                    box-shadow:
                        0 3px 5px rgba(0,0,0,.13);

                    transform:
                        translate(-50%, -50%);
                }

                .ffs-v09g1-planter::after {
                    content: "";

                    position: absolute;

                    width: 12px;
                    height: 12px;

                    left: 2px;
                    top: -6px;

                    border-radius: 50%;

                    background:
                        rgba(76,119,73,.88);
                }
            `;

            document.head.appendChild(style);
        }

        // --------------------------------------------------------
        // PROJECT HELPER
        // --------------------------------------------------------

        const place = (element, x, y, z = 0) => {
            const point = this.worldToScreen(x, y, z);

            element.style.left = `${point.left}px`;
            element.style.top = `${point.top}px`;

            element.dataset.worldX = String(x);
            element.dataset.worldY = String(y);
            element.dataset.worldZ = String(z);
            element.dataset.depth = String(this.getDepth(x, y, z));

            return point;
        };

        // --------------------------------------------------------
        // CENTRAL PLAZA
        // --------------------------------------------------------

        const plaza = document.createElement("div");

        plaza.className =
            "ffs-v09g-zone ffs-v09g1-plaza";

        place(
            plaza,
            7,
            5.5,
            this.getGroundZ(7, 5.5) + 0.05
        );

        const plazaInner = document.createElement("div");

        plazaInner.className =
            "ffs-v09g1-plaza-inner";

        plaza.appendChild(plazaInner);

        block.appendChild(plaza);

        // --------------------------------------------------------
        // PEDESTRIAN PATHS
        // --------------------------------------------------------

        const paths = [
            {
                x: 7,
                y: 4.35,
                className:
                    "ffs-v09g1-path ffs-v09g1-path-horizontal"
            },
            {
                x: 7,
                y: 6.65,
                className:
                    "ffs-v09g1-path ffs-v09g1-path-horizontal"
            },
            {
                x: 5.55,
                y: 5.5,
                className:
                    "ffs-v09g1-path ffs-v09g1-path-vertical"
            },
            {
                x: 8.45,
                y: 5.5,
                className:
                    "ffs-v09g1-path ffs-v09g1-path-vertical"
            }
        ];

        paths.forEach((item) => {
            const path = document.createElement("div");

            path.className =
                `ffs-v09g1-zone ${item.className}`;

            place(
                path,
                item.x,
                item.y,
                this.getGroundZ(item.x, item.y) + 0.02
            );

            block.appendChild(path);
        });

        // --------------------------------------------------------
        // CROSSWALKS
        // --------------------------------------------------------

        const crosswalks = [
            {
                x: 5,
                y: 6,
                className:
                    "ffs-v09g1-crosswalk-horizontal"
            },
            {
                x: 9,
                y: 6,
                className:
                    "ffs-v09g1-crosswalk-horizontal"
            },
            {
                x: 7,
                y: 4.2,
                className:
                    "ffs-v09g1-crosswalk-vertical"
            },
            {
                x: 7,
                y: 7,
                className:
                    "ffs-v09g1-crosswalk-vertical"
            }
        ];

        crosswalks.forEach((item) => {
            const crosswalk = document.createElement("div");

            crosswalk.className =
                `ffs-v09g1-zone ffs-v09g1-crosswalk ${item.className}`;

            for (let i = 0; i < 5; i++) {
                const stripe = document.createElement("span");

                crosswalk.appendChild(stripe);
            }

            place(
                crosswalk,
                item.x,
                item.y,
                this.getGroundZ(item.x, item.y) + 0.04
            );

            block.appendChild(crosswalk);
        });

        // --------------------------------------------------------
        // ACTIVITY POINTS
        // --------------------------------------------------------

        const activities = [
            {
                x: 6.2,
                y: 5.2
            },
            {
                x: 7.2,
                y: 5.7
            },
            {
                x: 8,
                y: 5.1
            }
        ];

        activities.forEach((item) => {
            const activity = document.createElement("div");

            activity.className =
                "ffs-v09g-zone ffs-v09g1-activity";

            place(
                activity,
                item.x,
                item.y,
                this.getGroundZ(item.x, item.y) + 0.08
            );

            block.appendChild(activity);
        });

        // --------------------------------------------------------
        // PLANTERS
        // --------------------------------------------------------

        const planters = [
            {
                x: 6.25,
                y: 4.7
            },
            {
                x: 7.75,
                y: 4.7
            },
            {
                x: 6.25,
                y: 6.3
            },
            {
                x: 7.75,
                y: 6.3
            }
        ];

        planters.forEach((item) => {
            const planter = document.createElement("div");

            planter.className =
                "ffs-v09g1-zone ffs-v09g1-planter";

            place(
                planter,
                item.x,
                item.y,
                this.getGroundZ(item.x, item.y) + 0.1
            );

            block.appendChild(planter);
        });

        // --------------------------------------------------------
        // LABEL
        // --------------------------------------------------------

        const label = document.createElement("div");

        label.className =
            "ffs-v09g1-label";

        label.textContent =
            "CITY CENTER";

        place(
            label,
            7,
            5.5,
            this.getGroundZ(7, 5.5) + 0.35
        );

        label.style.marginTop = "-52px";

        block.appendChild(label);

        // --------------------------------------------------------
        // MOUNT
        // --------------------------------------------------------

        this.layers.props.appendChild(block);
    }

    // ============================================================
    // PROJECTION
    // ============================================================

    worldToScreen(x, y, z = 0) {
        const screenX =
            this.origin.x +
            (x - y) * this.halfTileWidth;

        const screenY =
            this.origin.y +
            (x + y) * this.halfTileHeight -
            z * this.heightUnit;

        return {
            left: screenX,
            top: screenY,
            x: screenX,
            y: screenY
        };
    }

    gridToScreen(x, y, z = 0) {
        return this.worldToScreen(x, y, z);
    }

    screenToWorld(screenX, screenY, z = 0) {
        const adjustedX =
            screenX - this.origin.x;

        const adjustedY =
            screenY -
            this.origin.y +
            z * this.heightUnit;

        const x =
            (
                adjustedY / this.halfTileHeight +
                adjustedX / this.halfTileWidth
            ) / 2;

        const y =
            (
                adjustedY / this.halfTileHeight -
                adjustedX / this.halfTileWidth
            ) / 2;

        return {
            x,
            y,
            z
        };
    }

    footprintToScreen(
        x,
        y,
        width,
        height,
        z = 0
    ) {
        return this.worldToScreen(
            x + width / 2,
            y + height / 2,
            z
        );
    }

    // ============================================================
    // DEPTH
    // ============================================================

    getDepth(x, y, z = 0) {
        return x + y + z;
    }

    getObjectDepth(object) {
        if (!object) {
            return 0;
        }

        const map =
            object.map ||
            object;

        const x =
            Number(map.x) || 0;

        const y =
            Number(map.y) || 0;

        const z =
            Number(map.z) || 0;

        return this.getDepth(x, y, z);
    }

    // ============================================================
    // TERRAIN ELEVATION
    // ============================================================

    getTerrainElevation(x, y, terrain = null) {
        terrain =
            terrain ||
            this.mapData?.terrain ||
            this.mapData;

        if (!terrain) {
            return 0;
        }

        const ix = Math.round(x);
        const iy = Math.round(y);

        // elevation[][]
        if (
            Array.isArray(terrain.elevation) &&
            Array.isArray(terrain.elevation[iy]) &&
            Number.isFinite(
                Number(terrain.elevation[iy][ix])
            )
        ) {
            return Number(terrain.elevation[iy][ix]);
        }

        // heights[][]
        if (
            Array.isArray(terrain.heights) &&
            Array.isArray(terrain.heights[iy]) &&
            Number.isFinite(
                Number(terrain.heights[iy][ix])
            )
        ) {
            return Number(terrain.heights[iy][ix]);
        }

        // tiles[]
        if (Array.isArray(terrain.tiles)) {
            const tile = terrain.tiles.find(
                (item) =>
                    Number(item?.x) === ix &&
                    Number(item?.y) === iy
            );

            if (tile) {
                if (Number.isFinite(Number(tile.z))) {
                    return Number(tile.z);
                }

                if (Number.isFinite(Number(tile.height))) {
                    return Number(tile.height);
                }
            }
        }

        // VISUAL FALLBACK
        const distance =
            Math.abs(ix - Math.floor(this.mapWidth / 2)) +
            Math.abs(iy - Math.floor(this.mapHeight / 2));

        if (distance <= 1) {
            return 2;
        }

        if (distance <= 3) {
            return 1;
        }

        return 0;
    }

    getGroundZ(x, y) {
        const ix = Math.max(
            0,
            Math.min(
                this.mapWidth - 1,
                Math.round(x)
            )
        );

        const iy = Math.max(
            0,
            Math.min(
                this.mapHeight - 1,
                Math.round(y)
            )
        );

        return this.getTerrainElevation(
            ix,
            iy
        );
    }

    getMaxTerrainElevation() {
        let max = 0;

        const terrain =
            this.mapData?.terrain ||
            this.mapData;

        if (!terrain) {
            return max;
        }

        if (Array.isArray(terrain.elevation)) {
            terrain.elevation.forEach((row) => {
                if (!Array.isArray(row)) {
                    return;
                }

                row.forEach((value) => {
                    const z = Number(value);

                    if (Number.isFinite(z)) {
                        max = Math.max(max, z);
                    }
                });
            });
        }

        if (Array.isArray(terrain.heights)) {
            terrain.heights.forEach((row) => {
                if (!Array.isArray(row)) {
                    return;
                }

                row.forEach((value) => {
                    const z = Number(value);

                    if (Number.isFinite(z)) {
                        max = Math.max(max, z);
                    }
                });
            });
        }

        return max;
    }

    getMapProjectionBounds() {
        const maxZ =
            this.getMaxTerrainElevation();

        const points = [
            this.worldToScreen(
                0,
                0,
                0
            ),

            this.worldToScreen(
                this.mapWidth,
                0,
                0
            ),

            this.worldToScreen(
                0,
                this.mapHeight,
                0
            ),

            this.worldToScreen(
                this.mapWidth,
                this.mapHeight,
                0
            ),

            this.worldToScreen(
                0,
                0,
                maxZ
            ),

            this.worldToScreen(
                this.mapWidth,
                0,
                maxZ
            ),

            this.worldToScreen(
                0,
                this.mapHeight,
                maxZ
            ),

            this.worldToScreen(
                this.mapWidth,
                this.mapHeight,
                maxZ
            )
        ];

        const xs =
            points.map((point) => point.x);

        const ys =
            points.map((point) => point.y);

        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys)
        };
    }

    // ============================================================
    // ZOOM
    // ============================================================

    createZoomControls() {
        const controls =
            document.createElement("div");

        controls.className =
            "ffs-map-zoom-controls";

        const minus =
            document.createElement("button");

        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute(
            "aria-label",
            "Zoom out"
        );

        const value =
            document.createElement("button");

        value.type = "button";
        value.className =
            "ffs-map-zoom-value";

        value.textContent =
            this.getZoomLabel();

        value.setAttribute(
            "aria-label",
            "Reset zoom"
        );

        const plus =
            document.createElement("button");

        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute(
            "aria-label",
            "Zoom in"
        );

        minus.addEventListener(
            "click",
            () => {
                this.setZoom(
                    this.zoom -
                    this.zoomStep
                );
            }
        );

        value.addEventListener(
            "click",
            () => {
                this.setZoom(1);
            }
        );

        plus.addEventListener(
            "click",
            () => {
                this.setZoom(
                    this.zoom +
                    this.zoomStep
                );
            }
        );

        controls.appendChild(minus);
        controls.appendChild(value);
        controls.appendChild(plus);

        this.renderer.appendChild(controls);

        this.zoomControls = {
            root: controls,
            minus,
            value,
            plus
        };
    }

    setZoom(value) {
        const next =
            Math.max(
                this.minZoom,
                Math.min(
                    this.maxZoom,
                    Number(value)
                )
            );

        this.zoom =
            Math.round(next * 10) / 10;

        this.applyZoom();
    }

    getZoomLabel() {
        return `${Math.round(this.zoom * 100)}%`;
    }

    applyZoom() {
        if (!this.content) {
            return;
        }

        this.content.style.transform =
            `translate(${this.contentOffset.x}px, ${this.contentOffset.y}px) scale(${this.zoom})`;

        if (this.zoomControls?.value) {
            this.zoomControls.value.textContent =
                this.getZoomLabel();
        }
    }

    // ============================================================
    // LAYOUT
    // ============================================================

    updateMapLayout() {
        if (!this.renderer || !this.content) {
            return;
        }

        const bounds =
            this.getMapProjectionBounds();

        const paddingX = 220;
        const paddingY = 220;

        const projectedWidth =
            bounds.maxX -
            bounds.minX;

        const projectedHeight =
            bounds.maxY -
            bounds.minY;

        const width =
            Math.max(
                1000,
                projectedWidth +
                paddingX * 2
            );

        const height =
            Math.max(
                700,
                projectedHeight +
                paddingY * 2
            );

        this.content.style.width =
            `${width}px`;

        this.content.style.height =
            `${height}px`;

        const centerX =
            this.worldToScreen(
                this.mapWidth / 2,
                this.mapHeight / 2,
                this.getMaxTerrainElevation() / 2
            ).x;

        const centerY =
            this.worldToScreen(
                this.mapWidth / 2,
                this.mapHeight / 2,
                this.getMaxTerrainElevation() / 2
            ).y;

        this.origin.x =
            width / 2 -
            centerX;

        this.origin.y =
            height / 2 -
            centerY;

        this.contentOffset.x =
            this.renderer.clientWidth / 2 -
            width / 2;

        this.contentOffset.y =
            this.renderer.clientHeight / 2 -
            height / 2;

        this.applyZoom();
    }

    // ============================================================
    // TERRAIN
    // ============================================================

    renderTerrain(mapData) {
        const terrainLayer =
            this.layers.terrain;

        if (!terrainLayer) {
            return;
        }

        const terrain =
            mapData.terrain ||
            mapData;

        const tiles = [];

        for (
            let y = 0;
            y < this.mapHeight;
            y++
        ) {
            for (
                let x = 0;
                x < this.mapWidth;
                x++
            ) {
                const z =
                    this.getTerrainElevation(
                        x,
                        y,
                        terrain
                    );

                const point =
                    this.worldToScreen(
                        x,
                        y,
                        z
                    );

                const tile =
                    document.createElement("div");

                tile.className =
                    "ffs-terrain-tile";

                const variation =
                    (
                        x * 7 +
                        y * 13
                    ) % 4;

                tile.classList.add(
                    `terrain-variation-${variation}`
                );

                tile.style.left =
                    `${point.left}px`;

                tile.style.top =
                    `${point.top}px`;

                tile.style.setProperty(
                    "--terrain-z",
                    z
                );

                tile.style.setProperty(
                    "--terrain-height",
                    z * this.heightUnit
                );

                tile.dataset.worldX =
                    String(x);

                tile.dataset.worldY =
                    String(y);

                tile.dataset.worldZ =
                    String(z);

                tile.dataset.depth =
                    String(
                        this.getDepth(
                            x,
                            y,
                            z
                        )
                    );

                tile.dataset.elevation =
                    String(z);

                if (z > 0) {
                    tile.classList.add(
                        "terrain-elevated"
                    );

                    const volume =
                        document.createElement("div");

                    volume.className =
                        "ffs-v09g-terrain-volume";

                    volume.style.setProperty(
                        "--volume-height",
                        `${z * this.heightUnit}px`
                    );

                    const left =
                        document.createElement("div");

                    left.className =
                        "ffs-v09g-terrain-side-left";

                    const right =
                        document.createElement("div");

                    right.className =
                        "ffs-v09g-terrain-side-right";

                    const shadow =
                        document.createElement("div");

                    shadow.className =
                        "ffs-v09g-terrain-shadow";

                    volume.appendChild(left);
                    volume.appendChild(right);
                    volume.appendChild(shadow);

                    tile.appendChild(volume);
                }

                if (z >= 2) {
                    tile.classList.add(
                        "terrain-high"
                    );
                }

                tiles.push(tile);
            }
        }

        tiles
            .sort(
                (a, b) =>
                    Number(a.dataset.depth) -
                    Number(b.dataset.depth)
            )
            .forEach((tile) => {
                terrainLayer.appendChild(tile);
            });
    }

    // ============================================================
    // ROADS
    // ============================================================

    renderRoads(mapData) {
        const roadsLayer =
            this.layers.roads;

        const sidewalksLayer =
            this.layers.sidewalks;

        if (!roadsLayer) {
            return;
        }

        const roads =
            Array.isArray(mapData.roads)
                ? mapData.roads
                : [];

        roads.forEach((road) => {
            const map =
                road.map ||
                road;

            const x =
                Number(map.x) || 0;

            const y =
                Number(map.y) || 0;

            const width =
                Math.max(
                    1,
                    Number(map.width) || 1
                );

            const direction =
                map.direction ||
                "horizontal";

            for (
                let i = 0;
                i < width;
                i++
            ) {
                const tileX =
                    direction === "vertical"
                        ? x
                        : x + i;

                const tileY =
                    direction === "vertical"
                        ? y + i
                        : y;

                const z =
                    Number.isFinite(
                        Number(map.z)
                    )
                        ? Number(map.z)
                        : this.getGroundZ(
                            tileX,
                            tileY
                        );

                const point =
                    this.worldToScreen(
                        tileX,
                        tileY,
                        z
                    );

                const sidewalk =
                    document.createElement("div");

                sidewalk.className =
                    "ffs-sidewalk";

                sidewalk.classList.add(
                    `road-${direction}`
                );

                sidewalk.style.left =
                    `${point.left}px`;

                sidewalk.style.top =
                    `${point.top}px`;

                sidewalk.dataset.worldX =
                    String(tileX);

                sidewalk.dataset.worldY =
                    String(tileY);

                sidewalk.dataset.worldZ =
                    String(z);

                if (sidewalksLayer) {
                    sidewalksLayer.appendChild(
                        sidewalk
                    );
                }

                const roadElement =
                    document.createElement("div");

                roadElement.className =
                    "ffs-road";

                roadElement.classList.add(
                    `road-${direction}`
                );

                roadElement.style.left =
                    `${point.left}px`;

                roadElement.style.top =
                    `${point.top}px`;

                roadElement.dataset.worldX =
                    String(tileX);

                roadElement.dataset.worldY =
                    String(tileY);

                roadElement.dataset.worldZ =
                    String(z);

                const marking =
                    document.createElement("div");

                marking.className =
                    "ffs-road-marking";

                roadElement.appendChild(
                    marking
                );

                roadsLayer.appendChild(
                    roadElement
                );
            }
        });
    }

    // ============================================================
    // BUILDINGS
    // ============================================================

    renderBuildings(mapData) {
        const buildings =
            Array.isArray(mapData.buildings)
                ? mapData.buildings
                : [];

        buildings
            .slice()
            .sort(
                (a, b) =>
                    this.getObjectDepth(a) -
                    this.getObjectDepth(b)
            )
            .forEach((building) => {
                this.createBuilding(building);
            });
    }

    createBuilding(building) {
        const layer =
            this.layers.buildings;

        if (!layer) {
            return;
        }

        const map =
            building.map ||
            building;

        const x =
            Number(map.x) || 0;

        const y =
            Number(map.y) || 0;

        const width =
            Math.max(
                1,
                Number(map.width) || 1
            );

        const height =
            Math.max(
                1,
                Number(map.height) || 1
            );

        const z =
            Number.isFinite(
                Number(map.z)
            )
                ? Number(map.z)
                : this.getGroundZ(
                    x + width / 2,
                    y + height / 2
                );

        const point =
            this.footprintToScreen(
                x,
                y,
                width,
                height,
                z
            );

        const type =
            this.getBuildingType(
                building
            );

        const element =
            document.createElement("div");

        element.className =
            `ffs-building building-${type}`;

        const pixelWidth =
            width *
            this.tileWidth;

        const footprintHeight =
            height *
            this.tileHeight;

        const visualHeight =
            this.getBuildingVisualHeight(
                type,
                pixelWidth,
                footprintHeight
            );

        element.style.left =
            `${point.left}px`;

        element.style.top =
            `${point.top}px`;

        element.style.setProperty(
            "--building-width",
            `${pixelWidth}px`
        );

        element.style.setProperty(
            "--building-height",
            `${visualHeight}px`
        );

        element.style.setProperty(
            "--building-footprint-height",
            `${footprintHeight}px`
        );

        element.dataset.worldX =
            String(x);

        element.dataset.worldY =
            String(y);

        element.dataset.worldZ =
            String(z);

        element.dataset.depth =
            String(
                this.getDepth(
                    x,
                    y,
                    z
                )
            );

        const shadow =
            document.createElement("div");

        shadow.className =
            "ffs-building-shadow";

        element.appendChild(
            shadow
        );

        const footprint =
            document.createElement("div");

        footprint.className =
            "ffs-building-footprint";

        element.appendChild(
            footprint
        );

        const side =
            document.createElement("div");

        side.className =
            "ffs-building-side";

        element.appendChild(
            side
        );

        const body =
            document.createElement("div");

        body.className =
            "ffs-building-body";

        element.appendChild(
            body
        );

        const roof =
            document.createElement("div");

        roof.className =
            "ffs-building-roof";

        element.appendChild(
            roof
        );

        if (type !== "park") {
            this.createWindows(
                element,
                type,
                width,
                visualHeight
            );
        }

        if (
            type === "residential" ||
            type === "commercial"
        ) {
            const door =
                document.createElement("div");

            door.className =
                "ffs-building-door";

            element.appendChild(
                door
            );
        }

        const label =
            document.createElement("div");

        label.className =
            "ffs-building-label";

        label.textContent =
            building.name ||
            "Building";

        element.appendChild(
            label
        );

        layer.appendChild(
            element
        );
    }

    getBuildingVisualHeight(
        type,
        pixelWidth,
        footprintHeight
    ) {
        switch (type) {
            case "cbd":
                return 250;

            case "commercial":
                return 150;

            case "concrete":
                return 145;

            case "park":
                return footprintHeight + 12;

            default:
                return 135;
        }
    }

    getBuildingType(building) {
        const type =
            String(
                building?.type || ""
            ).toLowerCase();

        const id =
            String(
                building?.id || ""
            ).toLowerCase();

        const name =
            String(
                building?.name || ""
            ).toLowerCase();

        const district =
            String(
                building?.district || ""
            ).toLowerCase();

        if (
            type === "park" ||
            id.includes("park") ||
            name.includes("park")
        ) {
            return "park";
        }

        if (
            district === "cbd" ||
            id.includes("cbd") ||
            name.includes("tower")
        ) {
            return "cbd";
        }

        if (
            district === "commercial" ||
            type === "shop" ||
            id.includes("shop")
        ) {
            return "commercial";
        }

        if (
            name.includes("concrete")
        ) {
            return "concrete";
        }

        return "residential";
    }

    createWindows(
        building,
        type,
        width,
        visualHeight
    ) {
        let rows = 2;

        if (type === "cbd") {
            rows = 5;
        } else if (
            type === "commercial"
        ) {
            rows = 3;
        }

        const columns =
            Math.max(
                2,
                Math.round(width)
            );

        for (
            let row = 0;
            row < rows;
            row++
        ) {
            for (
                let column = 0;
                column < columns;
                column++
            ) {
                const window =
                    document.createElement("div");

                window.className =
                    "ffs-window";

                window.style.setProperty(
                    "--window-row",
                    row
                );

                window.style.setProperty(
                    "--window-column",
                    column
                );

                window.style.setProperty(
                    "--window-rows",
                    rows
                );

                window.style.setProperty(
                    "--window-columns",
                    columns
                );

                building.appendChild(
                    window
                );
            }
        }
    }

    // ============================================================
    // TREES
    // ============================================================

    renderTrees(mapData) {
        const layer =
            this.layers.trees;

        if (!layer) {
            return;
        }

        const positions = [
            [1, 1],
            [2, 8],
            [5, 2],
            [7, 1],
            [9, 2],
            [10, 4],
            [13, 2],
            [14, 5],
            [2, 10],
            [5, 10],
            [9, 10],
            [13, 10]
        ];

        positions.forEach(
            ([x, y], index) => {
                const z =
                    this.getGroundZ(
                        x,
                        y
                    );

                const point =
                    this.worldToScreen(
                        x,
                        y,
                        z
                    );

                const tree =
                    document.createElement("div");

                tree.className =
                    "ffs-tree";

                tree.classList.add(
                    index % 2 === 0
                        ? "tree-large"
                        : "tree-small"
                );

                tree.style.left =
                    `${point.left}px`;

                tree.style.top =
                    `${point.top}px`;

                tree.dataset.worldX =
                    String(x);

                tree.dataset.worldY =
                    String(y);

                tree.dataset.worldZ =
                    String(z);

                tree.dataset.depth =
                    String(
                        this.getDepth(
                            x,
                            y,
                            z
                        )
                    );

                tree.dataset.index =
                    String(index);

                layer.appendChild(
                    tree
                );
            }
        );
    }

    // ============================================================
    // PROPS
    // ============================================================

    renderProps(mapData) {
        const layer =
            this.layers.props;

        if (!layer) {
            return;
        }

        const props = [
            {
                x: 4,
                y: 5,
                type: "lamp"
            },
            {
                x: 6,
                y: 6,
                type: "bench"
            },
            {
                x: 9,
                y: 5,
                type: "lamp"
            },
            {
                x: 12,
                y: 5,
                type: "bin"
            },
            {
                x: 6,
                y: 9,
                type: "lamp"
            },
            {
                x: 10,
                y: 8,
                type: "bench"
            }
        ];

        props.forEach(
            (item) => {
                const z =
                    this.getGroundZ(
                        item.x,
                        item.y
                    );

                const point =
                    this.worldToScreen(
                        item.x,
                        item.y,
                        z
                    );

                const element =
                    document.createElement("div");

                element.className =
                    `ffs-prop prop-${item.type}`;

                element.style.left =
                    `${point.left}px`;

                element.style.top =
                    `${point.top}px`;

                element.dataset.worldX =
                    String(item.x);

                element.dataset.worldY =
                    String(item.y);

                element.dataset.worldZ =
                    String(z);

                element.dataset.depth =
                    String(
                        this.getDepth(
                            item.x,
                            item.y,
                            z
                        )
                    );

                layer.appendChild(
                    element
                );
            }
        );
    }

    // ============================================================
    // VEHICLES
    // ============================================================

    renderVehicles(mapData) {
        const layer =
            this.layers.vehicles;

        if (!layer) {
            return;
        }

        this.vehicles = [];

        const vehicles = [
            {
                x: 3,
                y: 6,
                type: "sedan",
                direction: "east"
            },
            {
                x: 7,
                y: 6,
                type: "sedan",
                direction: "east"
            },
            {
                x: 11,
                y: 6,
                type: "wagon",
                direction: "west"
            },
            {
                x: 14,
                y: 6,
                type: "sedan",
                direction: "west"
            }
        ];

        vehicles.forEach(
            (item, index) => {
                const vehicle =
                    document.createElement("div");

                vehicle.className =
                    "ffs-v09g-vehicle";

                vehicle.dataset.type =
                    item.type;

                vehicle.dataset.direction =
                    item.direction;

                const shadow =
                    document.createElement("div");

                shadow.className =
                    "ffs-v09g-vehicle-shadow";

                const body =
                    document.createElement("div");

                body.className =
                    "ffs-v09g-vehicle-body";

                const window =
                    document.createElement("div");

                window.className =
                    "ffs-v09g-vehicle-window";

                const wheelLeft =
                    document.createElement("div");

                wheelLeft.className =
                    "ffs-v09g-vehicle-wheel ffs-v09g-vehicle-wheel-left";

                const wheelRight =
                    document.createElement("div");

                wheelRight.className =
                    "ffs-v09g-vehicle-wheel ffs-v09g-vehicle-wheel-right";

                vehicle.appendChild(
                    shadow
                );

                vehicle.appendChild(
                    body
                );

                vehicle.appendChild(
                    window
                );

                vehicle.appendChild(
                    wheelLeft
                );

                vehicle.appendChild(
                    wheelRight
                );

                layer.appendChild(
                    vehicle
                );

                this.vehicles.push({
                    element: vehicle,

                    startX: item.x,
                    startY: item.y,

                    route: item.direction,

                    index,

                    speed:
                        0.0015 +
                        index * 0.00025
                });
            }
        );
    }

    // ============================================================
    // NPC
    // ============================================================

    renderNPCs(mapData) {
        const layer =
            this.layers.npcs;

        if (!layer) {
            return;
        }

        this.npcs = [];

        const npcs = [
            {
                x: 4,
                y: 4,
                endX: 8,
                endY: 5
            },
            {
                x: 7,
                y: 7,
                endX: 5,
                endY: 4
            },
            {
                x: 9,
                y: 3,
                endX: 11,
                endY: 5
            },
            {
                x: 3,
                y: 7,
                endX: 5,
                endY: 8
            }
        ];

        npcs.forEach(
            (item, index) => {
                const npc =
                    document.createElement("div");

                npc.className =
                    "ffs-v09g-npc";

                const shadow =
                    document.createElement("div");

                shadow.className =
                    "ffs-v09g-npc-shadow";

                const head =
                    document.createElement("div");

                head.className =
                    "ffs-v09g-npc-head";

                const body =
                    document.createElement("div");

                body.className =
                    "ffs-v09g-npc-body";

                const legLeft =
                    document.createElement("div");

                legLeft.className =
                    "ffs-v09g-npc-leg ffs-v09g-npc-leg-left";

                const legRight =
                    document.createElement("div");

                legRight.className =
                    "ffs-v09g-npc-leg ffs-v09g-npc-leg-right";

                npc.appendChild(
                    shadow
                );

                npc.appendChild(
                    head
                );

                npc.appendChild(
                    body
                );

                npc.appendChild(
                    legLeft
                );

                npc.appendChild(
                    legRight
                );

                layer.appendChild(
                    npc
                );

                // v0.9-G.1
                // Faster pedestrian movement
                this.npcs.push({
                    element: npc,

                    startX: item.x,
                    startY: item.y,

                    endX: item.endX,
                    endY: item.endY,

                    index,

                    speed:
                        0.00065 +
                        index * 0.00008
                });
            }
        );
    }

    // ============================================================
    // SIGNS
    // ============================================================

    renderSigns(mapData) {
        const layer =
            this.layers.signs;

        if (!layer) {
            return;
        }

        const signs = [
            {
                x: 4,
                y: 6,
                text: "SHOP"
            },
            {
                x: 8,
                y: 4,
                text: "FFS TOWER"
            },
            {
                x: 10,
                y: 6,
                text: "STORE"
            },
            {
                x: 8,
                y: 8,
                text: "OFFICE"
            }
        ];

        signs.forEach(
            (item) => {
                const z =
                    this.getGroundZ(
                        item.x,
                        item.y
                    );

                const point =
                    this.worldToScreen(
                        item.x,
                        item.y,
                        z
                    );

                const sign =
                    document.createElement("div");

                sign.className =
                    "ffs-sign";

                sign.textContent =
                    item.text;

                sign.style.left =
                    `${point.left}px`;

                sign.style.top =
                    `${point.top}px`;

                sign.dataset.worldX =
                    String(item.x);

                sign.dataset.worldY =
                    String(item.y);

                sign.dataset.worldZ =
                    String(z);

                sign.dataset.depth =
                    String(
                        this.getDepth(
                            item.x,
                            item.y,
                            z
                        )
                    );

                layer.appendChild(
                    sign
                );
            }
        );
    }

    // ============================================================
    // DISTRICT LABELS
    // ============================================================

    renderDistrictLabels(mapData) {
        const layer =
            this.layers.labels;

        if (!layer) {
            return;
        }

        const labels = [
            {
                x: 3,
                y: 2,
                text: "RESIDENTIAL"
            },
            {
                x: 6,
                y: 1,
                text: "CENTRAL PARK"
            },
            {
                x: 4,
                y: 5,
                text: "COMMERCIAL"
            },
            {
                x: 8,
                y: 3,
                text: "CBD"
            }
        ];

        labels.forEach(
            (item) => {
                const z =
                    this.getGroundZ(
                        item.x,
                        item.y
                    );

                const point =
                    this.worldToScreen(
                        item.x,
                        item.y,
                        z
                    );

                const label =
                    document.createElement("div");

                label.className =
                    "ffs-district-label";

                label.textContent =
                    item.text;

                label.style.left =
                    `${point.left}px`;

                label.style.top =
                    `${point.top}px`;

                label.dataset.worldX =
                    String(item.x);

                label.dataset.worldY =
                    String(item.y);

                label.dataset.worldZ =
                    String(z);

                label.dataset.depth =
                    String(
                        this.getDepth(
                            item.x,
                            item.y,
                            z
                        )
                    );

                layer.appendChild(
                    label
                );
            }
        );
    }

    // ============================================================
    // ENVIRONMENT
    // ============================================================

    renderEnvironment(mapData) {
        const layer =
            this.layers.environment;

        if (!layer) {
            return;
        }

        this.ambientObjects = [];

        const environment =
            mapData.environment ||
            {};

        const environmentRoot =
            document.createElement("div");

        environmentRoot.className =
            "ffs-environment";

        if (environment.weather) {
            environmentRoot.dataset.weather =
                environment.weather;
        }

        if (environment.lighting) {
            environmentRoot.dataset.lighting =
                environment.lighting;
        }

        // --------------------------------------------------------
        // CLOUDS
        // --------------------------------------------------------

        const clouds = [
            {
                x: 250,
                y: 70,
                speed: 0.015
            },
            {
                x: 620,
                y: 120,
                speed: 0.009
            }
        ];

        clouds.forEach(
            (item, index) => {
                const cloud =
                    document.createElement("div");

                cloud.className =
                    "ffs-v09g-cloud";

                cloud.style.left =
                    `${item.x}px`;

                cloud.style.top =
                    `${item.y}px`;

                environmentRoot.appendChild(
                    cloud
                );

                this.ambientObjects.push({
                    element: cloud,
                    type: "cloud",
                    baseX: item.x,
                    speed: item.speed,
                    range: 260,
                    index
                });
            }
        );

        // --------------------------------------------------------
        // BIRDS
        // --------------------------------------------------------

        const birds = [
            {
                x: 320,
                y: 150,
                speed: 0.025
            },
            {
                x: 470,
                y: 185,
                speed: 0.033
            },
            {
                x: 620,
                y: 220,
                speed: 0.041
            }
        ];

        birds.forEach(
            (item, index) => {
                const bird =
                    document.createElement("div");

                bird.className =
                    "ffs-v09g-bird";

                bird.style.left =
                    `${item.x}px`;

                bird.style.top =
                    `${item.y}px`;

                environmentRoot.appendChild(
                    bird
                );

                this.ambientObjects.push({
                    element: bird,
                    type: "bird",
                    baseX: item.x,
                    speed: item.speed,
                    range: 260,
                    index
                });
            }
        );

        layer.appendChild(
            environmentRoot
        );
    }

    // ============================================================
    // CITY TITLE
    // ============================================================

    renderCityTitle(mapData) {
        const layer =
            this.layers.labels;

        if (!layer) {
            return;
        }

        const title =
            document.createElement("div");

        title.className =
            "ffs-city-title";

        title.innerHTML = `
            <strong>FFS CITY</strong>
            <span>1996</span>
            <small>LIVING WORLD</small>
        `;

        layer.appendChild(
            title
        );
    }

    // ============================================================
    // ANIMATION
    // ============================================================

    startAnimation() {
        if (this.prefersReducedMotion) {
            this.updateAnimatedObjects(0);
            return;
        }

        const animate = (timestamp) => {
            this.animationTime =
                timestamp;

            this.updateAnimatedObjects(
                timestamp
            );

            this.animationFrame =
                window.requestAnimationFrame(
                    animate
                );
        };

        this.animationFrame =
            window.requestAnimationFrame(
                animate
            );
    }

    stopAnimation() {
        if (this.animationFrame) {
            window.cancelAnimationFrame(
                this.animationFrame
            );
        }

        this.animationFrame = null;

        this.animationTime = 0;

        this.animatedObjects = [];

        this.npcs = [];
        this.vehicles = [];
        this.ambientObjects = [];
    }

    updateAnimatedObjects(timestamp) {
        const time =
            Number(timestamp) || 0;

        // ========================================================
        // VEHICLES
        // ========================================================

        this.vehicles.forEach(
            (vehicle) => {
                const cycle =
                    time *
                    vehicle.speed /
                    1000 +
                    vehicle.index *
                    0.22;

                const progress =
                    cycle % 1;

                let x;
                let y;

                if (
                    vehicle.route === "west"
                ) {
                    x =
                        14 -
                        progress * 11;
                } else {
                    x =
                        3 +
                        progress * 11;
                }

                y =
                    6 +
                    Math.sin(
                        progress *
                        Math.PI *
                        2
                    ) *
                    0.025;

                const z =
                    this.getGroundZ(
                        x,
                        y
                    );

                const point =
                    this.worldToScreen(
                        x,
                        y,
                        z + 0.08
                    );

                vehicle.element.style.left =
                    `${point.left}px`;

                vehicle.element.style.top =
                    `${point.top}px`;

                vehicle.element.dataset.worldX =
                    String(x);

                vehicle.element.dataset.worldY =
                    String(y);

                vehicle.element.dataset.worldZ =
                    String(z);

                vehicle.element.dataset.depth =
                    String(
                        this.getDepth(
                            x,
                            y,
                            z
                        )
                    );

                if (
                    vehicle.route === "west"
                ) {
                    vehicle.element.style.transform =
                        "scaleX(-1)";
                } else {
                    vehicle.element.style.transform =
                        "scaleX(1)";
                }
            }
        );

        // ========================================================
        // NPCS
        // ========================================================

        this.npcs.forEach(
            (npc) => {
                const cycle =
                    time *
                    npc.speed /
                    1000 +
                    npc.index *
                    0.27;

                const progress =
                    (
                        Math.sin(
                            cycle *
                            Math.PI *
                            2
                        ) +
                        1
                    ) / 2;

                const x =
                    npc.startX +
                    (
                        npc.endX -
                        npc.startX
                    ) *
                    progress;

                const y =
                    npc.startY +
                    (
                        npc.endY -
                        npc.startY
                    ) *
                    progress;

                const z =
                    this.getGroundZ(
                        x,
                        y
                    );

                const point =
                    this.worldToScreen(
                        x,
                        y,
                        z + 0.1
                    );

                npc.element.style.left =
                    `${point.left}px`;

                npc.element.style.top =
                    `${point.top}px`;

                const bob =
                    Math.sin(
                        time *
                        0.012 +
                        npc.index
                    ) *
                    1.5;

                npc.element.style.transform =
                    `translateY(${bob}px)`;

                npc.element.dataset.worldX =
                    String(x);

                npc.element.dataset.worldY =
                    String(y);

                npc.element.dataset.worldZ =
                    String(z);

                npc.element.dataset.depth =
                    String(
                        this.getDepth(
                            x,
                            y,
                            z
                        )
                    );
            }
        );

        // ========================================================
        // TREES
        // ========================================================

        const trees =
            this.layers.trees
                ? Array.from(
                    this.layers.trees.children
                )
                : [];

        trees.forEach(
            (tree, index) => {
                const sway =
                    Math.sin(
                        time *
                        0.0015 +
                        index
                    ) *
                    1.2;

                tree.style.transform =
                    `translateX(${sway}px)`;
            }
        );

        // ========================================================
        // AMBIENT
        // ========================================================

        this.ambientObjects.forEach(
            (item) => {
                const offset =
                    (
                        time *
                        item.speed
                    ) %
                    item.range;

                const x =
                    item.baseX +
                    offset;

                item.element.style.transform =
                    `translateX(${x - item.baseX}px)`;
            }
        );
    }
        }
