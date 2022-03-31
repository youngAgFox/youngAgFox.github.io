const body = document.querySelector("body");
search(body);

function search(e) {
    for (let s of e.classList) {
        if (s.match("^popup.*")) {
            let target;
            for (let c of e.children) {
                if (c.classList.contains("popuptext")) {
                    target = c;
                    break;
                }
            }
            if (target == null) {
                console.log("Error: no popuptext element for " + e);
            } else
                e.addEventListener("click", makeShow(target));

            break;
        }
    }
    for (let c of e.children)
        search(c);
}

function makeShow(target) {
    return function () {
        target.classList.toggle("show");
    };
}