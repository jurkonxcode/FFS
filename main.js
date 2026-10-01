const FFS_CONFIG = {
    realWorldStart: "2026-08-29T00:00:00Z",
    ffsWorldStart: "1996-08-29T00:00:00Z",
    ffsTimeMultiplier: 24
};
/* =========================================================
   FOUNDER FANTASY SIMULATOR
   MAIN APPLICATION
   ========================================================= */


/* =========================================================
   FFS CONFIGURATION
   ========================================================= */

const FFS_CONFIG = {

    /*
     * Real-world starting point.
     */
    realWorldStart:
        "2026-08-29T00:00:00Z",


    /*
     * FFS world starting point.
     */
    ffsWorldStart:
        "1996-08-29T00:00:00Z",


    /*
     * Initial prototype time acceleration.
     *
     * 1 real-world hour
     * =
     * 24 FFS hours
     */
    ffsTimeMultiplier: 24

};


/* =========================================================
   FFS LANGUAGE SYSTEM
   ========================================================= */

const FFS_LANGUAGE = {

    current: "id",

    dictionaries: {

        id: ID,

        en: EN

    }

};


/* =========================================================
   TRANSLATION FUNCTION
   ========================================================= */

function t(path) {

    const parts = path.split(".");

    let value =
        FFS_LANGUAGE
            .dictionaries[
                FFS_LANGUAGE.current
            ];


    for (const part of parts) {

        value = value?.[part];

    }


    return value ?? path;

}


/* =========================================================
   FFS TIME STATE
   ========================================================= */

const FFS_TIME = {

    realWorld: new Date(
        FFS_CONFIG.realWorldStart
    ),

    world: new Date(
        FFS_CONFIG.ffsWorldStart
    )

};


/* =========================================================
   UPDATE FFS TIME
   ========================================================= */

function updateFFSTime() {

    const now = Date.now();


    const realWorldStart =
        new Date(
            FFS_CONFIG.realWorldStart
        ).getTime();


    const ffsWorldStart =
        new Date(
            FFS_CONFIG.ffsWorldStart
        ).getTime();


    const elapsedRealMilliseconds =
        now - realWorldStart;


    const elapsedFFSMilliseconds =
        elapsedRealMilliseconds *
        FFS_CONFIG.ffsTimeMultiplier;


    FFS_TIME.realWorld =
        new Date(now);


    FFS_TIME.world =
        new Date(
            ffsWorldStart +
            elapsedFFSMilliseconds
        );

}


/* =========================================================
   DATE FORMATTER
   ========================================================= */

function formatDate(date) {

    const language =
        FFS_LANGUAGE.current === "id"
            ? "id-ID"
            : "en-US";


    return date.toLocaleDateString(
        language,
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   UPDATE TIME UI
   ========================================================= */

function updateTimeUI() {

    updateFFSTime();


    document
        .getElementById("real-world-time")
        .textContent =
        formatDate(
            FFS_TIME.realWorld
        );


    document
        .getElementById("ffs-world-time")
        .textContent =
        formatDate(
            FFS_TIME.world
        );

}


/* =========================================================
   UPDATE LANGUAGE UI
   ========================================================= */

function updateLanguageUI() {

    document.documentElement.lang =
        FFS_LANGUAGE.current;


    document.title =
        t("app.title");


    document
        .getElementById("real-world-label")
        .textContent =
        t("time.realWorld");


    document
        .getElementById("ffs-world-label")
        .textContent =
        t("time.ffsWorld");


    document
        .getElementById("loading-message")
        .textContent =
        t("system.loading");


    document
        .getElementById("world-description")
        .textContent =
        t("system.worldDescription");


    document
        .getElementById("language-id")
        .textContent =
        `🇮🇩 ${t("language.indonesia")}`;


    document
        .getElementById("language-en")
        .textContent =
        `🇬🇧 ${t("language.english")}`;


    document
        .getElementById("language-id")
        .classList.toggle(
            "active",
            FFS_LANGUAGE.current === "id"
        );


    document
        .getElementById("language-en")
        .classList.toggle(
            "active",
            FFS_LANGUAGE.current === "en"
        );


    updateTimeUI();

}


/* =========================================================
   CHANGE LANGUAGE
   ========================================================= */

function setLanguage(language) {

    if (
        !FFS_LANGUAGE.dictionaries[language]
    ) {

        console.warn(
            "Unsupported language:",
            language
        );

        return;

    }


    FFS_LANGUAGE.current =
        language;


    updateLanguageUI();

}


/* =========================================================
   LANGUAGE BUTTONS
   ========================================================= */

document
    .getElementById("language-id")
    .addEventListener(
        "click",
        () => setLanguage("id")
    );


document
    .getElementById("language-en")
    .addEventListener(
        "click",
        () => setLanguage("en")
    );


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeFFS() {

    console.log(
        "Founder Fantasy Simulator initialized."
    );


    console.log(
        "Real World:",
        FFS_TIME.realWorld
    );


    console.log(
        "FFS World:",
        FFS_TIME.world
    );


    updateLanguageUI();


    setInterval(
        updateTimeUI,
        1000
    );

}


/* =========================================================
   START FFS
   ========================================================= */

initializeFFS();
