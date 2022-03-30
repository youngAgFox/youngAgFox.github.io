const debug = false;

const project = document.getElementById("projects");
addHandlers(project);

// Check all children recursively, adding video handlers for opacity to Video html elements
// assumes autoplay is disabled!
function addHandlers(e) {
    for (let c of e.children) {
        if (debug) console.log("checking " + c);
        if (c instanceof HTMLVideoElement) {
            if (debug) console.log("adding handlers to id=" + c.id);
            c.addEventListener("onplay", ele => ele.classList.toggle("opaque"));
            c.addEventListener("onpause", ele => ele.classList.toggle("opaque"));
        }
        addHandlers(c);
    }
}
