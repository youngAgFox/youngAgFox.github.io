const canvas = document.getElementById("fireworkCanvas");
const canvasContainer = document.getElementById("canvas-container").getBoundingClientRect();
canvas.width = canvasContainer.width;
canvas.height = canvasContainer.height;

const c = canvas.getContext("2d");
const target = document.getElementById("fireworkTarget");
let isInView = false;
document.addEventListener("scroll", scrollCheck);
let fireworks = [];
let anyDied = false;
const explosionTicks = 60*4.5;

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
        c.arc(this.x, this.y, this.radius, Math.PI*2, 0, 0);
        c.closePath();
        c.fill();
        c.restore();
    }

    tick() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= (-0.0098* ((explosionTicks - this.ticks)/60)**2);

        // kill if out of canvas
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.isAlive = false;
            anyDied = true;
        }

        this.ticks--;
        if (this.ticks <= 0) {
            this.isAlive = false;
            anyDied = true;
        }

    }
}

class Firework {
    constructor(x, y, vx, vy, color="red") {
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
        c.arc(this.x, this.y, this.radius, Math.PI*2, 0, 0);
        c.closePath();
        c.stroke();
        c.fill();
        c.restore();
    }

    tick() {
        this.x += this.vx;
        this.y += this.vy;

        // kill if out of canvas
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.isAlive = false;
            anyDied = true;
        }
        // explode if out of bounding arc
        if (Math.sqrt((this.x - this.ox)**2 + (this.y - this.oy)**2) > this.arcHeight) {
            this.isAlive = false;
            anyDied = true;
            let e;
            let rx;
            let ry;
            for (let i = 0; i < 100; i++) {
                rx = Math.random() * 2 * (Math.random() >= 0.5 ? 1 : -1);
                ry = Math.random() * 2 * (Math.random() >= 0.5 ? 1 : -1);
                e = new Explosion(this.x, this.y, rx, ry, this.color);
                fireworks.push(e);
            }
        }
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
        window.requestAnimationFrame(update);
        isInView = true;
    }
}

function inView(e) {
    const r = e.getBoundingClientRect();
    return r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight && r.right <= window.innerWidth;
}

function randFirework() {
    const colors = ["red", "green", "blue", "violet", "orange", "yellow", "magenta"];
    const maxVY = -3;
    const maxVX = 5;
    const offset = 6;
    const vy = Math.max(Math.random(), 0.001) * maxVY - offset;
    const vxSign = (Math.random() >= 0.5 ? 1 : -1);
    const vx = Math.random() * maxVX * vxSign;
    return new Firework(canvas.width/2, canvas.height, vx, vy, randomElement(colors));
}

function randomElement(list) {
    let i = Math.round(Math.random() * list.length) % list.length;
    return list[i];
}


let lastTime;
function update(time) {
    if (lastTime === undefined) lastTime = time;
    else if (time - lastTime < 1000*0.16) {
        window.requestAnimationFrame(update);
        return;
    }
    c.clearRect(0,0,canvas.width, canvas.height);
    for (let f of fireworks) {
        f.tick();
        f.draw();
    }
    if (anyDied) {
        fireworks = fireworks.filter(f => f.isAlive);
        anyDied = false;
    }
    if (fireworks.length > 0)
        window.requestAnimationFrame(update);
    else c.clearRect(0,0, canvas.width, canvas.height); // clear last artifacts
}