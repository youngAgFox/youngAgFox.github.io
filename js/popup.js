const ERR = "ERROR (popup.js):";
const popupRegex = "^popup-.*";
const body = document.querySelector("body");
search(body);

function search(e) {
    for (let s of e.classList) {
        if (s.match(popupRegex)) {
            let popup;
            const direction = s.substring(6, s.length);
            for (let c of e.children) {
                if (c.classList.contains("popuptext")) {
                    popup = c;
                    break;
                }
            }
            if (popup == null) {
                console.log(ERR + "no popuptext element for " + e);
            } else configPopup(e, popup, direction);
            break;
        }
    }
    for (let c of e.children)
        search(c);
}

function configPopup(e, popup, direction) {
    let width = e.offsetWidth * 0.8;
    popup.style.minWidth = `${width}px`;

    // add popup handler
    e.addEventListener("click", adjustLocation(popup, direction, e));
}

function adjustLocation(popup, direction, e) {
    const width = e.offsetWidth;
    const height = e.offsetHeight;
    return function () {
        let px = 0, py = 0;
        const gap = 15;
        switch (direction) {
            case "above":
                py = height + gap;
                px = (width / 2) - (popup.offsetWidth / 2);
                break;
            case "right":
                py = height * 0.6;
                px = width + gap;
                break;
            default: throw new Error(" " + direction + " is not recognized");
        }
        popup.style.bottom = `${py}px`;
        popup.style.left = `${px}px`;
        popup.classList.toggle("show");
    };
}