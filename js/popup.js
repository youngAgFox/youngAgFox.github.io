const ERR = "ERROR (popup.js): "; 
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
    // add popup handler
    // calculate the size of the popup using the internal elements
    // also recalculate the position of the ::after arrow
    let width = e.offsetWidth * 0.8;
    popup.style.width = `${width}px`;
    let height = 40; // amt to add as extra space
    for (let c of popup.children) {
        height += c.offsetHeight;
    }

    popup.style.height = `${height}px`;
    // only allow 20 resizes - mostly likely an error somewhere if more than that
    const maxI = 20;
    for (let i = 0; i < maxI && isOverflown(popup); i++) { // guarded while loop
        // increase the size of the smallest dimension until not
        if (width > height) {
            height += 30;
            popup.style.height = `${height}px`;
        } else {
            width += 30;
            popup.style.width = `${width}px`;
        }
        if (i == maxI - 1) console.log(ERR + "element resized because of overflow to max: " + popup);
    }

    e.addEventListener("click", adjustLocation(popup, direction, width, height));
}

function adjustLocation(popup, direction, width, height) {
    return function (e) {
        switch (direction) {
            case "above":
                const popupY = -height - 25;
                popup.style.top = `${popupY}px`;
                break;
            case "right":

                break;
            default: console.log(ERR + " " + direction + " is not recognized");
        }
        popup.classList.toggle("show");
    };
}

function isOverflown(e) {
    return e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth;
}