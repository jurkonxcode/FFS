// ============================================================
// FFS - MAIN
// Founder Fantasy Simulator
// ============================================================

import ID from "./i18n/id.js";
import EN from "./i18n/en.js";

import REAL_WORLD_DATA
    from "./data/real_world/index.js";

import { WorldEngine }
    from "./engine/world/WorldEngine.js";

import { MapEngine }
    from "./engine/map/MapEngine.js";

import { MapRenderer }
    from "./engine/map/MapRenderer.js";


// ============================================================
// FFS CONFIGURATION
// ============================================================

const FFS_CONFIG = {

    realWorldStart:
        "2026-08-29T00:00:00Z",

    ffsWorldStart:
        "1996-08-29T00:00:00Z",

    ffsTimeMultiplier: 24

};


// ============================================================
// LANGUAGE SYSTEM
// ============================================================

const FFS_LANGUAGE = {

    current: "id",

    dictionaries: {
        id: ID,
        en: EN
    }

};


function t(path) {

    const dictionary =
        FFS_LANGUAGE
            .dictionaries[
                FFS_LANGUAGE.current
            ];

    if (!dictionary) {
        return path;
    }

    const parts =
        path.split(".");

    let value =
        dictionary;

    for (const part of parts) {

        if (
            value &&
            Object.prototype.hasOwnProperty.call(
                value,
                part
            )
        ) {

            value =
                value[part];

        } else {

            return path;

        }

    }

    return value;

}


// ============================================================
// FFS TIME SYSTEM
// ============================================================

const FFS_TIME = {

    realWorldStart:
        new Date(
            FFS_CONFIG.realWorldStart
        ),

    ffsWorldStart:
        new Date(
            FFS_CONFIG.ffsWorldStart
        ),

    currentRealWorldTime:
        null,

    currentFFSWorldTime:
        null

};


// ============================================================
// UPDATE FFS TIME
// ============================================================

function updateFFSTime() {

    const now =
        new Date();


    // --------------------------------------------------------
    // REAL WORLD TIME
    // --------------------------------------------------------

    FFS_TIME.currentRealWorldTime =
        now;


    // --------------------------------------------------------
    // CALCULATE ELAPSED REAL TIME
    // --------------------------------------------------------

    const elapsedRealMilliseconds =
        now.getTime() -
        FFS_TIME
            .realWorldStart
            .getTime();


    // --------------------------------------------------------
    // CONVERT REAL TIME TO FFS TIME
    // --------------------------------------------------------

    const elapsedFFSMilliseconds =
        elapsedRealMilliseconds *
        FFS_CONFIG
            .ffsTimeMultiplier;


    // --------------------------------------------------------
    // CURRENT FFS WORLD TIME
    // --------------------------------------------------------

    FFS_TIME.currentFFSWorldTime =
        new Date(
            FFS_TIME
                .ffsWorldStart
                .getTime() +
            elapsedFFSMilliseconds
        );


    // --------------------------------------------------------
    // UPDATE UI
    // --------------------------------------------------------

    updateTimeUI();

}


// ============================================================
// FORMAT DATE + TIME
// ============================================================

function formatDateTime(
    date,
    language = FFS_LANGUAGE.current
) {

    if (
        !(date instanceof Date) ||
        isNaN(date.getTime())
    ) {

        return "-";

    }


    const locale =
        language === "en"
            ? "en-GB"
            : "id-ID";


    return new Intl.DateTimeFormat(
        locale,
        {

            day: "2-digit",

            month: "long",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit",

            hour12: false

        }
    ).format(date);

}


// ============================================================
// UPDATE TIME UI
// ============================================================

function updateTimeUI() {

    const realWorldElement =
        document.getElementById(
            "real-world-time"
        );


    const ffsWorldElement =
        document.getElementById(
            "ffs-world-time"
        );


    if (realWorldElement) {

        realWorldElement.textContent =
            formatDateTime(
                FFS_TIME
                    .currentRealWorldTime
            );

    }


    if (ffsWorldElement) {

        ffsWorldElement.textContent =
            formatDateTime(
                FFS_TIME
                    .currentFFSWorldTime
            );

    }

}


// ============================================================
// LANGUAGE UI
// ============================================================

function updateLanguageUI() {

    const titleElement =
        document.getElementById(
            "app-title"
        );


    const realWorldLabel =
        document.getElementById(
            "real-world-label"
        );


    const ffsWorldLabel =
        document.getElementById(
            "ffs-world-label"
        );


    const worldDescription =
        document.getElementById(
            "world-description"
        );


    const indonesiaButton =
        document.getElementById(
            "language-id"
        );


    const englishButton =
        document.getElementById(
            "language-en"
        );


    if (titleElement) {

        titleElement.textContent =
            t("app.title");

    }


    if (realWorldLabel) {

        realWorldLabel.textContent =
            t("time.realWorld");

    }


    if (ffsWorldLabel) {

        ffsWorldLabel.textContent =
            t("time.ffsWorld");

    }


    if (worldDescription) {

        worldDescription.textContent =
            t("system.worldDescription");

    }


    if (indonesiaButton) {

        indonesiaButton.textContent =
            t("language.indonesia");

    }


    if (englishButton) {

        englishButton.textContent =
            t("language.english");

    }


    updateTimeUI();

}


// ============================================================
// CHANGE LANGUAGE
// ============================================================

function setLanguage(language) {

    if (
        !FFS_LANGUAGE
            .dictionaries[language]
    ) {

        console.warn(
            `[FFS] Language "${language}" is not available.`
        );

        return;

    }


    FFS_LANGUAGE.current =
        language;


    updateLanguageUI();


    console.log(
        `[FFS] Language changed to: ${language}`
    );

}


// ============================================================
// LANGUAGE BUTTONS
// ============================================================

function setupLanguageButtons() {

    const indonesiaButton =
        document.getElementById(
            "language-id"
        );


    const englishButton =
        document.getElementById(
            "language-en"
        );


    if (indonesiaButton) {

        indonesiaButton.addEventListener(
            "click",
            () => setLanguage("id")
        );

    }


    if (englishButton) {

        englishButton.addEventListener(
            "click",
            () => setLanguage("en")
        );

    }

}


// ============================================================
// ENGINE REFERENCES
// ============================================================

let WORLD_ENGINE = null;

let WORLD_STATE = null;

let MAP_ENGINE = null;

let MAP_RENDERER = null;


// ============================================================
// INITIALIZE WORLD ENGINE
// ============================================================

function initializeWorldEngine() {

    console.log(
        "[FFS] Starting World Engine..."
    );


    WORLD_ENGINE =
        new WorldEngine(
            REAL_WORLD_DATA
        );


    WORLD_STATE =
        WORLD_ENGINE.initialize();


    console.log(
        "[FFS] World State:",
        WORLD_STATE
    );


    return WORLD_STATE;

}


// ============================================================
// INITIALIZE MAP ENGINE
// ============================================================

function initializeMapEngine() {

    if (!WORLD_STATE) {

        console.warn(
            "[FFS] World State is not available."
        );

        return;

    }


    console.log(
        "[FFS] Starting Map Engine..."
    );


    MAP_ENGINE =
        new MapEngine(
            WORLD_STATE
        );


    const map =
        MAP_ENGINE.initialize();


    MAP_RENDERER =
        new MapRenderer(
            "ffs-map-container"
        );


    MAP_RENDERER.render(
        map
    );


    console.log(
        "[FFS] Map Summary:",
        MAP_ENGINE.getMapSummary()
    );

}


// ============================================================
// WORLD INFORMATION LOG
// ============================================================

function logWorldInformation() {

    if (!WORLD_ENGINE) {

        console.warn(
            "[FFS] World Engine has not been initialized."
        );

        return;

    }


    const world =
        WORLD_STATE?.world;


    console.log(
        "========================================"
    );


    console.log(
        "[FFS] WORLD ENGINE"
    );


    console.log(
        "========================================"
    );


    console.log(
        "[FFS] World:",
        world
    );


    console.log(
        "[FFS] Regions:",
        WORLD_STATE?.regions
    );


    console.log(
        "[FFS] Cities / Locations:",
        WORLD_STATE?.locations
    );


    console.log(
        "[FFS] Terrain:",
        WORLD_STATE?.terrain
    );


    console.log(
        "[FFS] Roads:",
        WORLD_STATE?.roads
    );


    console.log(
        "[FFS] Buildings:",
        WORLD_STATE?.buildings
    );


    console.log(
        "[FFS] Environment:",
        WORLD_STATE?.environment
    );


    console.log(
        "[FFS] NPC Count:",
        Object.keys(
            WORLD_STATE?.npcs ?? {}
        ).length
    );


    console.log(
        "[FFS] Player Count:",
        Object.keys(
            WORLD_STATE?.players ?? {}
        ).length
    );


    if (
        typeof WORLD_ENGINE.getWorldSummary ===
        "function"
    ) {

        console.log(
            "[FFS] World Summary:",
            WORLD_ENGINE
                .getWorldSummary()
        );

    }


    console.log(
        "========================================"
    );

}


// ============================================================
// INITIALIZE FFS
// ============================================================

function initializeFFS() {

    console.log(
        "========================================"
    );


    console.log(
        "Founder Fantasy Simulator"
    );


    console.log(
        "Initializing FFS..."
    );


    console.log(
        "========================================"
    );


    // --------------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------------

    setupLanguageButtons();

    updateLanguageUI();


    // --------------------------------------------------------
    // TIME
    // --------------------------------------------------------

    updateFFSTime();


    // --------------------------------------------------------
    // WORLD
    // --------------------------------------------------------

    initializeWorldEngine();


    // --------------------------------------------------------
    // MAP
    // --------------------------------------------------------

    initializeMapEngine();


    // --------------------------------------------------------
    // DEBUG INFORMATION
    // --------------------------------------------------------

    logWorldInformation();


    // --------------------------------------------------------
    // REAL-TIME CLOCK
    // --------------------------------------------------------

    setInterval(
        updateFFSTime,
        1000
    );


    console.log(
        "[FFS] Initialization complete."
    );

}


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeFFS
);
