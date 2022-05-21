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

    e.addEventListener("click", adjustLocation(popup, direction, e));
    window.addEventListener("resize", () => popup.classList.remove("show"));
}

function adjustLocation(popup, direction, e) {
    return function (evt) {
        const width = e.offsetWidth;
        const height = e.offsetHeight;
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

        // check if we are popping up out of bounds
        //console.log("outside: ", px + popup.offsetWidth);
        if (px < 0) px = gap;
        let ex = px + width;
        if (ex > window.innerWidth)
            px = window.innerWidth - width - gap;
        if (py < 0) py = gap;
        let ey = py + height;
        if (ey > window.innerHeight)
            py = window.innerHeight - height - gap;

        popup.style.bottom = `${py}px`;
        popup.style.left = `${px}px`;
        popup.classList.toggle("show");
    };
}