// ============================================================
// FFS - MAP RENDERER v0.2
// Lightweight isometric world renderer.
// ============================================================


export class MapRenderer {


    constructor(containerId) {

        this.container =
            document.getElementById(
                containerId
            );


        if (!this.container) {

            throw new Error(
                `[MapRenderer] Container "${containerId}" not found.`
            );
        }


        this.tileWidth =
            72;


        this.tileHeight =
            36;


        this.mapScale =
            1;
    }


    // ========================================================
    // RENDER MAP
    // ========================================================

    render(map) {

        if (!map) {

            console.warn(
                "[MapRenderer] Map data is empty."
            );

            return;
        }


        this.container.innerHTML = "";


        const mapRoot =
            document.createElement(
                "div"
            );


        mapRoot.className =
            "ffs-map-v02";


        // ----------------------------------------------------
        // TERRAIN
        // ----------------------------------------------------

        this.renderTerrain(
            mapRoot,
            map
        );


        // ----------------------------------------------------
        // ROAD
        // ----------------------------------------------------

        this.renderRoads(
            mapRoot,
            map
        );


        // ----------------------------------------------------
        // BUILDINGS
        // ----------------------------------------------------

        this.renderBuildings(
            mapRoot,
            map
        );


        // ----------------------------------------------------
        // CITY LABEL
        // ----------------------------------------------------

        this.renderCityLabel(
            mapRoot,
            map
        );


        this.container.appendChild(
            mapRoot
        );


        console.log(
            "[MapRenderer] Map v0.2 rendered."
        );
    }


    // ========================================================
    // TERRAIN
    // ========================================================

    renderTerrain(
        root,
        map
    ) {

        const width =
            map.terrain?.width
            ?? 12;


        const height =
            map.terrain?.height
            ?? 9;


        const terrainLayer =
            document.createElement(
                "div"
            );


        terrainLayer.className =
            "map-terrain-layer";


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

                const tile =
                    document.createElement(
                        "div"
                    );


                tile.className =
                    "map-tile";


                tile.style.left =
                    `${x * this.tileWidth / 2}px`;


                tile.style.top =
                    `${y * this.tileHeight / 2}px`;


                tile.style.transform =
                    `
                    translate(
                        ${y * this.tileWidth / 2}px,
                        ${x * this.tileHeight / 2}px
                    )
                    `;


                tile.dataset.x =
                    x;


                tile.dataset.y =
                    y;


                terrainLayer.appendChild(
                    tile
                );
            }
        }


        root.appendChild(
            terrainLayer
        );
    }


    // ========================================================
    // ROAD
    // ========================================================

    renderRoads(
        root,
        map
    ) {

        const roads =
            map.roads
            ?? [];


        roads.forEach(
            road => {

                const roadElement =
                    document.createElement(
                        "div"
                    );


                roadElement.className =
                    "map-road-v02";


                const x =
                    road.map?.x
                    ?? 0;


                const y =
                    road.map?.y
                    ?? 0;


                const width =
                    road.map?.width
                    ?? 1;


                roadElement.style.left =
                    `${x * this.tileWidth / 2}px`;


                roadElement.style.top =
                    `${y * this.tileHeight / 2}px`;


                roadElement.style.width =
                    `${width * this.tileWidth}px`;


                root.appendChild(
                    roadElement
                );
            }
        );
    }


    // ========================================================
    // BUILDINGS
    // ========================================================

    renderBuildings(
        root,
        map
    ) {

        const buildings =
            map.buildings
            ?? [];


        buildings.forEach(
            building => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    `map-building-v02 map-${building.type}`;


                const x =
                    building.map?.x
                    ?? 0;


                const y =
                    building.map?.y
                    ?? 0;


                element.style.left =
                    `${x * this.tileWidth / 2}px`;


                element.style.top =
                    `${y * this.tileHeight / 2}px`;


                const icon =
                    this.getBuildingIcon(
                        building.type
                    );


                element.innerHTML =
                    `
                    <div class="building-icon">
                        ${icon}
                    </div>

                    <div class="building-label">
                        ${building.name}
                    </div>
                    `;


                root.appendChild(
                    element
                );
            }
        );
    }


    // ========================================================
    // BUILDING ICON
    // ========================================================

    getBuildingIcon(
        type
    ) {

        switch (type) {

            case "house":

                return "🏠";


            case "shop":

                return "🏪";


            case "park":

                return "🌳";


            default:

                return "🏢";
        }
    }


    // ========================================================
    // CITY LABEL
    // ========================================================

    renderCityLabel(
        root,
        map
    ) {

        const city =
            map.cities?.[0];


        if (!city) {

            return;
        }


        const label =
            document.createElement(
                "div"
            );


        label.className =
            "map-city-label-v02";


        label.textContent =
            city.name;


        root.appendChild(
            label
        );
    }
}
