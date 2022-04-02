import * as Ag from "./AgCollections.js";

const colors = ["red", "green", "blue", "violet", "orange", "yellow", "magenta"];
const fireworkRadius = 2;

const fireworks = new Ag.LinkedList();

let explosion = 0;
let doubleExplosion = 0;
let tripleExplosion = 0;
let recursiveExplosion = 0;

/** @type {HTMLCanvasElement} */
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
const explosionDuration = 1; // in seconds

window.addEventListener("click", mouseUpdate);

/** @param {MouseEvent} e */
function mouseUpdate(e) {
    const cx = e.clientX;
    const cy = e.clientY;
    const rect = canvas.getBoundingClientRect();
    if (cy < rect.bottom && cy > rect.top) {
        const tx = cx - rect.left;
        const ty = cy - rect.top;
        genExplosions(tx, ty, randomElement(colors), true);
    }
}
class Explosion {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.duration = explosionDuration;
        this.isAlive = true;
        this.radius = 2;
        this.speed = 300;
    }

    draw() {
        c.save();
        c.globalAlpha = Math.max(this.duration / explosionDuration, 0);
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
        c.closePath();
        c.fill();
        c.restore();
    }

    // want the explosion to move at x pixels per second
    // delta is diff in ms since last update
    tick(delta) {
        this.x += this.vx * this.speed * delta / 1000;
        this.y += this.vy * this.speed * delta / 1000;
        this.vy += ((-9.8 * delta / 1000 ) ** 2); // fall

        // kill if out of canvas
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.isAlive = false;
        }

        this.duration -= delta / 1000;
        if (this.duration <= 0) {
            this.isAlive = false;
        }

    }
}

/**
 * orientation is a value 0-1, where 0 and 1 both depict straight up
 */
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
        this.speed = 890; // pixels/s
    }

    draw() {
        c.save();
        c.fillStyle = this.color;
        c.strokeStyle = "black";
        c.beginPath();
        c.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
        c.closePath();
        c.stroke();
        c.fill();
        c.restore();
    }

    tick(delta) {
        this.x += this.vx * this.speed / 1000 * delta;
        this.y += this.vy * this.speed / 1000 * delta;

        // kill if out of canvas
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.isAlive = false;
        }
        // explode if out of bounding arc
        if (Math.sqrt((this.x - this.ox) ** 2 + (this.y - this.oy) ** 2) > this.arcHeight) {
            this.isAlive = false;
            genExplosions(this.x, this.y, this.color, true);
        }
    }
}

const explosionDiv = document.getElementById("explosion");

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} color 
 * @param {*} canGenerate if this can generate recursive calls. Default = false;
 */
function genExplosions(x, y, color, canGenerate = false) {
    explosion++;
    // random chance to generate another explosion at the same x,y
    const doubleExplosionChance = 0.60;
    const tripleExplosionChance = 0.25;
    const recursiveExplosionChance = 0.05;
    const recursivePropagation = 0.15;
    const maxPropagations = 18;
    const gen = Math.random();
    const isRecursive = canGenerate && gen <= recursiveExplosionChance;


    if (canGenerate) {

        if (isRecursive)
            recursiveExplosion++;
        else if (gen <= tripleExplosionChance) {
            tripleExplosion++;
            genExplosions(x, y, randomElement(colors));
            genExplosions(x, y, randomElement(colors));
        } else if (gen <= doubleExplosionChance) {
            doubleExplosion++;
            genExplosions(x, y, randomElement(colors));
        }
    }

    explosionDiv.innerText = `Explosions: ${explosion} Doubles: ${doubleExplosion} Triples: ${tripleExplosion}` +
        "\n" + (recursiveExplosion < 1 ? "?: 0" : `Recursives: ${recursiveExplosion}`);

    let e;
    let rx, ry;
    let dx;
    let propagated = 0;

    for (let i = 0; i < 100; i++) {
        rx = randomWithSign(); // -1 to 1
        ry = randomWithSign();
        // The reduction algorithm attempts to create a circular
        // effect by reducing the "corners" of the random dist
        // of particles
        dx = rx ** 2 + ry **2;
        if (dx > 1) {
            rx *= 0.66 * (dx/2);
            ry *= 0.66 * (dx/2);
        }
        e = new Explosion(x, y, rx, ry, color);
        fireworks.push(e);
        if (isRecursive && propagated < maxPropagations && Math.random() < recursivePropagation) {
            setTimeout(() => {
                genExplosions(x + rx, y + ry, randomElement(colors));
            }, Math.random() * 2000 + 500);

            propagated++;
        }
    }
}

function scrollCheck() {
    if (!inView(target)) {
        isInView = false;
        return;
    }
    if (!isInView && fireworks.size() == 0) {
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

function randomSign() {
    return Math.random() >= 0.5 ? 1 : -1;
}

function randomWithSign() {
    return Math.random() * randomSign();
}

function randFirework() {
    const scrR = canvas.width * 0.6 / canvas.height;
    const vx = randomWithSign() * scrR; 
    console.log(scrR);
    return new Firework(canvas.width / 2, canvas.height, vx, -0.4 * Math.random() - 1, randomElement(colors));
}

function randomElement(list) {
    let i = Math.round(Math.random() * list.length) % list.length;
    return list[i];
}

let lastTime;
function update(time) {
    if (lastTime === undefined) lastTime = time;
    c.clearRect(0, 0, canvas.width, canvas.height);

    // In place removal makes this much more efficient
    const it = fireworks.iterator();
    let f;

    while (it.hasNext()) {
        f = it.next();
        if (!f.isAlive) {
            it.remove();
        } else {
            f.tick(time - lastTime);
            f.draw();
        }
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}