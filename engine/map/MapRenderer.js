// ============================================================
// FFS - MAP RENDERER
// Visual Proof v0.1
//
// Stage 1:
// - Isometric building geometry
// - 3D-style shading
// - Residential / Commercial / CBD distinction
// - Glass / Brick / Concrete appearance
// - Road & sidewalk
// - City composition
// ============================================================


export class MapRenderer {

    constructor(containerId) {

        this.container =
            document.getElementById(containerId);

        if (!this.container) {

            throw new Error(
                `[MapRenderer] Container #${containerId} tidak ditemukan.`
            );
        }

        this.version = "0.3";

        this.tileWidth = 72;
        this.tileHeight = 36;

        this.mapWidth = 12;
        this.mapHeight = 9;

        this.buildingHeightUnit = 18;

        this.colors = {

            terrain: "#7b9b65",

            grassLight: "#91ad72",
            grassDark: "#6d8d59",

            road: "#50545a",
            roadDark: "#3e4247",

            sidewalk: "#aaa79d",
            sidewalkDark: "#89867e",

            brickLight: "#b96e52",
            brickDark: "#754538",

            concreteLight: "#aaaeb1",
            concreteDark: "#686c70",

            glassLight: "#5e9db5",
            glassDark: "#285269",

            glassGreenLight: "#65a69b",
            glassGreenDark: "#315e59",

            steelLight: "#9ca5aa",
            steelDark: "#555e63",

            roof: "#41464a",

            park: "#71945c",
            tree: "#477047",

            shadow: "rgba(20, 25, 30, 0.22)",

            white: "#f3f1e9",
            sign: "#e8d66b"
        };
    }


    // ========================================================
    // PUBLIC RENDER
    // ========================================================

    render(mapData) {

        this.clear();

        if (!mapData) {

            this.renderEmpty(
                "No map data available."
            );

            return;
        }

        this.mapWidth =
            mapData.terrain?.width ?? 12;

        this.mapHeight =
            mapData.terrain?.height ?? 9;

        this.createRoot();

        this.renderTerrain();

        this.renderRoads(
            mapData.roads ?? {}
        );

        this.renderBuildings(
            mapData.buildings ?? {}
        );

        this.renderCityLabel();
    }


    // ========================================================
    // ROOT
    // ========================================================

    createRoot() {

        this.root =
            document.createElement("div");

        this.root.className =
            "ffs-map-v03";

        this.root.style.width =
            `${this.getMapPixelWidth()}px`;

        this.root.style.height =
            `${this.getMapPixelHeight()}px`;

        this.container.appendChild(
            this.root
        );
    }


    // ========================================================
    // TERRAIN
    // ========================================================

    renderTerrain() {

        const layer =
            document.createElement("div");

        layer.className =
            "map-terrain-layer-v03";

        this.root.appendChild(layer);

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

                const tile =
                    document.createElement("div");

                tile.className =
                    "map-tile-v03";

                const position =
                    this.gridToScreen(
                        x,
                        y
                    );

                tile.style.left =
                    `${position.x}px`;

                tile.style.top =
                    `${position.y}px`;

                tile.style.width =
                    `${this.tileWidth}px`;

                tile.style.height =
                    `${this.tileHeight}px`;

                tile.style.background =
                    this.getTerrainColor(
                        x,
                        y
                    );

                layer.appendChild(tile);
            }
        }
    }


    getTerrainColor(x, y) {

        if (
            (x + y) % 2 === 0
        ) {

            return this.colors.grassLight;
        }

        return this.colors.grassDark;
    }


    // ========================================================
    // ROADS
    // ========================================================

    renderRoads(roads) {

        const layer =
            document.createElement("div");

        layer.className =
            "map-roads-layer-v03";

        this.root.appendChild(layer);

        Object.values(roads)
            .forEach(road => {

                if (!road.map) {

                    return;
                }

                this.renderRoad(
                    layer,
                    road
                );
            });
    }


    renderRoad(layer, road) {

        const map =
            road.map;

        const width =
            map.width ?? 1;

        const x =
            map.x ?? 0;

        const y =
            map.y ?? 0;

        const direction =
            map.direction ?? "horizontal";


        for (
            let i = 0;
            i < width;
            i++
        ) {

            let tileX = x;
            let tileY = y;

            if (
                direction === "horizontal"
            ) {

                tileX += i;

            } else {

                tileY += i;
            }

            const roadTile =
                document.createElement("div");

            roadTile.className =
                "map-road-v03";

            const position =
                this.gridToScreen(
                    tileX,
                    tileY
                );

            roadTile.style.left =
                `${position.x}px`;

            roadTile.style.top =
                `${position.y}px`;

            roadTile.style.width =
                `${this.tileWidth}px`;

            roadTile.style.height =
                `${this.tileHeight}px`;

            layer.appendChild(
                roadTile
            );


            // ------------------------------------------------
            // SIDEWALK
            // ------------------------------------------------

            const sidewalk =
                document.createElement("div");

            sidewalk.className =
                "map-sidewalk-v03";

            sidewalk.style.left =
                `${position.x}px`;

            sidewalk.style.top =
                `${position.y - 4}px`;

            sidewalk.style.width =
                `${this.tileWidth}px`;

            sidewalk.style.height =
                `${this.tileHeight}px`;

            layer.appendChild(
                sidewalk
            );
        }
    }


    // ========================================================
    // BUILDINGS
    // ========================================================

    renderBuildings(buildings) {

        const layer =
            document.createElement("div");

        layer.className =
            "map-buildings-layer-v03";

        this.root.appendChild(layer);

        Object.values(buildings)
            .forEach(building => {

                if (!building.map) {

                    return;
                }

                this.renderBuilding(
                    layer,
                    building
                );
            });
    }


    renderBuilding(layer, building) {

        const map =
            building.map;

        const x =
            map.x ?? 0;

        const y =
            map.y ?? 0;

        const width =
            map.width ?? 1;

        const height =
            map.height ?? 1;


        const position =
            this.gridToScreen(
                x,
                y
            );


        const visual =
            this.getBuildingVisual(
                building
            );


        const buildingWidth =
            this.tileWidth *
            width;

        const buildingDepth =
            this.tileHeight *
            height;

        const buildingHeight =
            visual.height *
            this.buildingHeightUnit;


        const wrapper =
            document.createElement("div");

        wrapper.className =
            `map-building-v03 ${visual.className}`;


        wrapper.style.left =
            `${position.x}px`;

        wrapper.style.top =
            `${position.y}px`;

        wrapper.style.width =
            `${buildingWidth}px`;

        wrapper.style.height =
            `${buildingDepth + buildingHeight}px`;


        // ----------------------------------------------------
        // SHADOW
        // ----------------------------------------------------

        const shadow =
            document.createElement("div");

        shadow.className =
            "building-shadow-v03";

        shadow.style.width =
            `${buildingWidth * 0.9}px`;

        shadow.style.height =
            `${buildingDepth * 0.65}px`;

        shadow.style.left =
            `${buildingWidth * 0.15}px`;

        shadow.style.top =
            `${buildingHeight + buildingDepth * 0.35}px`;

        wrapper.appendChild(
            shadow
        );


        // ----------------------------------------------------
        // BUILDING BODY
        // ----------------------------------------------------

        const body =
            document.createElement("div");

        body.className =
            "building-body-v03";

        body.style.height =
            `${buildingHeight}px`;

        body.style.bottom =
            `${buildingDepth}px`;

        body.style.background =
            visual.front;

        wrapper.appendChild(
            body
        );


        // ----------------------------------------------------
        // SIDE FACE
        // ----------------------------------------------------

        const side =
            document.createElement("div");

        side.className =
            "building-side-v03";

        side.style.height =
            `${buildingHeight}px`;

        side.style.bottom =
            `${buildingDepth}px`;

        side.style.background =
            visual.side;

        wrapper.appendChild(
            side
        );


        // ----------------------------------------------------
        // ROOF
        // ----------------------------------------------------

        const roof =
            document.createElement("div");

        roof.className =
            "building-roof-v03";

        roof.style.width =
            `${buildingWidth}px`;

        roof.style.height =
            `${buildingDepth}px`;

        roof.style.bottom =
            `${buildingHeight + buildingDepth}px`;

        roof.style.background =
            visual.roof;

        wrapper.appendChild(
            roof
        );


        // ----------------------------------------------------
        // WINDOWS
        // ----------------------------------------------------

        if (
            visual.windows
        ) {

            this.renderWindows(
                wrapper,
                buildingWidth,
                buildingHeight,
                visual
            );
        }


        // ----------------------------------------------------
        // SIGNAGE
        // ----------------------------------------------------

        this.renderSignage(
            wrapper,
            building,
            buildingWidth,
            buildingHeight
        );


        // ----------------------------------------------------
        // LABEL
        // ----------------------------------------------------

        const label =
            document.createElement("div");

        label.className =
            "building-label-v03";

        label.textContent =
            building.name ??
            building.id ??
            "Building";

        label.style.bottom =
            `${buildingHeight + buildingDepth + 8}px`;

        wrapper.appendChild(
            label
        );


        layer.appendChild(
            wrapper
        );
    }


    // ========================================================
    // BUILDING VISUAL CLASSIFICATION
    // ========================================================

    getBuildingVisual(building) {

        const type =
            String(
                building.type ?? ""
            ).toLowerCase();

        const name =
            String(
                building.name ?? ""
            ).toLowerCase();


        // ----------------------------------------------------
        // PARK
        // ----------------------------------------------------

        if (
            type === "park" ||
            name.includes("park")
        ) {

            return {

                className:
                    "building-park-v03",

                height:
                    0.15,

                front:
                    this.colors.park,

                side:
                    this.colors.grassDark,

                roof:
                    this.colors.park,

                windows:
                    false
            };
        }


        // ----------------------------------------------------
        // SHOP / COMMERCIAL
        // ----------------------------------------------------

        if (
            type === "shop" ||
            type === "commercial" ||
            name.includes("shop") ||
            name.includes("store")
        ) {

            return {

                className:
                    "building-commercial-v03",

                height:
                    2.0,

                front:
                    this.colors.concreteLight,

                side:
                    this.colors.concreteDark,

                roof:
                    this.colors.roof,

                windows:
                    true
            };
        }


        // ----------------------------------------------------
        // CBD / OFFICE
        // ----------------------------------------------------

        if (
            type === "office" ||
            type === "cbd" ||
            name.includes("office") ||
            name.includes("tower")
        ) {

            return {

                className:
                    "building-cbd-v03",

                height:
                    4.5,

                front:
                    this.colors.glassLight,

                side:
                    this.colors.glassDark,

                roof:
                    this.colors.steelDark,

                windows:
                    true
            };
        }


        // ----------------------------------------------------
        // RESIDENTIAL
        // ----------------------------------------------------

        return {

            className:
                "building-residential-v03",

            height:
                1.8,

            front:
                this.colors.brickLight,

            side:
                this.colors.brickDark,

            roof:
                this.colors.roof,

            windows:
                true
        };
    }


    // ========================================================
    // WINDOWS
    // ========================================================

    renderWindows(
        wrapper,
        buildingWidth,
        buildingHeight,
        visual
    ) {

        const windows =
            document.createElement("div");

        windows.className =
            "building-windows-v03";

        const rows =
            Math.max(
                2,
                Math.floor(
                    buildingHeight / 28
                )
            );

        const columns =
            Math.max(
                2,
                Math.floor(
                    buildingWidth / 24
                )
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
                    document.createElement("span");

                window.className =
                    "building-window-v03";

                window.style.left =
                    `${12 + column * 24}px`;

                window.style.bottom =
                    `${10 + row * 24}px`;

                window.style.background =
                    visual.windowsColor ??
                    "rgba(235, 242, 240, 0.48)";

                windows.appendChild(
                    window
                );
            }
        }

        wrapper.appendChild(
            windows
        );
    }


    // ========================================================
    // SIGNAGE
    // ========================================================

    renderSignage(
        wrapper,
        building,
        buildingWidth,
        buildingHeight
    ) {

        const type =
            String(
                building.type ?? ""
            ).toLowerCase();

        if (
            type !== "shop" &&
            type !== "commercial"
        ) {

            return;
        }

        const sign =
            document.createElement("div");

        sign.className =
            "building-sign-v03";

        sign.textContent =
            "SHOP";

        sign.style.left =
            `${buildingWidth * 0.18}px`;

        sign.style.bottom =
            `${buildingHeight * 0.45}px`;

        wrapper.appendChild(
            sign
        );
    }


    // ========================================================
    // CITY LABEL
    // ========================================================

    renderCityLabel() {

        const label =
            document.createElement("div");

        label.className =
            "map-city-label-v03";

        label.textContent =
            "FFS CITY • 1996";

        this.root.appendChild(
            label
        );
    }


    // ========================================================
    // GRID → SCREEN
    // ========================================================

    gridToScreen(x, y) {

        const centerX =
            this.getMapPixelWidth() / 2;

        const screenX =
            centerX +
            (x - y) *
            (this.tileWidth / 2);

        const screenY =
            80 +
            (x + y) *
            (this.tileHeight / 2);

        return {

            x: screenX,
            y: screenY
        };
    }


    // ========================================================
    // DIMENSIONS
    // ========================================================

    getMapPixelWidth() {

        return (
            (this.mapWidth +
             this.mapHeight) *
            (this.tileWidth / 2)
        ) + 120;
    }


    getMapPixelHeight() {

        return (
            (this.mapWidth +
             this.mapHeight) *
            (this.tileHeight / 2)
        ) + 180;
    }


    // ========================================================
    // EMPTY STATE
    // ========================================================

    renderEmpty(message) {

        const empty =
            document.createElement("div");

        empty.className =
            "ffs-map-empty";

        empty.textContent =
            message;

        this.container.appendChild(
            empty
        );
    }


    // ========================================================
    // CLEAR
    // ========================================================

    clear() {

        this.container.innerHTML =
            "";
    }
            }
