// ============================================================
// FFS - FOUNDER FANTASY SIMULATOR
// MAP RENDERER
// Visual Proof v0.1
// ============================================================

export class MapRenderer {

    constructor(containerId) {

        this.container =
            document.getElementById(containerId);

        if (!this.container) {

            throw new Error(
                `[FFS] Map container "${containerId}" tidak ditemukan.`
            );
        }

        this.tileWidth = 72;
        this.tileHeight = 36;
        this.buildingDepth = 52;
    }


    // ========================================================
    // MAIN RENDER
    // ========================================================

    render(mapData = {}) {

        this.container.innerHTML = "";

        this.container.className =
            "ffs-map-renderer";

        const terrain =
            mapData.terrain || {
                width: 16,
                height: 12
            };

        const roads =
            mapData.roads || [];

        const buildings =
            mapData.buildings || {};

        const environment =
            mapData.environment || {};


        const mapWidth =
            terrain.width * this.tileWidth;

        const mapHeight =
            terrain.height * this.tileHeight;


        const world =
            document.createElement("div");

        world.className =
            "ffs-map-world";

        world.style.width =
            `${mapWidth + 500}px`;

        world.style.height =
            `${mapHeight + 420}px`;


        this.container.appendChild(world);


        this.renderTerrain(
            world,
            terrain
        );


        this.renderRoads(
            world,
            roads
        );


        this.renderBuildings(
            world,
            buildings
        );


        this.renderTrees(
            world,
            terrain
        );


        this.renderProps(
            world,
            roads,
            terrain
        );


        this.renderVehicles(
            world,
            roads
        );


        this.renderSigns(
            world,
            buildings
        );


        this.renderDistrictLabels(
            world
        );


        this.renderEnvironment(
            world,
            environment
        );


        this.renderCityTitle(
            world
        );
    }


    // ========================================================
    // ISOMETRIC POSITION
    // ========================================================

    gridToScreen(x, y) {

        const centerX =
            250;

        const topY =
            80;

        return {

            x:
                centerX +
                (x - y) *
                (this.tileWidth / 2),

            y:
                topY +
                (x + y) *
                (this.tileHeight / 2)
        };
    }


    // ========================================================
    // TERRAIN
    // ========================================================

    renderTerrain(
        world,
        terrain
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-terrain-layer";

        world.appendChild(layer);


        for (
            let y = 0;
            y < terrain.height;
            y++
        ) {

            for (
                let x = 0;
                x < terrain.width;
                x++
            ) {

                const position =
                    this.gridToScreen(x, y);


                const tile =
                    document.createElement("div");

                tile.className =
                    "ffs-terrain-tile";


                if (
                    (x + y) % 5 === 0
                ) {

                    tile.classList.add(
                        "terrain-variation"
                    );
                }


                tile.style.left =
                    `${position.x}px`;

                tile.style.top =
                    `${position.y}px`;


                layer.appendChild(tile);
            }
        }
    }


    // ========================================================
    // ROADS
    // ========================================================

    renderRoads(
        world,
        roads
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-road-layer";

        world.appendChild(layer);


        roads.forEach(
            (road, index) => {

                const map =
                    road.map || {};

                const x =
                    map.x ?? 1;

                const y =
                    map.y ?? 6;

                const width =
                    map.width ?? 8;

                const direction =
                    map.direction ||
                    "horizontal";


                const position =
                    this.gridToScreen(
                        x,
                        y
                    );


                const roadElement =
                    document.createElement("div");

                roadElement.className =
                    "ffs-road";


                roadElement.classList.add(
                    direction === "vertical"
                        ? "road-vertical"
                        : "road-horizontal"
                );


                roadElement.style.left =
                    `${position.x}px`;

                roadElement.style.top =
                    `${position.y}px`;


                roadElement.style.width =
                    `${Math.max(
                        180,
                        width * 58
                    )}px`;


                roadElement.style.zIndex =
                    20 + index;


                layer.appendChild(
                    roadElement
                );


                const sidewalk =
                    document.createElement("div");

                sidewalk.className =
                    "ffs-sidewalk";


                sidewalk.style.left =
                    `${position.x - 8}px`;

                sidewalk.style.top =
                    `${position.y - 8}px`;


                sidewalk.style.width =
                    `${Math.max(
                        200,
                        width * 58 + 16
                    )}px`;


                layer.appendChild(
                    sidewalk
                );
            }
        );
    }


    // ========================================================
    // BUILDINGS
    // ========================================================

    renderBuildings(
        world,
        buildings
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-building-layer";

        world.appendChild(layer);


        const buildingList =
            Array.isArray(buildings)
                ? buildings
                : Object.values(buildings);


        buildingList
            .sort(
                (a, b) => {

                    const ay =
                        (a.map?.x || 0) +
                        (a.map?.y || 0);

                    const by =
                        (b.map?.x || 0) +
                        (b.map?.y || 0);

                    return ay - by;
                }
            )
            .forEach(
                building => {

                    this.createBuilding(
                        layer,
                        building
                    );
                }
            );
    }


    createBuilding(
        layer,
        building
    ) {

        const map =
            building.map || {};

        const x =
            map.x ?? 3;

        const y =
            map.y ?? 3;

        const width =
            map.width ?? 2;

        const height =
            map.height ?? 2;


        const position =
            this.gridToScreen(
                x,
                y
            );


        const type =
            this.getBuildingType(
                building
            );


        const element =
            document.createElement("div");

        element.className =
            "ffs-building";

        element.classList.add(
            `building-${type}`
        );


        element.style.left =
            `${position.x}px`;

        element.style.top =
            `${position.y}px`;


        const buildingWidth =
            Math.max(
                82,
                width * 42
            );


        const buildingHeight =
            Math.max(
                64,
                height * 38
            );


        const floors =
            type === "cbd"
                ? 7
                : type === "commercial"
                    ? 3
                    : 2;


        const totalHeight =
            buildingHeight +
            floors * 13;


        element.style.width =
            `${buildingWidth}px`;

        element.style.height =
            `${totalHeight}px`;


        element.style.zIndex =
            100 +
            Math.floor(
                (x + y) * 3
            );


        // ----------------------------------------------------
        // Shadow
        // ----------------------------------------------------

        const shadow =
            document.createElement("div");

        shadow.className =
            "building-shadow";

        element.appendChild(
            shadow
        );


        // ----------------------------------------------------
        // Main body
        // ----------------------------------------------------

        const body =
            document.createElement("div");

        body.className =
            "building-body";

        element.appendChild(
            body
        );


        // ----------------------------------------------------
        // Side
        // ----------------------------------------------------

        const side =
            document.createElement("div");

        side.className =
            "building-side";

        element.appendChild(
            side
        );


        // ----------------------------------------------------
        // Roof
        // ----------------------------------------------------

        const roof =
            document.createElement("div");

        roof.className =
            "building-roof";

        element.appendChild(
            roof
        );


        // ----------------------------------------------------
        // Windows
        // ----------------------------------------------------

        if (
            type !== "park"
        ) {

            this.createWindows(
                body,
                type,
                floors
            );
        }


        // ----------------------------------------------------
        // Door
        // ----------------------------------------------------

        if (
            type !== "cbd"
        ) {

            const door =
                document.createElement("div");

            door.className =
                "building-door";

            body.appendChild(
                door
            );
        }


        // ----------------------------------------------------
        // Label
        // ----------------------------------------------------

        const label =
            document.createElement("div");

        label.className =
            "building-label";

        label.textContent =
            building.name ||
            building.id ||
            "BUILDING";

        element.appendChild(
            label
        );


        layer.appendChild(
            element
        );
    }


    // ========================================================
    // BUILDING TYPE
    // ========================================================

    getBuildingType(
        building
    ) {

        const id =
            String(
                building.id ||
                ""
            ).toLowerCase();


        const name =
            String(
                building.name ||
                ""
            ).toLowerCase();


        const combined =
            `${id} ${name}`;


        if (
            combined.includes("cbd") ||
            combined.includes("tower") ||
            combined.includes("office")
        ) {

            return "cbd";
        }


        if (
            combined.includes("shop") ||
            combined.includes("store") ||
            combined.includes("mall") ||
            combined.includes("commercial")
        ) {

            return "commercial";
        }


        if (
            combined.includes("park")
        ) {

            return "park";
        }


        if (
            combined.includes("concrete")
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
        floors
    ) {

        const columns =
            type === "cbd"
                ? 4
                : 3;


        for (
            let floor = 0;
            floor < floors;
            floor++
        ) {

            for (
                let column = 0;
                column < columns;
                column++
            ) {

                const window =
                    document.createElement("span");

                window.className =
                    "building-window";


                if (
                    type === "cbd"
                ) {

                    window.classList.add(
                        "window-glass"
                    );
                }


                window.style.left =
                    `${12 + column * 21}px`;

                window.style.top =
                    `${10 + floor * 14}px`;


                body.appendChild(
                    window
                );
            }
        }
    }


    // ========================================================
    // TREES
    // ========================================================

    renderTrees(
        world,
        terrain
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-tree-layer";

        world.appendChild(
            layer
        );


        const trees = [
            [5, 2],
            [6, 2],
            [7, 2],
            [5, 3],
            [7, 3],
            [2, 4],
            [13, 4],
            [2, 9],
            [13, 9],
            [4, 10],
            [10, 10]
        ];


        trees.forEach(
            ([x, y], index) => {

                if (
                    x >= terrain.width ||
                    y >= terrain.height
                ) {
                    return;
                }


                const position =
                    this.gridToScreen(
                        x,
                        y
                    );


                const tree =
                    document.createElement("div");

                tree.className =
                    "ffs-tree";


                tree.style.left =
                    `${position.x}px`;

                tree.style.top =
                    `${position.y}px`;


                if (
                    index % 3 === 0
                ) {

                    tree.classList.add(
                        "tree-large"
                    );
                }


                layer.appendChild(
                    tree
                );
            }
        );
    }


    // ========================================================
    // PROPS
    // ========================================================

    renderProps(
        world,
        roads,
        terrain
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-prop-layer";

        world.appendChild(
            layer
        );


        const props = [
            ["lamp", 4, 5],
            ["lamp", 12, 5],
            ["lamp", 5, 7],
            ["lamp", 12, 7],
            ["bench", 6, 2],
            ["bench", 7, 2],
            ["bin", 5, 3],
            ["bin", 7, 3]
        ];


        props.forEach(
            ([type, x, y]) => {

                const position =
                    this.gridToScreen(
                        x,
                        y
                    );


                const prop =
                    document.createElement("div");

                prop.className =
                    `ffs-prop prop-${type}`;


                prop.style.left =
                    `${position.x}px`;

                prop.style.top =
                    `${position.y}px`;


                layer.appendChild(
                    prop
                );
            }
        );
    }


    // ========================================================
    // VEHICLES
    // ========================================================

    renderVehicles(
        world,
        roads
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-vehicle-layer";

        world.appendChild(
            layer
        );


        const vehicles = [
            ["sedan", 4, 6],
            ["wagon", 7, 6],
            ["sedan", 10, 6],
            ["van", 13, 6]
        ];


        vehicles.forEach(
            ([type, x, y]) => {

                const position =
                    this.gridToScreen(
                        x,
                        y
                    );


                const vehicle =
                    document.createElement("div");

                vehicle.className =
                    `ffs-vehicle vehicle-${type}`;


                vehicle.style.left =
                    `${position.x}px`;

                vehicle.style.top =
                    `${position.y - 10}px`;


                layer.appendChild(
                    vehicle
                );
            }
        );
    }


    // ========================================================
    // SIGNS
    // ========================================================

    renderSigns(
        world,
        buildings
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-sign-layer";

        world.appendChild(
            layer
        );


        const buildingList =
            Array.isArray(buildings)
                ? buildings
                : Object.values(buildings);


        buildingList.forEach(
            building => {

                const type =
                    this.getBuildingType(
                        building
                    );


                if (
                    type !== "commercial"
                ) {

                    return;
                }


                const map =
                    building.map || {};


                const position =
                    this.gridToScreen(
                        map.x ?? 4,
                        map.y ?? 6
                    );


                const sign =
                    document.createElement("div");

                sign.className =
                    "ffs-sign";

                sign.textContent =
                    building.name ||
                    "SHOP";


                sign.style.left =
                    `${position.x + 18}px`;

                sign.style.top =
                    `${position.y - 18}px`;


                layer.appendChild(
                    sign
                );
            }
        );
    }


    // ========================================================
    // DISTRICT LABELS
    // ========================================================

    renderDistrictLabels(
        world
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-district-layer";

        world.appendChild(
            layer
        );


        const districts = [
            ["RESIDENTIAL", 3, 1],
            ["CENTRAL PARK", 6, 1],
            ["COMMERCIAL", 4, 5],
            ["CBD", 8, 3]
        ];


        districts.forEach(
            ([name, x, y]) => {

                const position =
                    this.gridToScreen(
                        x,
                        y
                    );


                const label =
                    document.createElement("div");

                label.className =
                    "ffs-district-label";

                label.textContent =
                    name;


                label.style.left =
                    `${position.x}px`;

                label.style.top =
                    `${position.y}px`;


                layer.appendChild(
                    label
                );
            }
        );
    }


    // ========================================================
    // ENVIRONMENT
    // ========================================================

    renderEnvironment(
        world,
        environment
    ) {

        const layer =
            document.createElement("div");

        layer.className =
            "ffs-map-layer ffs-environment-layer";

        world.appendChild(
            layer
        );


        const atmosphere =
            document.createElement("div");

        atmosphere.className =
            "ffs-1996-atmosphere";


        layer.appendChild(
            atmosphere
        );


        const eraLabel =
            document.createElement("div");

        eraLabel.className =
            "ffs-era-label";

        eraLabel.textContent =
            `FFS WORLD • ${
                environment.era || 1996
            }`;


        layer.appendChild(
            eraLabel
        );
    }


    // ========================================================
    // CITY TITLE
    // ========================================================

    renderCityTitle(
        world
    ) {

        const title =
            document.createElement("div");

        title.className =
            "ffs-city-title";

        title.textContent =
            "FFS CITY";


        const subtitle =
            document.createElement("div");

        subtitle.className =
            "ffs-city-subtitle";

        subtitle.textContent =
            "LIVING WORLD • 1996";


        title.appendChild(
            subtitle
        );


        world.appendChild(
            title
        );
    }
    }
