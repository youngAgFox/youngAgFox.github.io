// in-script console logger
const criticalDebug = 1;
const warnDebug = 2;
const infoDebug = 3;
const dump = 4;
// set debug to above levels for more info
const debug = 0;

const project = document.getElementById("projects");
addHandlers(project);

// Check all children recursively, adding video handlers for opacity to Video html elements
// assumes autoplay is disabled!
function addHandlers(e) {
    for (let c of e.children) {
        if (debug >= dump) console.log("checking " + c);
        if (c instanceof HTMLVideoElement) {
            if (debug >= infoDebug) console.log("adding video handlers to id=" + c.id);
            c.addEventListener("play", toggleOpaque);
            c.addEventListener("pause", toggleOpaque);
        }
        addHandlers(c);
    }
}

function toggleOpaque(e) {
    e.target.classList.toggle("opaque");
}
