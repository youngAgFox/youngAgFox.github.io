const colors = ["red", "green", "blue", "violet", "orange", "yellow", "magenta"];
const fireworkRadius = 2;

/**  @type {HTMLCanvasElement} */
const canvas = document.getElementById("fireworkCanvas");
const canvasContainer = document.getElementById("canvas-container");
window.addEventListener("resize", canvasUpdate);
canvasUpdate();
window.requestAnimationFrame(update);

function canvasUpdate() {
    const rect = canvasContainer.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

/** @type {CanvasRenderingContext2D} */
const c = canvas.getContext("2d");
const target = document.getElementById("fireworkTarget");
let isInView = false;
document.addEventListener("scroll", scrollCheck);
let fireworks = [];
let anyDied = false;
const explosionTicks = 60 * 4.5;

window.addEventListener("mousedown", mouseUpdate);
window.addEventListener("touchstart", mouseUpdate);

/** @param {MouseEvent} e */
function mouseUpdate(e) {
    const cx = e.clientX || e.touches[0].clientX;
    const cy = e.clientY || e.touches[0].clientY;
    const rect = canvas.getBoundingClientRect();
    if (cy < rect.bottom && cy > rect.top) {
        const tx = cx - rect.left;
        const ty = cy - rect.top;
        genExplosions(tx, ty, randomElement(colors));
    }
}
class Explosion {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.ticks = explosionTicks;
        this.isAlive = true;
        this.radius = 2;
    }

    draw() {
        c.save();
        c.globalAlpha = this.ticks / explosionTicks;
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, 0, 0);
        c.closePath();
        c.fill();
        c.restore();
    }

    tick(delta) {
        const ds = (delta/8.3);
        this.x += this.vx * ds;
        this.y += this.vy * ds;
        this.vy -= (-0.0098 * ((explosionTicks - this.ticks) / 60) ** 2) * ds;

        // kill if out of canvas
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.isAlive = false;
            anyDied = true;
        }

        this.ticks -= Math.max(Math.round(ds), 1);
        if (this.ticks <= 0) {
            this.isAlive = false;
            anyDied = true;
        }

    }
}

class Firework {
    constructor(x, y, vx, vy, color = "red") {
        this.ox = x;
        this.oy = y;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 6;
        this.isAlive = true;
        this.color = color;
        this.arcHeight = 0.80 * canvas.height; // puts it above projects title
    }

    draw() {
        c.save();
        c.fillStyle = this.color;
        c.strokeStyle = "black";
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, 0, 0);
        c.closePath();
        c.stroke();
        c.fill();
        c.restore();
    }

    tick(delta) {
        const ds = delta/8.3;
        this.x += this.vx * ds;
        this.y += this.vy * ds;

        // kill if out of canvas
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.isAlive = false;
            anyDied = true;
        }
        // explode if out of bounding arc
        if (Math.sqrt((this.x - this.ox) ** 2 + (this.y - this.oy) ** 2) > this.arcHeight) {
            this.isAlive = false;
            anyDied = true;
            genExplosions(this.x, this.y, this.color);
        }
    }
}

function getMinV() {
    return Math.min(getMaxVX(), getMaxVY());
}

function getMaxVX() {
    return window.innerWidth / 2 / (fireworkRadius * 60);
}

function getMaxVY() {
    return -1 * window.innerHeight / (fireworkRadius * 60); 
}

function genExplosions(x, y, color) {
    const maxV = getMinV();
    // This reduction algorithm attempts to create a circular
    // effect by reducing the "corners" of the random dist
    // of particles
    const reduceAmount = 0.65;
    const reduceThreshold = ((maxV*0.25)**2 + (maxV*0.25)**2) * 0.55;
    let e;
    let rx;
    let ry;

    for (let i = 0; i < 100; i++) {
        rx = Math.random() * (maxV * 0.25) * (Math.random() >= 0.5 ? 1 : -1);
        ry = Math.random() * (maxV * 0.25) * (Math.random() >= 0.5 ? 1 : -1);
        if (rx**2 + ry**2 > reduceThreshold) {
            rx *= reduceAmount;
            ry *= reduceAmount;
        }
        e = new Explosion(x, y, rx, ry, color);
        fireworks.push(e);
    }
}

function scrollCheck() {
    if (!inView(target)) {
        isInView = false;
        return;
    }
    if (!isInView && fireworks.length == 0) {
        for (let i = 0; i < 8; i++) {
            let f = randFirework();
            fireworks.push(f);
        }
        isInView = true;
    }
}

function inView(e) {
    const r = e.getBoundingClientRect();
    return r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight && r.right <= window.innerWidth;
}

function randFirework() {
    const maxVX = getMaxVX();
    const maxVY = getMaxVY();
    const vy = (Math.random() + 1) * maxVY;
    const vxSign = (Math.random() >= 0.5 ? 1 : -1);
    const vx = Math.random() * maxVX * vxSign;
    return new Firework(canvas.width / 2, canvas.height, vx, vy, randomElement(colors));
}

function randomElement(list) {
    let i = Math.round(Math.random() * list.length) % list.length;
    return list[i];
}


let lastTime;
function update(time) {
    if (lastTime === undefined) lastTime = time;
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let f of fireworks) {
        f.tick(time - lastTime);
        f.draw();
    }
    if (anyDied) {
        fireworks = fireworks.filter(f => f.isAlive);
        anyDied = false;
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}