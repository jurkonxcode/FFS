// ============================================================
// FFS - MAP RENDERER v0.1
// Lightweight prototype renderer.
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
            document.createElement("div");


        mapRoot.className =
            "ffs-map";


        // ----------------------------------------------------
        // CITY
        // ----------------------------------------------------

        const city =
            map.cities?.[0];


        if (city) {

            const cityElement =
                document.createElement("div");


            cityElement.className =
                "map-city";


            cityElement.textContent =
                city.name;


            mapRoot.appendChild(
                cityElement
            );
        }


        // ----------------------------------------------------
        // PARK
        // ----------------------------------------------------

        const park =
            map.buildings?.find(
                building =>
                    building.type === "park"
            );


        if (park) {

            const parkElement =
                document.createElement("div");


            parkElement.className =
                "map-object map-park";


            parkElement.innerHTML =
                `
                    <div class="object-icon">🌳</div>
                    <div class="object-label">
                        ${park.name}
                    </div>
                `;


            mapRoot.appendChild(
                parkElement
            );
        }


        // ----------------------------------------------------
        // HOUSE
        // ----------------------------------------------------

        const house =
            map.buildings?.find(
                building =>
                    building.type === "house"
            );


        if (house) {

            const houseElement =
                document.createElement("div");


            houseElement.className =
                "map-object map-house";


            houseElement.innerHTML =
                `
                    <div class="object-icon">🏠</div>
                    <div class="object-label">
                        ${house.name}
                    </div>
                `;


            mapRoot.appendChild(
                houseElement
            );
        }


        // ----------------------------------------------------
        // SHOP
        // ----------------------------------------------------

        const shop =
            map.buildings?.find(
                building =>
                    building.type === "shop"
            );


        if (shop) {

            const shopElement =
                document.createElement("div");


            shopElement.className =
                "map-object map-shop";


            shopElement.innerHTML =
                `
                    <div class="object-icon">🏪</div>
                    <div class="object-label">
                        ${shop.name}
                    </div>
                `;


            mapRoot.appendChild(
                shopElement
            );
        }


        // ----------------------------------------------------
        // ROAD
        // ----------------------------------------------------

        const road =
            map.roads?.[0];


        if (road) {

            const roadElement =
                document.createElement("div");


            roadElement.className =
                "map-road";


            roadElement.innerHTML =
                `
                    <div class="road-line"></div>
                    <div class="road-label">
                        ${road.name}
                    </div>
                `;


            mapRoot.appendChild(
                roadElement
            );
        }


        this.container.appendChild(
            mapRoot
        );


        console.log(
            "[MapRenderer] Map rendered."
        );
    }
}
