// ============================================================
// FFS - MAP RENDERER v0.9-G
// LIVING CITY PROTOTYPE
//
// Based on:
// - Visual Proof v0.7
// - True Isometric Projection v0.8
// - Terrain + Z / Elevation Proof v0.9-A
//
// v0.9-G EXPERIMENT:
// - Terrain elevation
// - Terrain visible volume / sides
// - Elevation-aware roads
// - 3D-style buildings
// - Trees + props
// - Animated vehicles
// - Animated NPCs
// - Living-world ambient motion
// - Lightweight procedural visuals
//
// IMPORTANT:
// - style.css is intentionally preserved.
// - This is a visual prototype, NOT the final simulation.
// - NPC/vehicle movement is currently visual/procedural.
// ============================================================


export class MapRenderer {

    constructor(containerId) {

        this.container =
            document.getElementById(containerId);

        if (!this.container) {

            throw new Error(
                `[MapRenderer] Container "${containerId}" was not found.`
            );

        }


        // ====================================================
        // TRUE ISOMETRIC GEOMETRY
        // ====================================================

        this.tileWidth = 72;
        this.tileHeight = 36;

        this.halfTileWidth =
            this.tileWidth / 2;

        this.halfTileHeight =
            this.tileHeight / 2;


        // ====================================================
        // WORLD ELEVATION
        // ====================================================

        this.heightUnit = 12;


        // ====================================================
        // BUILDING
        // ====================================================

        this.buildingDepth = 52;


        // ====================================================
        // ZOOM
        // ====================================================

        this.zoom = 1;

        this.minZoom = 0.5;

        this.maxZoom = 1.5;

        this.zoomStep = 0.1;


        // ====================================================
        // RENDERING LAYERS
        // ====================================================

        this.layers = {};


        // ====================================================
        // MAP REFERENCES
        // ====================================================

        this.mapData = null;

        this.renderer = null;

        this.world = null;

        this.content = null;


        // ====================================================
        // MAP DIMENSIONS
        // ====================================================

        this.mapWidth = 12;

        this.mapHeight = 9;


        // ====================================================
        // PROJECTION ORIGIN
        // ====================================================

        this.projectionOrigin = {
            x: 0,
            y: 0
        };


        // ====================================================
        // CONTENT OFFSET
        // ====================================================

        this.contentOffset = {
            x: 0,
            y: 0
        };


        // ====================================================
        // LIVING WORLD
        // ====================================================

        this.animationFrame = null;

        this.animationTime = 0;

        this.animatedObjects = [];

        this.npcs = [];

        this.vehicles = [];

        this.ambientObjects = [];

        this.prefersReducedMotion =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        // ====================================================
        // BOUNDARY
        // ====================================================

        this.handleResize =
            () => this.updateMapLayout();

        window.addEventListener(
            "resize",
            this.handleResize
        );

    }


    // ========================================================
    // MAIN RENDER
    // ========================================================

    render(mapData) {

        if (!mapData) {

            throw new Error(
                "[MapRenderer] Map data is required."
            );

        }


        this.stopAnimation();


        this.mapData =
            mapData;


        const terrain =
            mapData.terrain ?? {};


        this.mapWidth =
            terrain.width ?? 12;


        this.mapHeight =
            terrain.height ?? 9;


        // ====================================================
        // CLEAR CONTAINER
        // ====================================================

        this.container.innerHTML = "";


        // ====================================================
        // INTERNAL VISUAL SUPPORT
        // ====================================================

        this.injectPrototypeStyles();


        // ====================================================
        // MAP VIEWPORT
        // ====================================================

        this.renderer =
            document.createElement("div");

        this.renderer.className =
            "ffs-map-renderer";


        // ====================================================
        // MAP WORLD
        // ====================================================

        this.world =
            document.createElement("div");

        this.world.className =
            "ffs-map-world";


        // ====================================================
        // MAP CONTENT
        // ====================================================

        this.content =
            document.createElement("div");

        this.content.className =
            "ffs-map-content";


        // ====================================================
        // LAYERS
        // ====================================================

        this.layers = {

            terrain:
                this.createLayer("terrain"),

            roads:
                this.createLayer("roads"),

            sidewalks:
                this.createLayer("sidewalks"),

            buildings:
                this.createLayer("buildings"),

            trees:
                this.createLayer("trees"),

            props:
                this.createLayer("props"),

            vehicles:
                this.createLayer("vehicles"),

            npcs:
                this.createLayer("npcs"),

            signs:
                this.createLayer("signs"),

            labels:
                this.createLayer("labels"),

            environment:
                this.createLayer("environment")

        };


        Object.values(
            this.layers
        ).forEach(
            layer =>
                this.content.appendChild(layer)
        );


        this.world.appendChild(
            this.content
        );


        this.renderer.appendChild(
            this.world
        );


        // ====================================================
        // ZOOM CONTROLS
        // ====================================================

        this.createZoomControls();


        // ====================================================
        // APPEND MAP
        // ====================================================

        this.container.appendChild(
            this.renderer
        );


        // ====================================================
        // RENDER WORLD
        // ====================================================

        this.renderTerrain(mapData);

        this.renderRoads(mapData);

        this.renderBuildings(mapData);

        this.renderTrees(mapData);

        this.renderProps(mapData);

        this.renderVehicles(mapData);

        this.renderNPCs(mapData);

        this.renderSigns(mapData);

        this.renderDistrictLabels(mapData);

        this.renderEnvironment(mapData);

        this.renderCityTitle(mapData);


        // ====================================================
        // CENTER MAP
        // ====================================================

        this.updateMapLayout();

        this.applyZoom();


        // ====================================================
        // START LIVING WORLD
        // ====================================================

        this.startAnimation();

    }


    // ========================================================
    // INTERNAL PROTOTYPE STYLES
    //
    // Kept inside renderer so style.css remains untouched.
    // ========================================================

    injectPrototypeStyles() {

        const styleId =
            "ffs-v09g-prototype-styles";


        if (
            document.getElementById(styleId)
        ) {

            return;

        }


        const style =
            document.createElement("style");


        style.id =
            styleId;


        style.textContent = `

            .ffs-v09g-terrain-volume {
                position: absolute;
                left: 0;
                top: 0;
                width: 72px;
                height: 36px;
                pointer-events: none;
                z-index: -1;
            }

            .ffs-v09g-terrain-side {
                position: absolute;
                pointer-events: none;
                opacity: 0.95;
            }

            .ffs-v09g-terrain-side-left {
                left: 0;
                top: 18px;
                width: 36px;
                height: var(--volume-height);
                background:
                    linear-gradient(
                        to bottom,
                        rgba(70, 75, 65, 0.9),
                        rgba(45, 48, 42, 0.95)
                    );
                clip-path: polygon(
                    0 0,
                    100% 0,
                    100% 100%,
                    0 100%
                );
                transform-origin: top;
                transform:
                    skewY(26.5deg);
            }

            .ffs-v09g-terrain-side-right {
                right: 0;
                top: 18px;
                width: 36px;
                height: var(--volume-height);
                background:
                    linear-gradient(
                        to bottom,
                        rgba(82, 87, 74, 0.9),
                        rgba(50, 52, 44, 0.95)
                    );
                transform-origin: top;
                transform:
                    skewY(-26.5deg);
            }

            .ffs-v09g-terrain-cap {
                position: absolute;
                left: 0;
                top: 0;
                width: 72px;
                height: 36px;
                pointer-events: none;
            }

            .ffs-v09g-terrain-shadow {
                position: absolute;
                left: 8px;
                top: 26px;
                width: 56px;
                height: 16px;
                background: rgba(0, 0, 0, 0.14);
                filter: blur(3px);
                transform: skewX(-25deg);
                pointer-events: none;
            }

            .ffs-v09g-npc {
                position: absolute;
                width: 18px;
                height: 30px;
                transform:
                    translate(-50%, -100%);
                pointer-events: none;
                z-index: 20;
            }

            .ffs-v09g-npc-head {
                position: absolute;
                left: 5px;
                top: 0;
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #d6a276;
                box-shadow:
                    0 1px 0 rgba(0,0,0,.2);
            }

            .ffs-v09g-npc-body {
                position: absolute;
                left: 3px;
                top: 9px;
                width: 13px;
                height: 14px;
                border-radius: 5px 5px 3px 3px;
                background: #52677d;
            }

            .ffs-v09g-npc-legs {
                position: absolute;
                left: 5px;
                top: 22px;
                width: 9px;
                height: 8px;
                border-left: 3px solid #30343b;
                border-right: 3px solid #30343b;
            }

            .ffs-v09g-npc-shadow {
                position: absolute;
                left: -2px;
                bottom: -5px;
                width: 22px;
                height: 7px;
                border-radius: 50%;
                background: rgba(0,0,0,.22);
                transform: scaleY(.55);
            }

            .ffs-v09g-vehicle {
                position: absolute;
                width: 38px;
                height: 20px;
                transform:
                    translate(-50%, -50%);
                pointer-events: none;
                z-index: 18;
            }

            .ffs-v09g-vehicle-body {
                position: absolute;
                left: 2px;
                top: 5px;
                width: 34px;
                height: 12px;
                border-radius: 6px 7px 4px 4px;
                background: #4d5966;
                box-shadow:
                    inset 0 -3px rgba(0,0,0,.15);
            }

            .ffs-v09g-vehicle-window {
                position: absolute;
                left: 12px;
                top: 3px;
                width: 12px;
                height: 7px;
                background: #91a7b4;
                transform: skewX(-18deg);
                border-radius: 2px;
            }

            .ffs-v09g-wheel {
                position: absolute;
                bottom: 0;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #202329;
            }

            .ffs-v09g-wheel-a {
                left: 5px;
            }

            .ffs-v09g-wheel-b {
                right: 5px;
            }

            .ffs-v09g-vehicle-shadow {
                position: absolute;
                left: 4px;
                top: 16px;
                width: 32px;
                height: 8px;
                border-radius: 50%;
                background: rgba(0,0,0,.18);
            }

            .ffs-v09g-cloud {
                position: absolute;
                width: 90px;
                height: 28px;
                border-radius: 50%;
                background: rgba(255,255,255,.20);
                filter: blur(1px);
                pointer-events: none;
                z-index: 2;
            }

            .ffs-v09g-cloud::before,
            .ffs-v09g-cloud::after {
                content: "";
                position: absolute;
                border-radius: 50%;
                background: inherit;
            }

            .ffs-v09g-cloud::before {
                width: 42px;
                height: 42px;
                left: 16px;
                top: -18px;
            }

            .ffs-v09g-cloud::after {
                width: 52px;
                height: 52px;
                right: 10px;
                top: -24px;
            }

            .ffs-v09g-life-label {
                position: absolute;
                pointer-events: none;
                white-space: nowrap;
                font-size: 10px;
                opacity: .7;
                transform: translate(-50%, -100%);
            }

            .ffs-v09g-bird {
                position: absolute;
                width: 18px;
                height: 10px;
                pointer-events: none;
                opacity: .5;
            }

            .ffs-v09g-bird::before,
            .ffs-v09g-bird::after {
                content: "";
                position: absolute;
                top: 4px;
                width: 9px;
                height: 4px;
                border-top: 2px solid currentColor;
                border-radius: 50%;
            }

            .ffs-v09g-bird::before {
                left: 0;
                transform: rotate(12deg);
            }

            .ffs-v09g-bird::after {
                right: 0;
                transform: rotate(-12deg);
            }

        `;


        document.head.appendChild(
            style
        );

    }


    // ========================================================
    // CREATE LAYER
    // ========================================================

    createLayer(name) {

        const layer =
            document.createElement("div");

        layer.className =
            `ffs-map-layer ffs-layer-${name}`;

        return layer;

    }


    // ========================================================
    // TRUE ISOMETRIC PROJECTION
    // ========================================================

    worldToScreen(
        x = 0,
        y = 0,
        z = 0
    ) {

        const screenX =
            this.projectionOrigin.x +
            (
                (x - y) *
                this.halfTileWidth
            );


        const screenY =
            this.projectionOrigin.y +
            (
                (x + y) *
                this.halfTileHeight
            ) -
            (
                z *
                this.heightUnit
            );


        return {

            left: screenX,

            top: screenY,

            x: screenX,

            y: screenY

        };

    }


    // ========================================================
    // GRID → SCREEN
    // ========================================================

    gridToScreen(
        x,
        y,
        z = 0
    ) {

        return this.worldToScreen(
            x,
            y,
            z
        );

    }


    // ========================================================
    // SCREEN → WORLD
    // ========================================================

    screenToWorld(
        screenX,
        screenY,
        z = 0
    ) {

        const localX =
            screenX -
            this.projectionOrigin.x;


        const localY =
            screenY -
            this.projectionOrigin.y +
            (
                z *
                this.heightUnit
            );


        const worldX =
            (
                localX /
                this.halfTileWidth +
                localY /
                this.halfTileHeight
            ) / 2;


        const worldY =
            (
                localY /
                this.halfTileHeight -
                localX /
                this.halfTileWidth
            ) / 2;


        return {

            x: worldX,

            y: worldY,

            z

        };

    }


    // ========================================================
    // FOOTPRINT
    // ========================================================

    footprintToScreen(
        x,
        y,
        width = 1,
        height = 1,
        z = 0
    ) {

        return this.worldToScreen(
            x + width / 2,
            y + height / 2,
            z
        );

    }


    // ========================================================
    // DEPTH
    // ========================================================

    getDepth(
        x = 0,
        y = 0,
        z = 0
    ) {

        return (
            x +
            y +
            z
        );

    }


    getObjectDepth(object) {

        const map =
            object?.map ??
            object ??
            {};


        const x =
            map.x ?? 0;


        const y =
            map.y ?? 0;


        const z =
            map.z ?? 0;


        return this.getDepth(
            x,
            y,
            z
        );

    }


    // ========================================================
    // TERRAIN ELEVATION
    // ========================================================

    getTerrainElevation(
        x,
        y,
        terrain = {}
    ) {

        if (
            Array.isArray(
                terrain.elevation
            ) &&
            Array.isArray(
                terrain.elevation[y]
            )
        ) {

            const value =
                Number(
                    terrain.elevation[y][x]
                );


            if (
                Number.isFinite(value)
            ) {

                return value;

            }

        }


        if (
            Array.isArray(
                terrain.heights
            ) &&
            Array.isArray(
                terrain.heights[y]
            )
        ) {

            const value =
                Number(
                    terrain.heights[y][x]
                );


            if (
                Number.isFinite(value)
            ) {

                return value;

            }

        }


        if (
            Array.isArray(
                terrain.tiles
            )
        ) {

            const tile =
                terrain.tiles.find(
                    item =>
                        item?.x === x &&
                        item?.y === y
                );


            if (tile) {

                const value =
                    Number(
                        tile.z ??
                        tile.height ??
                        0
                    );


                if (
                    Number.isFinite(value)
                ) {

                    return value;

                }

            }

        }


        // ====================================================
        // TEMPORARY VISUAL TERRAIN
        // ====================================================

        const centerX =
            (this.mapWidth - 1) / 2;


        const centerY =
            (this.mapHeight - 1) / 2;


        const distance =
            Math.abs(
                x - centerX
            ) +
            Math.abs(
                y - centerY
            );


        if (
            distance <= 1
        ) {

            return 2;

        }


        if (
            distance <= 3
        ) {

            return 1;

        }


        return 0;

    }


    // ========================================================
    // TERRAIN ELEVATION WITH INTERPOLATED SUPPORT
    // ========================================================

    getGroundZ(
        x,
        y
    ) {

        const terrain =
            this.mapData?.terrain ?? {};


        const gx =
            Math.max(
                0,
                Math.min(
                    this.mapWidth - 1,
                    Math.round(x)
                )
            );


        const gy =
            Math.max(
                0,
                Math.min(
                    this.mapHeight - 1,
                    Math.round(y)
                )
            );


        return this.getTerrainElevation(
            gx,
            gy,
            terrain
        );

    }


    // ========================================================
    // MAX TERRAIN ELEVATION
    // ========================================================

    getMaxTerrainElevation() {

        const terrain =
            this.mapData?.terrain ?? {};


        let maxElevation = 0;


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

                const elevation =
                    this.getTerrainElevation(
                        x,
                        y,
                        terrain
                    );


                maxElevation =
                    Math.max(
                        maxElevation,
                        elevation
                    );

            }

        }


        return maxElevation;

    }


    // ========================================================
    // MAP BOUNDS
    // ========================================================

    getMapProjectionBounds() {

        const corners = [

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
            )

        ];


        const maxElevation =
            this.getMaxTerrainElevation();


        const elevatedCorners = [

            this.worldToScreen(
                0,
                0,
                maxElevation
            ),

            this.worldToScreen(
                this.mapWidth,
                0,
                maxElevation
            ),

            this.worldToScreen(
                0,
                this.mapHeight,
                maxElevation
            ),

            this.worldToScreen(
                this.mapWidth,
                this.mapHeight,
                maxElevation
            )

        ];


        const allPoints = [
            ...corners,
            ...elevatedCorners
        ];


        const xs =
            allPoints.map(
                point => point.left
            );


        const ys =
            allPoints.map(
                point => point.top
            );


        return {

            left:
                Math.min(...xs),

            right:
                Math.max(...xs),

            top:
                Math.min(...ys),

            bottom:
                Math.max(...ys),

            width:
                Math.max(...xs) -
                Math.min(...xs),

            height:
                Math.max(...ys) -
                Math.min(...ys)

        };

    }


    // ========================================================
    // ZOOM CONTROLS
    // ========================================================

    createZoomControls() {

        const controls =
            document.createElement("div");

        controls.className =
            "ffs-map-controls";


        const zoomOut =
            document.createElement("button");

        zoomOut.type =
            "button";

        zoomOut.className =
            "ffs-map-control";

        zoomOut.textContent =
            "−";

        zoomOut.setAttribute(
            "aria-label",
            "Zoom out"
        );


        zoomOut.addEventListener(
            "click",
            () =>
                this.setZoom(
                    this.zoom -
                    this.zoomStep
                )
        );


        const reset =
            document.createElement("button");

        reset.type =
            "button";

        reset.className =
            "ffs-map-zoom-value";

        reset.textContent =
            this.getZoomLabel();

        reset.setAttribute(
            "aria-label",
            "Reset zoom"
        );


        reset.addEventListener(
            "click",
            () =>
                this.setZoom(1)
        );


        const zoomIn =
            document.createElement("button");

        zoomIn.type =
            "button";

        zoomIn.className =
            "ffs-map-control";

        zoomIn.textContent =
            "+";

        zoomIn.setAttribute(
            "aria-label",
            "Zoom in"
        );


        zoomIn.addEventListener(
            "click",
            () =>
                this.setZoom(
                    this.zoom +
                    this.zoomStep
                )
        );


        controls.appendChild(
            zoomOut
        );

        controls.appendChild(
            reset
        );

        controls.appendChild(
            zoomIn
        );


        this.renderer.appendChild(
            controls
        );

    }


    setZoom(value) {

        const nextZoom =
            Math.max(
                this.minZoom,
                Math.min(
                    this.maxZoom,
                    value
                )
            );


        this.zoom =
            Math.round(
                nextZoom * 10
            ) / 10;


        this.applyZoom();

    }


    getZoomLabel() {

        return `${Math.round(this.zoom * 100)}%`;

    }


    applyZoom() {

        if (!this.world) {

            return;

        }


        this.world.style.transform =
            `translate(-50%, -50%) scale(${this.zoom})`;


        const zoomValue =
            this.renderer?.querySelector(
                ".ffs-map-zoom-value"
            );


        if (zoomValue) {

            zoomValue.textContent =
                this.getZoomLabel();

        }

    }


    // ========================================================
    // MAP LAYOUT
    // ========================================================

    updateMapLayout() {

        if (
            !this.world ||
            !this.content
        ) {

            return;

        }


        const bounds =
            this.getMapProjectionBounds();


        const paddingX = 220;

        const paddingY = 220;


        const contentWidth =
            Math.max(
                1000,
                bounds.width +
                paddingX * 2
            );


        const contentHeight =
            Math.max(
                700,
                bounds.height +
                paddingY * 2
            );


        this.world.style.width =
            `${contentWidth}px`;


        this.world.style.height =
            `${contentHeight}px`;


        this.content.style.width =
            `${contentWidth}px`;


        this.content.style.height =
            `${contentHeight}px`;


        const centerElevation =
            this.getMaxTerrainElevation() / 2;


        const projectedCenter =
            this.worldToScreen(
                this.mapWidth / 2,
                this.mapHeight / 2,
                centerElevation
            );


        const offsetX =
            contentWidth / 2 -
            projectedCenter.left;


        const offsetY =
            contentHeight / 2 -
            projectedCenter.top;


        this.contentOffset = {

            x: offsetX,

            y: offsetY

        };


        this.content.style.transform =
            `translate(${offsetX}px, ${offsetY}px)`;

    }


    // ========================================================
    // TERRAIN
    // ========================================================

    renderTerrain(mapData) {

        const terrain =
            mapData.terrain ?? {};


        const width =
            terrain.width ?? 12;


        const height =
            terrain.height ?? 9;


        const tiles = [];


        for (
            let y = 0;
            y < height;
            y++
        ) {

            for (
                let x = 0;
                x < width;
                x++
            ) {

                const elevation =
                    this.getTerrainElevation(
                        x,
                        y,
                        terrain
                    );


                const position =
                    this.worldToScreen(
                        x,
                        y,
                        elevation
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
                    `${position.left}px`;


                tile.style.top =
                    `${position.top}px`;


                tile.style.setProperty(
                    "--terrain-z",
                    elevation
                );


                tile.style.setProperty(
                    "--terrain-height",
                    `${elevation * this.heightUnit}px`
                );


                tile.dataset.worldX =
                    x;

                tile.dataset.worldY =
                    y;

                tile.dataset.worldZ =
                    elevation;

                tile.dataset.depth =
                    this.getDepth(
                        x,
                        y,
                        elevation
                    );

                tile.dataset.elevation =
                    elevation;


                // =================================================
                // ELEVATION VOLUME
                // =================================================

                if (
                    elevation > 0
                ) {

                    tile.classList.add(
                        "terrain-elevated"
                    );


                    const volume =
                        document.createElement("div");


                    volume.className =
                        "ffs-v09g-terrain-volume";


                    volume.style.setProperty(
                        "--volume-height",
                        `${elevation * this.heightUnit}px`
                    );


                    const leftSide =
                        document.createElement("div");


                    leftSide.className =
                        "ffs-v09g-terrain-side ffs-v09g-terrain-side-left";


                    const rightSide =
                        document.createElement("div");


                    rightSide.className =
                        "ffs-v09g-terrain-side ffs-v09g-terrain-side-right";


                    const shadow =
                        document.createElement("div");


                    shadow.className =
                        "ffs-v09g-terrain-shadow";


                    volume.appendChild(
                        shadow
                    );

                    volume.appendChild(
                        leftSide
                    );

                    volume.appendChild(
                        rightSide
                    );


                    tile.appendChild(
                        volume
                    );

                }


                if (
                    elevation >= 2
                ) {

                    tile.classList.add(
                        "terrain-high"
                    );

                }


                tiles.push({
                    element: tile,
                    depth:
                        this.getDepth(
                            x,
                            y,
                            elevation
                        )
                });

            }

        }


        // ====================================================
        // TERRAIN DEPTH ORDER
        // ====================================================

        tiles
            .sort(
                (a, b) =>
                    a.depth -
                    b.depth
            )
            .forEach(
                item =>
                    this.layers
                        .terrain
                        .appendChild(
                            item.element
                        )
            );

    }


    // ========================================================
    // ROADS
    // ========================================================

    renderRoads(mapData) {

        const roads =
            mapData.roads ?? [];


        roads.forEach(
            road => {

                const map =
                    road.map ?? {};


                const x =
                    map.x ?? 0;


                const y =
                    map.y ?? 0;


                const width =
                    map.width ?? 1;


                const direction =
                    map.direction ??
                    "horizontal";


                for (
                    let i = 0;
                    i < width;
                    i++
                ) {

                    const tileX =
                        direction === "horizontal"
                            ? x + i
                            : x;


                    const tileY =
                        direction === "horizontal"
                            ? y
                            : y + i;


                    const z =
                        Number.isFinite(
                            Number(map.z)
                        )
                            ? Number(map.z)
                            : this.getGroundZ(
                                tileX,
                                tileY
                            );


                    const position =
                        this.worldToScreen(
                            tileX,
                            tileY,
                            z
                        );


                    // =========================================
                    // SIDEWALK
                    // =========================================

                    const sidewalk =
                        document.createElement("div");


                    sidewalk.className =
                        "ffs-sidewalk";


                    sidewalk.style.left =
                        `${position.left}px`;


                    sidewalk.style.top =
                        `${position.top}px`;


                    sidewalk.classList.add(
                        direction === "vertical"
                            ? "road-direction-y"
                            : "road-direction-x"
                    );


                    sidewalk.dataset.worldX =
                        tileX;

                    sidewalk.dataset.worldY =
                        tileY;

                    sidewalk.dataset.worldZ =
                        z;


                    this.layers
                        .sidewalks
                        .appendChild(
                            sidewalk
                        );


                    // =========================================
                    // ROAD
                    // =========================================

                    const roadElement =
                        document.createElement("div");


                    roadElement.className =
                        "ffs-road";


                    roadElement.style.left =
                        `${position.left}px`;


                    roadElement.style.top =
                        `${position.top}px`;


                    roadElement.classList.add(
                        direction === "vertical"
                            ? "road-direction-y"
                            : "road-direction-x"
                    );


                    const marking =
                        document.createElement("div");


                    marking.className =
                        "ffs-road-marking";


                    marking.classList.add(
                        direction === "vertical"
                            ? "marking-direction-y"
                            : "marking-direction-x"
                    );


                    roadElement.appendChild(
                        marking
                    );


                    this.layers
                        .roads
                        .appendChild(
                            roadElement
                        );

                }

            }
        );

    }


    // ========================================================
    // BUILDINGS
    // ========================================================

    renderBuildings(mapData) {

        const buildings =
            mapData.buildings ?? [];


        const sorted =
            [...buildings].sort(
                (a, b) =>
                    this.getObjectDepth(a) -
                    this.getObjectDepth(b)
            );


        sorted.forEach(
            building =>
                this.createBuilding(
                    building
                )
        );

    }


    createBuilding(building) {

        const map =
            building.map ?? {};


        const x =
            map.x ?? 0;


        const y =
            map.y ?? 0;


        const width =
            map.width ?? 2;


        const height =
            map.height ?? 2;


        const z =
            Number.isFinite(
                Number(map.z)
            )
                ? Number(map.z)
                : this.getGroundZ(
                    x + width / 2,
                    y + height / 2
                );


        const position =
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


        element.style.left =
            `${position.left}px`;


        element.style.top =
            `${position.top}px`;


        const footprintWidth =
            width *
            this.tileWidth;


        const footprintHeight =
            height *
            this.tileHeight;


        const visualHeight =
            this.getBuildingVisualHeight(
                type,
                footprintHeight
            );


        element.style.setProperty(
            "--footprint-width",
            `${footprintWidth}px`
        );


        element.style.setProperty(
            "--footprint-height",
            `${footprintHeight}px`
        );


        element.style.setProperty(
            "--building-depth",
            `${visualHeight}px`
        );


        element.style.width =
            `${footprintWidth}px`;


        element.style.height =
            `${visualHeight}px`;


        element.dataset.worldX =
            x;

        element.dataset.worldY =
            y;

        element.dataset.worldZ =
            z;

        element.dataset.depth =
            this.getDepth(
                x,
                y,
                z
            );


        // ====================================================
        // SHADOW
        // ====================================================

        const shadow =
            document.createElement("div");


        shadow.className =
            "ffs-building-shadow";


        element.appendChild(
            shadow
        );


        // ====================================================
        // FOOTPRINT
        // ====================================================

        const footprint =
            document.createElement("div");


        footprint.className =
            "ffs-building-footprint";


        element.appendChild(
            footprint
        );


        // ====================================================
        // SIDE
        // ====================================================

        const side =
            document.createElement("div");


        side.className =
            "ffs-building-side";


        element.appendChild(
            side
        );


        // ====================================================
        // BODY
        // ====================================================

        const body =
            document.createElement("div");


        body.className =
            "ffs-building-body";


        element.appendChild(
            body
        );


        // ====================================================
        // ROOF
        // ====================================================

        const roof =
            document.createElement("div");


        roof.className =
            "ffs-building-roof";


        element.appendChild(
            roof
        );


        // ====================================================
        // WINDOWS
        // ====================================================

        if (
            type !== "park"
        ) {

            this.createWindows(
                body,
                type,
                width
            );

        }


        // ====================================================
        // DOOR
        // ====================================================

        if (
            type === "residential" ||
            type === "commercial"
        ) {

            const door =
                document.createElement("div");


            door.className =
                "ffs-building-door";


            body.appendChild(
                door
            );

        }


        // ====================================================
        // LABEL
        // ====================================================

        const label =
            document.createElement("div");


        label.className =
            "ffs-building-label";


        label.textContent =
            building.name ??
            "Building";


        element.appendChild(
            label
        );


        this.layers
            .buildings
            .appendChild(
                element
            );

    }


    getBuildingVisualHeight(
        type,
        footprintHeight
    ) {

        if (
            type === "cbd"
        ) {

            return 250;

        }


        if (
            type === "commercial"
        ) {

            return 150;

        }


        if (
            type === "concrete"
        ) {

            return 145;

        }


        if (
            type === "park"
        ) {

            return footprintHeight + 12;

        }


        return 135;

    }


    getBuildingType(building) {

        const id =
            String(
                building.id ?? ""
            ).toLowerCase();


        const name =
            String(
                building.name ?? ""
            ).toLowerCase();


        if (
            building.type === "park" ||
            id.includes("park") ||
            name.includes("park")
        ) {

            return "park";

        }


        if (
            building.district === "cbd" ||
            id.includes("cbd") ||
            name.includes("tower")
        ) {

            return "cbd";

        }


        if (
            building.district === "commercial" ||
            building.type === "shop" ||
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
        body,
        type,
        width
    ) {

        const rows =
            type === "cbd"
                ? 5
                : type === "commercial"
                    ? 3
                    : 2;


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


                window.style.left =
                    `${18 + column * 24}px`;


                window.style.top =
                    `${14 + row * 18}px`;


                body.appendChild(
                    window
                );

            }

        }

    }


    // ========================================================
    // TREES
    // ========================================================

    renderTrees(mapData) {

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


                const position =
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
                    `${position.left}px`;


                tree.style.top =
                    `${position.top}px`;


                tree.dataset.worldX =
                    x;

                tree.dataset.worldY =
                    y;

                tree.dataset.worldZ =
                    z;


                tree.dataset.depth =
                    this.getDepth(
                        x,
                        y,
                        z
                    );


                tree.dataset.treeIndex =
                    index;


                this.layers
                    .trees
                    .appendChild(
                        tree
                    );

            }
        );

    }


    // ========================================================
    // PROPS
    // ========================================================

    renderProps(mapData) {

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
            prop => {

                const z =
                    this.getGroundZ(
                        prop.x,
                        prop.y
                    );


                const position =
                    this.worldToScreen(
                        prop.x,
                        prop.y,
                        z
                    );


                const element =
                    document.createElement("div");


                element.className =
                    `ffs-prop prop-${prop.type}`;


                element.style.left =
                    `${position.left}px`;


                element.style.top =
                    `${position.top}px`;


                element.dataset.worldX =
                    prop.x;

                element.dataset.worldY =
                    prop.y;

                element.dataset.worldZ =
                    z;


                element.dataset.depth =
                    this.getDepth(
                        prop.x,
                        prop.y,
                        z
                    );


                this.layers
                    .props
                    .appendChild(
                        element
                    );

            }
        );

    }


    // ========================================================
    // VEHICLES
    // ========================================================

    renderVehicles(mapData) {

        const vehicles = [

            {
                x: 3,
                y: 6,
                type: "sedan",
                route: "east"
            },

            {
                x: 7,
                y: 6,
                type: "sedan",
                route: "east"
            },

            {
                x: 11,
                y: 6,
                type: "wagon",
                route: "west"
            },

            {
                x: 14,
                y: 6,
                type: "sedan",
                route: "west"
            }

        ];


        vehicles.forEach(
            (vehicle, index) => {

                const element =
                    document.createElement("div");


                element.className =
                    `ffs-v09g-vehicle vehicle-${vehicle.type}`;


                const body =
                    document.createElement("div");


                body.className =
                    "ffs-v09g-vehicle-body";


                const window =
                    document.createElement("div");


                window.className =
                    "ffs-v09g-vehicle-window";


                const wheelA =
                    document.createElement("div");


                wheelA.className =
                    "ffs-v09g-wheel ffs-v09g-wheel-a";


                const wheelB =
                    document.createElement("div");


                wheelB.className =
                    "ffs-v09g-wheel ffs-v09g-wheel-b";


                const shadow =
                    document.createElement("div");


                shadow.className =
                    "ffs-v09g-vehicle-shadow";


                element.appendChild(
                    shadow
                );

                element.appendChild(
                    body
                );

                element.appendChild(
                    window
                );

                element.appendChild(
                    wheelA
                );

                element.appendChild(
                    wheelB
                );


                this.layers
                    .vehicles
                    .appendChild(
                        element
                    );


                this.vehicles.push({

                    element,

                    startX:
                        vehicle.x,

                    startY:
                        vehicle.y,

                    route:
                        vehicle.route,

                    index,

                    speed:
                        0.0015 +
                        index * 0.00025

                });

            }
        );

    }


    // ========================================================
    // NPCs
    // ========================================================

    renderNPCs(mapData) {

        const npcData = [

            {
                x: 4,
                y: 4,
                destinationX: 8,
                destinationY: 5
            },

            {
                x: 7,
                y: 7,
                destinationX: 5,
                destinationY: 4
            },

            {
                x: 9,
                y: 3,
                destinationX: 11,
                destinationY: 5
            },

            {
                x: 3,
                y: 7,
                destinationX: 5,
                destinationY: 8
            }

        ];


        npcData.forEach(
            (data, index) => {

                const element =
                    document.createElement("div");


                element.className =
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


                const legs =
                    document.createElement("div");


                legs.className =
                    "ffs-v09g-npc-legs";


                element.appendChild(
                    shadow
                );

                element.appendChild(
                    head
                );

                element.appendChild(
                    body
                );

                element.appendChild(
                    legs
                );


                this.layers
                    .npcs
                    .appendChild(
                        element
                    );


                this.npcs.push({

                    element,

                    startX:
                        data.x,

                    startY:
                        data.y,

                    endX:
                        data.destinationX,

                    endY:
                        data.destinationY,

                    index,

                    speed:
                        0.00022 +
                        index * 0.000035

                });

            }
        );

    }


    // ========================================================
    // SIGNS
    // ========================================================

    renderSigns(mapData) {

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
            sign => {

                const z =
                    this.getGroundZ(
                        sign.x,
                        sign.y
                    );


                const position =
                    this.worldToScreen(
                        sign.x,
                        sign.y,
                        z
                    );


                const element =
                    document.createElement("div");


                element.className =
                    "ffs-sign";


                element.textContent =
                    sign.text;


                element.style.left =
                    `${position.left}px`;


                element.style.top =
                    `${position.top}px`;


                element.dataset.worldX =
                    sign.x;

                element.dataset.worldY =
                    sign.y;

                element.dataset.worldZ =
                    z;


                this.layers
                    .signs
                    .appendChild(
                        element
                    );

            }
        );

    }


    // ========================================================
    // DISTRICT LABELS
    // ========================================================

    renderDistrictLabels(mapData) {

        const districts = [

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


        districts.forEach(
            district => {

                const position =
                    this.worldToScreen(
                        district.x,
                        district.y,
                        this.getGroundZ(
                            district.x,
                            district.y
                        )
                    );


                const label =
                    document.createElement("div");


                label.className =
                    "ffs-district-label";


                label.textContent =
                    district.text;


                label.style.left =
                    `${position.left}px`;


                label.style.top =
                    `${position.top}px`;


                this.layers
                    .labels
                    .appendChild(
                        label
                    );

            }
        );

    }


    // ========================================================
    // ENVIRONMENT
    // ========================================================

    renderEnvironment(mapData) {

        const environment =
            mapData.environment ?? {};


        const element =
            document.createElement("div");


        element.className =
            "ffs-environment";


        if (
            environment.weather
        ) {

            element.dataset.weather =
                environment.weather;

        }


        if (
            environment.lighting
        ) {

            element.dataset.lighting =
                environment.lighting;

        }


        this.layers
            .environment
            .appendChild(
                element
            );


        // ====================================================
        // CLOUDS
        // ====================================================

        const cloudPositions = [

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


        cloudPositions.forEach(
            cloudData => {

                const cloud =
                    document.createElement("div");


                cloud.className =
                    "ffs-v09g-cloud";


                cloud.style.left =
                    `${cloudData.x}px`;


                cloud.style.top =
                    `${cloudData.y}px`;


                this.layers
                    .environment
                    .appendChild(
                        cloud
                    );


                this.ambientObjects.push({

                    element: cloud,

                    baseX:
                        cloudData.x,

                    baseY:
                        cloudData.y,

                    speed:
                        cloudData.speed,

                    range: 180

                });

            }
        );


        // ====================================================
        // BIRDS
        // ====================================================

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const bird =
                document.createElement("div");


            bird.className =
                "ffs-v09g-bird";


            bird.style.left =
                `${320 + i * 150}px`;


            bird.style.top =
                `${150 + i * 35}px`;


            this.layers
                .environment
                .appendChild(
                    bird
                );


            this.ambientObjects.push({

                element: bird,

                baseX:
                    320 +
                    i * 150,

                baseY:
                    150 +
                    i * 35,

                speed:
                    0.025 +
                    i * 0.008,

                range: 260

            });

        }

    }


    // ========================================================
    // CITY TITLE
    // ========================================================

    renderCityTitle(mapData) {

        const title =
            document.createElement("div");


        title.className =
            "ffs-city-title";


        title.innerHTML =
            `
            <strong>FFS CITY</strong>
            <span>1996</span>
            <small>LIVING WORLD</small>
            `;


        this.layers
            .labels
            .appendChild(
                title
            );

    }


    // ========================================================
    // ANIMATION ENGINE
    // ========================================================

    startAnimation() {

        if (
            this.prefersReducedMotion
        ) {

            this.updateAnimatedObjects(
                0
            );

            return;

        }


        const animate =
            timestamp => {

                this.animationTime =
                    timestamp;


                this.updateAnimatedObjects(
                    timestamp
                );


                this.animationFrame =
                    requestAnimationFrame(
                        animate
                    );

            };


        this.animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    // ========================================================
    // STOP ANIMATION
    // ========================================================

    stopAnimation() {

        if (
            this.animationFrame !== null
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );

        }


        this.animationFrame =
            null;


        this.animatedObjects =
            [];

        this.npcs =
            [];

        this.vehicles =
            [];

        this.ambientObjects =
            [];

    }


    // ========================================================
    // UPDATE LIVING WORLD
    // ========================================================

    updateAnimatedObjects(
        timestamp
    ) {

        const time =
            Number.isFinite(timestamp)
                ? timestamp
                : 0;


        // ====================================================
        // VEHICLES
        // ====================================================

        this.vehicles.forEach(
            vehicle => {

                const cycle =
                    (
                        time *
                        vehicle.speed /
                        1000
                    ) +
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


                const position =
                    this.worldToScreen(
                        x,
                        y,
                        z + 0.08
                    );


                vehicle.element.style.left =
                    `${position.left}px`;


                vehicle.element.style.top =
                    `${position.top}px`;


                vehicle.element.dataset.worldX =
                    x.toFixed(2);


                vehicle.element.dataset.worldY =
                    y.toFixed(2);


                vehicle.element.dataset.worldZ =
                    z.toFixed(2);


                vehicle.element.style.transform =
                    vehicle.route === "west"
                        ? "translate(-50%, -50%) scaleX(-1)"
                        : "translate(-50%, -50%)";

            }
        );


        // ====================================================
        // NPCS
        // ====================================================

        this.npcs.forEach(
            npc => {

                const cycle =
                    (
                        time *
                        npc.speed /
                        1000
                    ) +
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


                const position =
                    this.worldToScreen(
                        x,
                        y,
                        z + 0.1
                    );


                npc.element.style.left =
                    `${position.left}px`;


                npc.element.style.top =
                    `${position.top}px`;


                const walking =
                    Math.sin(
                        time *
                        0.012 +
                        npc.index
                    );


                npc.element.style.transform =
                    `
                    translate(-50%, -100%)
                    translateY(${walking * 1.2}px)
                    `;

            }
        );


        // ====================================================
        // TREES — VERY SUBTLE LIFE
        // ====================================================

        const trees =
            this.layers
                ?.trees
                ?.children ?? [];


        Array.from(trees)
            .forEach(
                (tree, index) => {

                    const sway =
                        Math.sin(
                            time *
                            0.0012 +
                            index
                        ) *
                        1.2;


                    tree.style.transform =
                        `translateX(${sway}px)`;

                }
            );


        // ====================================================
        // AMBIENT OBJECTS
        // ====================================================

        this.ambientObjects.forEach(
            object => {

                const movement =
                    (
                        time *
                        object.speed /
                        1000
                    ) % 1;


                const x =
                    object.baseX +
                    movement *
                    object.range;


                object.element.style.transform =
                    `translateX(${x - object.baseX}px)`;

            }
        );

    }

            }
