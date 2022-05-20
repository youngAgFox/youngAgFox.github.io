const cards = document.querySelectorAll(".flip-card-inner");
for (let c of cards) {
    c.addEventListener("click", () => c.classList.toggle("flip"));
    c.addEventListener("touchend", () => c.classList.toggle("flip"));
}

const fronts = document.querySelectorAll(".flip-card-front");
let e;
// Add the flip hint text
for (let f of fronts) {
    e = document.createElement("div");
    e.style = "position: absolute; left: 1ch; bottom: 1ch; opacity: 90%; color: hsl(var(--clr-lightBlue));";
    e.innerText = "Click to Flip";
    f.insertBefore(e, f.firstChild);
}