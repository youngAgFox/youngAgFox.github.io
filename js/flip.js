const cards = document.querySelectorAll(".flip-card");
// Add the listener to the outer flip-card, and flip the inner container
for (let c of cards) {
    let inner = c.querySelector(".flip-card-inner");
    c.addEventListener("click", () => inner.classList.toggle("flip"));
    c.style += "cursor: pointer;";
}

const fronts = document.querySelectorAll(".flip-card-front");
let e;
// Add the flip hint text to the front cards
for (let f of fronts) {
    e = document.createElement("div");
    e.style = "position: absolute; left: 1ch; top: 1ch; opacity: 90%; color: hsl(var(--clr-lightBlue)); font-size: 12px;";
    e.innerText = "Click to Flip";
    f.insertBefore(e, f.firstChild);
}