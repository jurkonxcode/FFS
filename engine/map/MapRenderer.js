// ============================================================
// FFS - MAP RENDERER
// Visual Proof v0.1
// Living City Foundation
// ============================================================


export class MapRenderer {

    constructor(containerId) {

        this.container =
            document.getElementById(
                containerId
            );

        if (!this.container) {

            throw new Error(
                `[MapRenderer] Container #${containerId} tidak ditemukan.`
            );
        }

        this.version =
            "0.4";

        this.tileWidth =
            72;

        this.tileHeight =
            36;

        this.mapWidth =
            16;

        this.mapHeight =
            12;

        this.buildingHeightUnit =
            18;
    }


    // ========================================================
    // RENDER
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
            mapData.terrain?.width ?? 16;

        this.mapHeight =
            mapData.terrain?.height ?? 12;


        this.createRoot();


        // WORLD LAYERS

        this.renderTerrain();

        this.renderRoads(
            mapData.roads ?? {}
        );

        this.renderEnvironment(
            mapData.environment ?? {}
        );

        this.renderBuildings(
            mapData.buildings ?? {}
        );

        this.renderTrees(
            mapData
        );

        this.renderProps(
            mapData
        );

        this.renderSigns(
            mapData
        );

        this.renderCityLabel();
    }


    // ========================================================
    // ROOT
    // ========================================================

    createRoot() {

        this.root =
            document.createElement(
                "div"
            );

        this.root.className =
            "ffs-map-v04";


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
            document.createElement(
                "div"
            );

        layer.className =
            "map-terrain-layer-v04";


        this.root.appendChild(
            layer
        );


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
                    document.createElement(
                        "div"
                    );

                tile.className =
                    "map-tile-v04";


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


                const variation =
                    (x * 7 + y * 13) % 4;


                tile.dataset.variation =
                    variation;


                layer.appendChild(
                    tile
                );
            }
        }
    }


    // ========================================================
    // ROADS
    // ========================================================

    renderRoads(roads) {

        const layer =
            document.createElement(
                "div"
            );

        layer.className =
            "map-roads-layer-v04";


        this.root.appendChild(
            layer
        );


        Object.values(roads)
            .forEach(
                road => {

                    if (!road.map) {
                        return;
                    }

                    this.renderRoad(
                        layer,
                        road
                    );
                }
            );
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
            map.direction ??
            "horizontal";


        for (
            let i = 0;
            i < width;
            i++
        ) {

            let tileX =
                x;

            let tileY =
                y;


            if (
                direction ===
                "horizontal"
            ) {

                tileX += i;

            } else {

                tileY += i;
            }


            const position =
                this.gridToScreen(
                    tileX,
                    tileY
                );


            const road =
                document.createElement(
                    "div"
                );

            road.className =
                "map-road-v04";


            road.style.left =
                `${position.x}px`;

            road.style.top =
                `${position.y}px`;

            road.style.width =
                `${this.tileWidth}px`;

            road.style.height =
                `${this.tileHeight}px`;


            layer.appendChild(
                road
            );


            this.renderRoadMarking(
                layer,
                position,
                direction
            );


            this.renderSidewalk(
                layer,
                position
            );
        }
    }


    // ========================================================
    // ROAD MARKING
    // ========================================================

    renderRoadMarking(
        layer,
        position,
        direction
    ) {

        const marking =
            document.createElement(
                "div"
            );


        marking.className =
            "road-marking-v04";


        marking.style.left =
            `${position.x}px`;

        marking.style.top =
            `${position.y}px`;

        marking.style.width =
            `${this.tileWidth}px`;

        marking.style.height =
            `${this.tileHeight}px`;


        marking.dataset.direction =
            direction;


        layer.appendChild(
            marking
        );
    }


    // ========================================================
    // SIDEWALK
    // ========================================================

    renderSidewalk(
        layer,
        position
    ) {

        const sidewalk =
            document.createElement(
                "div"
            );


        sidewalk.className =
            "map-sidewalk-v04";


        sidewalk.style.left =
            `${position.x}px`;

        sidewalk.style.top =
            `${position.y}px`;

        sidewalk.style.width =
            `${this.tileWidth}px`;

        sidewalk.style.height =
            `${this.tileHeight}px`;


        layer.appendChild(
            sidewalk
        );
    }


    // ========================================================
    // BUILDINGS
    // ========================================================

    renderBuildings(buildings) {

        const layer =
            document.createElement(
                "div"
            );

        layer.className =
            "map-buildings-layer-v04";


        this.root.appendChild(
            layer
        );


        const ordered =
            Object.values(buildings)
                .filter(
                    building =>
                        building.map
                )
                .sort(
                    (a, b) =>
                        (
                            (a.map.x + a.map.y)
                        ) -
                        (
                            (b.map.x + b.map.y)
                        )
                );


        ordered.forEach(
            building => {

                this.renderBuilding(
                    layer,
                    building
                );
            }
        );
    }


    renderBuilding(
        layer,
        building
    ) {

        const map =
            building.map;


        const position =
            this.gridToScreen(
                map.x ?? 0,
                map.y ?? 0
            );


        const visual =
            this.getBuildingVisual(
                building
            );


        const width =
            (map.width ?? 1) *
            this.tileWidth;


        const depth =
            (map.height ?? 1) *
            this.tileHeight;


        const height =
            visual.height *
            this.buildingHeightUnit;


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            `map-building-v04 ${visual.className}`;


        wrapper.style.left =
            `${position.x}px`;

        wrapper.style.top =
            `${position.y}px`;

        wrapper.style.width =
            `${width}px`;

        wrapper.style.height =
            `${depth + height}px`;


        // SHADOW

        const shadow =
            document.createElement(
                "div"
            );

        shadow.className =
            "building-shadow-v04";


        shadow.style.width =
            `${width * 0.95}px`;

        shadow.style.height =
            `${depth * 0.65}px`;

        shadow.style.left =
            `${width * 0.12}px`;

        shadow.style.top =
            `${height + depth * 0.35}px`;


        wrapper.appendChild(
            shadow
        );


        // FRONT

        const body =
            document.createElement(
                "div"
            );

        body.className =
            "building-body-v04";


        body.style.height =
            `${height}px`;

        body.style.bottom =
            `${depth}px`;

        body.style.background =
            visual.front;


        wrapper.appendChild(
            body
        );


        // SIDE

        const side =
            document.createElement(
                "div"
            );

        side.className =
            "building-side-v04";


        side.style.height =
            `${height}px`;

        side.style.bottom =
            `${depth}px`;

        side.style.background =
            visual.side;


        wrapper.appendChild(
            side
        );


        // ROOF

        const roof =
            document.createElement(
                "div"
            );

        roof.className =
            "building-roof-v04";


        roof.style.width =
            `${width}px`;

        roof.style.height =
            `${depth}px`;

        roof.style.bottom =
            `${height + depth}px`;

        roof.style.background =
            visual.roof;


        wrapper.appendChild(
            roof
        );


        // WINDOWS

        if (visual.windows) {

            this.renderWindows(
                wrapper,
                width,
                height,
                visual
            );
        }


        layer.appendChild(
            wrapper
        );
    }


    // ========================================================
    // BUILDING VISUAL
    // ========================================================

    getBuildingVisual(building) {

        const type =
            String(
                building.type ?? ""
            ).toLowerCase();


        if (
            type === "office" ||
            type === "cbd"
        ) {

            return {

                className:
                    "building-cbd-v04",

                height:
                    6.5,

                front:
                    "#5e9db5",

                side:
                    "#294f62",

                roof:
                    "#424a4e",

                windows:
                    true
            };
        }


        if (
            type === "shop" ||
            type === "commercial"
        ) {

            return {

                className:
                    "building-commercial-v04",

                height:
                    2.2,

                front:
                    "#b8bab8",

                side:
                    "#727679",

                roof:
                    "#45494c",

                windows:
                    true
            };
        }


        if (type === "park") {

            return {

                className:
                    "building-park-v04",

                height:
                    0.15,

                front:
                    "#71945c",

                side:
                    "#4f7045",

                roof:
                    "#71945c",

                windows:
                    false
            };
        }


        return {

            className:
                "building-residential-v04",

            height:
                1.8,

            front:
                "#b96e52",

            side:
                "#754538",

            roof:
                "#41464a",

            windows:
                true
        };
    }


    // ========================================================
    // WINDOWS
    // ========================================================

    renderWindows(
        wrapper,
        width,
        height,
        visual
    ) {

        const windows =
            document.createElement(
                "div"
            );


        windows.className =
            "building-windows-v04";


        const rows =
            Math.max(
                2,
                Math.floor(
                    height / 26
                )
            );


        const columns =
            Math.max(
                2,
                Math.floor(
                    width / 26
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
                    document.createElement(
                        "span"
                    );


                window.className =
                    "building-window-v04";


                window.style.left =
                    `${10 + column * 25}px`;

                window.style.bottom =
                    `${8 + row * 25}px`;


                if (
                    visual.className
                        .includes("cbd")
                ) {

                    window.classList.add(
                        "glass-window-v04"
                    );
                }


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
    // TREES
    // ========================================================

    renderTrees(mapData) {

        const layer =
            document.createElement(
                "div"
            );


        layer.className =
            "map-trees-layer-v04";


        this.root.appendChild(
            layer
        );


        // Central park cluster

        const parkTrees = [

            [6, 2],
            [7, 2],
            [8, 2],
            [6, 3],
            [8, 3],
            [7, 4],

            // residential greenery

            [2, 3],
            [5, 4],
            [12, 3],
            [13, 4],
            [2, 9],
            [5, 10],
            [12, 9],
            [13, 10]
        ];


        parkTrees.forEach(
            ([x, y], index) => {

                this.renderTree(
                    layer,
                    x,
                    y,
                    index % 3
                );
            }
        );
    }


    renderTree(
        layer,
        x,
        y,
        variation
    ) {

        const position =
            this.gridToScreen(
                x,
                y
            );


        const tree =
            document.createElement(
                "div"
            );


        tree.className =
            "map-tree-v04";


        tree.dataset.variant =
            variation;


        tree.style.left =
            `${position.x}px`;

        tree.style.top =
            `${position.y - 22}px`;


        layer.appendChild(
            tree
        );
    }


    // ========================================================
    // PROPS
    // ========================================================

    renderProps() {

        const layer =
            document.createElement(
                "div"
            );


        layer.className =
            "map-props-layer-v04";


        this.root.appendChild(
            layer
        );


        const props = [

            {
                type: "lamp",
                x: 5,
                y: 6
            },

            {
                type: "lamp",
                x: 9,
                y: 6
            },

            {
                type: "lamp",
                x: 13,
                y: 6
            },

            {
                type: "bench",
                x: 7,
                y: 3
            },

            {
                type: "bin",
                x: 6,
                y: 5
            }
        ];


        props.forEach(
            prop => {

                const position =
                    this.gridToScreen(
                        prop.x,
                        prop.y
                    );


                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    `map-prop-v04 prop-${prop.type}-v04`;


                element.style.left =
                    `${position.x}px`;

                element.style.top =
                    `${position.y}px`;


                layer.appendChild(
                    element
                );
            }
        );
    }


    // ========================================================
    // SIGNS
    // ========================================================

    renderSigns(mapData) {

        const layer =
            document.createElement(
                "div"
            );


        layer.className =
            "map-signs-layer-v04";


        this.root.appendChild(
            layer
        );


        Object.values(
            mapData.buildings ?? {}
        )
        .filter(
            building =>
                building.type === "shop"
        )
        .forEach(
            building => {

                const map =
                    building.map;


                const position =
                    this.gridToScreen(
                        map.x,
                        map.y
                    );


                const sign =
                    document.createElement(
                        "div"
                    );


                sign.className =
                    "map-billboard-v04";


                sign.textContent =
                    building.name
                    .toUpperCase();


                sign.style.left =
                    `${position.x}px`;

                sign.style.top =
                    `${position.y - 45}px`;


                layer.appendChild(
                    sign
                );
            }
        );
    }


    // ========================================================
    // ENVIRONMENT
    // ========================================================

    renderEnvironment(environment) {

        const layer =
            document.createElement(
                "div"
            );


        layer.className =
            "map-environment-layer-v04";


        this.root.appendChild(
            layer
        );


        if (
            environment.lighting ===
            "day"
        ) {

            layer.classList.add(
                "environment-day-v04"
            );
        }


        if (
            environment.weather ===
            "clear"
        ) {

            layer.classList.add(
                "environment-clear-v04"
            );
        }
    }


    // ========================================================
    // CITY LABEL
    // ========================================================

    renderCityLabel() {

        const label =
            document.createElement(
                "div"
            );


        label.className =
            "map-city-label-v04";


        label.innerHTML =
            `
            <strong>FFS CITY</strong>
            <span>1996 • LIVING WORLD</span>
            `;


        this.root.appendChild(
            label
        );
    }


    // ========================================================
    // GRID
    // ========================================================

    gridToScreen(
        x,
        y
    ) {

        const centerX =
            this.getMapPixelWidth()
            / 2;


        return {

            x:
                centerX +
                (
                    x - y
                ) *
                (
                    this.tileWidth / 2
                ),

            y:
                100 +
                (
                    x + y
                ) *
                (
                    this.tileHeight / 2
                )
        };
    }


    // ========================================================
    // DIMENSIONS
    // ========================================================

    getMapPixelWidth() {

        return (
            (
                this.mapWidth +
                this.mapHeight
            ) *
            (
                this.tileWidth / 2
            )
        ) + 160;
    }


    getMapPixelHeight() {

        return (
            (
                this.mapWidth +
                this.mapHeight
            ) *
            (
                this.tileHeight / 2
            )
        ) + 220;
    }


    // ========================================================
    // EMPTY
    // ========================================================

    renderEmpty(message) {

        const empty =
            document.createElement(
                "div"
            );


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
