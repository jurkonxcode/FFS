// ============================================================
// FFS - MAP RENDERER v0.9-A
// 3D WORLD FOUNDATION
// TERRAIN + Z / ELEVATION PROOF
//
// Based on:
// - Visual Proof v0.7
// - True Isometric Projection v0.8
//
// Preserved:
// - Centered Map
// - Zoom System
// - Existing Rendering Layers
// - Existing Visual Objects
// - Existing Visual Style
//
// Added:
// - Terrain Z / Elevation
// - Visible Terrain Height
// - World → Screen Projection with Z
// - Screen → World Projection with Z
// - Elevation-aware projection bounds
// - Improved depth calculation
// - Terrain elevation data support
//
// IMPORTANT:
// This is a controlled visual proof.
// It is NOT yet the final 3D terrain system.
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
        //
        // v0.9-A:
        // 1 world Z unit = 12 screen pixels.
        //
        // This is intentionally visible so that the first
        // terrain elevation can be visually verified.
        // ====================================================

        this.heightUnit = 12;


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

        this.renderSigns(mapData);

        this.renderDistrictLabels(mapData);

        this.renderEnvironment(mapData);

        this.renderCityTitle(mapData);


        // ====================================================
        // CENTER MAP
        // ====================================================

        this.updateMapLayout();

        this.applyZoom();

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
    // TRUE ISOMETRIC PROJECTION CORE
    //
    // X → diagonal right/down
    // Y → diagonal left/down
    // Z → vertical up
    //
    // Screen:
    //
    // X = (X - Y) * halfTileWidth
    //
    // Y = (X + Y) * halfTileHeight
    //     - Z * heightUnit
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
    // FOOTPRINT CENTER → SCREEN
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
    //
    // X/Y determine physical depth.
    // Z is included so elevated objects can participate
    // in future depth ordering.
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


    // ========================================================
    // OBJECT DEPTH
    //
    // IMPORTANT:
    // map.height is footprint size.
    // It must NOT automatically become Z.
    // ========================================================

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
    //
    // Priority:
    //
    // 1. terrain.elevation[y][x]
    // 2. terrain.heights[y][x]
    // 3. terrain.tiles[y][x].z
    // 4. terrain.tiles[y][x].height
    // 5. deterministic visual proof terrain
    //
    // The fallback is intentionally simple.
    // It allows v0.9-A to show elevation even before the
    // complete terrain data system exists.
    // ========================================================

    getTerrainElevation(
        x,
        y,
        terrain = {}
    ) {

        // ====================================================
        // ARRAY: elevation
        // ====================================================

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


        // ====================================================
        // ARRAY: heights
        // ====================================================

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


        // ====================================================
        // TILE DATA
        // ====================================================

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

                const z =
                    Number(
                        tile.z ??
                        tile.height ??
                        0
                    );


                if (
                    Number.isFinite(z)
                ) {

                    return z;

                }

            }

        }


        // ====================================================
        // v0.9-A VISUAL PROOF
        //
        // Creates a gentle elevation pattern around the
        // center of the prototype map.
        //
        // This is temporary and will later be replaced by
        // the real World/Terrain Engine.
        // ====================================================

        const centerX =
            (this.mapWidth - 1) / 2;


        const centerY =
            (this.mapHeight - 1) / 2;


        const distance =
            Math.abs(x - centerX) +
            Math.abs(y - centerY);


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
    // MAP PROJECTION BOUNDS
    //
    // Now includes terrain elevation.
    // ========================================================

    getMapProjectionBounds() {

        const terrain =
            this.mapData?.terrain ?? {};


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


        // ====================================================
        // ZOOM OUT
        // ====================================================

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
            () => {

                this.setZoom(
                    this.zoom -
                    this.zoomStep
                );

            }
        );


        // ====================================================
        // RESET
        // ====================================================

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
            () => {

                this.setZoom(1);

            }
        );


        // ====================================================
        // ZOOM IN
        // ====================================================

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
            () => {

                this.setZoom(
                    this.zoom +
                    this.zoomStep
                );

            }
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


    // ========================================================
    // SET ZOOM
    // ========================================================

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


    // ========================================================
    // ZOOM LABEL
    // ========================================================

    getZoomLabel() {

        return `${Math.round(this.zoom * 100)}%`;

    }


    // ========================================================
    // APPLY ZOOM
    // ========================================================

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
    // UPDATE MAP LAYOUT
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


        // ====================================================
        // PADDING
        // ====================================================

        const paddingX = 180;

        const paddingY = 180;


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


        // ====================================================
        // CENTER OF PROJECTED MAP
        //
        // Center is based on the terrain's approximate
        // visual elevation.
        // ====================================================

        const centerElevation =
            this.getMaxTerrainElevation() / 2;


        const projectedCenter =
            this.worldToScreen(
                this.mapWidth / 2,
                this.mapHeight / 2,
                centerElevation
            );


        const contentCenterX =
            contentWidth / 2;


        const contentCenterY =
            contentHeight / 2;


        const offsetX =
            contentCenterX -
            projectedCenter.left;


        const offsetY =
            contentCenterY -
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

                // ============================================
                // TERRAIN Z
                // ============================================

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


                // ============================================
                // TERRAIN VARIATION
                // ============================================

                const variation =
                    (
                        x * 7 +
                        y * 13
                    ) % 4;


                tile.classList.add(
                    `terrain-variation-${variation}`
                );


                // ============================================
                // POSITION
                // ============================================

                tile.style.left =
                    `${position.left}px`;


                tile.style.top =
                    `${position.top}px`;


                // ============================================
                // Z VISUAL INFORMATION
                //
                // Inline custom properties allow future CSS
                // terrain styling without changing the
                // renderer API.
                // ============================================

                tile.style.setProperty(
                    "--terrain-z",
                    elevation
                );


                tile.style.setProperty(
                    "--terrain-height",
                    `${elevation * this.heightUnit}px`
                );


                // ============================================
                // DATA
                // ============================================

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


                // ============================================
                // ELEVATION CLASS
                // ============================================

                if (
                    elevation > 0
                ) {

                    tile.classList.add(
                        "terrain-elevated"
                    );

                }


                if (
                    elevation >= 2
                ) {

                    tile.classList.add(
                        "terrain-high"
                    );

                }


                this.layers
                    .terrain
                    .appendChild(
                        tile
                    );

            }

        }

    }


    // ========================================================
    // ROADS + SIDEWALKS
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


                const z =
                    map.z ?? 0;


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


                    const position =
                        this.worldToScreen(
                            tileX,
                            tileY,
                            z
                        );


                    // ========================================
                    // SIDEWALK
                    // ========================================

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


                    // ========================================
                    // ROAD
                    // ========================================

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


                    // ========================================
                    // ROAD MARKING
                    // ========================================

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
                (a, b) => {

                    return (
                        this.getObjectDepth(a) -
                        this.getObjectDepth(b)
                    );

                }
            );


        sorted.forEach(
            building => {

                this.createBuilding(
                    building
                );

            }
        );

    }


    // ========================================================
    // CREATE BUILDING
    // ========================================================

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
            map.z ?? 0;


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
        // ISO FOOTPRINT
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


    // ========================================================
    // BUILDING VISUAL HEIGHT
    // ========================================================

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


    // ========================================================
    // BUILDING TYPE
    // ========================================================

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


    // ========================================================
    // WINDOWS
    // ========================================================

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

            [13, 2],

            [14, 5],

            [2, 10],

            [5, 10],

            [9, 10],

            [13, 10]

        ];


        positions.forEach(
            ([x, y], index) => {

                const position =
                    this.worldToScreen(
                        x,
                        y,
                        0
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
                    0;


                tree.dataset.depth =
                    this.getDepth(
                        x,
                        y,
                        0
                    );


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
            }

        ];


        props.forEach(
            prop => {

                const position =
                    this.worldToScreen(
                        prop.x,
                        prop.y,
                        0
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
                    0;


                element.dataset.depth =
                    this.getDepth(
                        prop.x,
                        prop.y,
                        0
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
                type: "sedan"
            },

            {
                x: 7,
                y: 6,
                type: "sedan"
            },

            {
                x: 11,
                y: 6,
                type: "wagon"
            },

            {
                x: 14,
                y: 6,
                type: "sedan"
            }

        ];


        vehicles.forEach(
            vehicle => {

                const position =
                    this.worldToScreen(
                        vehicle.x,
                        vehicle.y,
                        0
                    );


                const element =
                    document.createElement("div");


                element.className =
                    `ffs-vehicle vehicle-${vehicle.type}`;


                element.style.left =
                    `${position.left}px`;


                element.style.top =
                    `${position.top}px`;


                element.dataset.worldX =
                    vehicle.x;


                element.dataset.worldY =
                    vehicle.y;


                element.dataset.worldZ =
                    0;


                element.dataset.depth =
                    this.getDepth(
                        vehicle.x,
                        vehicle.y,
                        0
                    );


                this.layers
                    .vehicles
                    .appendChild(
                        element
                    );

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

                const position =
                    this.worldToScreen(
                        sign.x,
                        sign.y,
                        0
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
                    0;


                element.dataset.depth =
                    this.getDepth(
                        sign.x,
                        sign.y,
                        0
                    );


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
                        0
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


                label.dataset.worldX =
                    district.x;


                label.dataset.worldY =
                    district.y;


                label.dataset.worldZ =
                    0;


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

            }
