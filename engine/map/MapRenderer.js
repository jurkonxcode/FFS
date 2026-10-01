// ============================================================
// FFS - MAP RENDERER v0.6
// Visual Proof v0.2
// Spatial Alignment Pass
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
        // ISOMETRIC GEOMETRY
        // ====================================================

        this.tileWidth = 72;
        this.tileHeight = 36;

        // Visual vertical depth of buildings
        this.buildingDepth = 52;

        // ====================================================
        // RENDERING LAYERS
        // ====================================================

        this.layers = {};

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


        this.container.innerHTML = "";


        const renderer =
            document.createElement("div");

        renderer.className =
            "ffs-map-renderer";


        const world =
            document.createElement("div");

        world.className =
            "ffs-map-world";


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
            layer => world.appendChild(layer)
        );


        renderer.appendChild(world);

        this.container.appendChild(
            renderer
        );


        // ====================================================
        // WORLD LAYERS
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
    // GRID → SCREEN
    // ========================================================

    gridToScreen(x, y) {

        return {

            left:
                (x - y) *
                (this.tileWidth / 2),

            top:
                (x + y) *
                (this.tileHeight / 2)

        };

    }


    // ========================================================
    // FOOTPRINT CENTER → SCREEN
    // ========================================================

    footprintToScreen(
        x,
        y,
        width = 1,
        height = 1
    ) {

        return this.gridToScreen(
            x + width / 2,
            y + height / 2
        );

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

                const position =
                    this.gridToScreen(
                        x,
                        y
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


                this.layers
                    .terrain
                    .appendChild(tile);

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
                        this.gridToScreen(
                            tileX,
                            tileY
                        );


                    // =================================================
                    // SIDEWALK
                    // =================================================

                    const sidewalk =
                        document.createElement("div");


                    sidewalk.className =
                        "ffs-sidewalk";


                    sidewalk.style.left =
                        `${position.left}px`;

                    sidewalk.style.top =
                        `${position.top}px`;


                    if (
                        direction === "vertical"
                    ) {

                        sidewalk.classList.add(
                            "road-direction-y"
                        );

                    } else {

                        sidewalk.classList.add(
                            "road-direction-x"
                        );

                    }


                    this.layers
                        .sidewalks
                        .appendChild(
                            sidewalk
                        );


                    // =================================================
                    // ROAD
                    // =================================================

                    const roadElement =
                        document.createElement("div");


                    roadElement.className =
                        "ffs-road";


                    roadElement.style.left =
                        `${position.left}px`;

                    roadElement.style.top =
                        `${position.top}px`;


                    if (
                        direction === "vertical"
                    ) {

                        roadElement.classList.add(
                            "road-direction-y"
                        );

                    } else {

                        roadElement.classList.add(
                            "road-direction-x"
                        );

                    }


                    // =================================================
                    // ROAD MARKING
                    // =================================================

                    const marking =
                        document.createElement("div");


                    marking.className =
                        "ffs-road-marking";


                    if (
                        direction === "vertical"
                    ) {

                        marking.classList.add(
                            "marking-direction-y"
                        );

                    } else {

                        marking.classList.add(
                            "marking-direction-x"
                        );

                    }


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

                    const aX =
                        a.map?.x ?? 0;

                    const aY =
                        a.map?.y ?? 0;

                    const aW =
                        a.map?.width ?? 1;

                    const aH =
                        a.map?.height ?? 1;


                    const bX =
                        b.map?.x ?? 0;

                    const bY =
                        b.map?.y ?? 0;

                    const bW =
                        b.map?.width ?? 1;

                    const bH =
                        b.map?.height ?? 1;


                    const aDepth =
                        aX +
                        aY +
                        aW +
                        aH;


                    const bDepth =
                        bX +
                        bY +
                        bW +
                        bH;


                    return aDepth - bDepth;

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


        // ====================================================
        // IMPORTANT:
        // Position building using the CENTER of its
        // spatial footprint rather than its top-left corner.
        // ====================================================

        const position =
            this.footprintToScreen(
                x,
                y,
                width,
                height
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


        // ====================================================
        // VISUAL FOOTPRINT
        // ====================================================

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
                    this.gridToScreen(
                        x,
                        y
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
                    this.gridToScreen(
                        prop.x,
                        prop.y
                    );


                const element =
                    document.createElement("div");


                element.className =
                    `ffs-prop prop-${prop.type}`;


                element.style.left =
                    `${position.left}px`;

                element.style.top =
                    `${position.top}px`;


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
                    this.gridToScreen(
                        vehicle.x,
                        vehicle.y
                    );


                const element =
                    document.createElement("div");


                element.className =
                    `ffs-vehicle vehicle-${vehicle.type}`;


                element.style.left =
                    `${position.left}px`;

                element.style.top =
                    `${position.top}px`;


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
                    this.gridToScreen(
                        sign.x,
                        sign.y
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
                    this.gridToScreen(
                        district.x,
                        district.y
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
