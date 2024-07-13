var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");

const starSpeed = 30;
var stars = [], // Array that contains the stars
  FPS = 60, // Frames per second
  x = 150, // Number of stars, reduced from 230
  mouse = {
    x: 0,
    y: 0,
  }; // mouse location

// Increase canvas resolution and scale context
function initCanvas() {
  canvas.width = window.innerWidth * 2;
  canvas.height = window.innerHeight * 2;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.scale(2, 2); // Reduced scale from 3 to 2

  stars = [];

  // Push stars to array
  for (var i = 0; i < x; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1 + 1,
      vx: Math.floor(Math.random() * starSpeed),
      vy: Math.floor(Math.random() * starSpeed),
    });
  }
}

const greetText = document.getElementById("greet-text");
const typewriterText = document.getElementById("typewriter-text");

function updateText() {
  // handle landing page text resizing
  if (window.innerWidth < 750) {
    typewriterText.style.fontSize = "3.5vw";
    greetText.style.fontSize = "2.5em";
  } else {
    typewriterText.style.fontSize = "2vw";
    greetText.style.fontSize = "3em";
  }
}

initCanvas();
updateText();

let resizeTimeout;
addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initCanvas();
    updateText();
  }, 100); // Debounced resize event with 100ms delay
});

// Draw the scene
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  ctx.globalCompositeOperation = "source-over";
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s.x / 2, s.y / 2, s.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.stroke();
  }

  ctx.beginPath();
  for (var i = 0, x = stars.length; i < x; i++) {
    var starI = stars[i];
    ctx.moveTo(starI.x / 2, starI.y / 2);
    if (distance(mouse, starI) < 350) ctx.lineTo(mouse.x / 2, mouse.y / 2);
    for (var j = 0, x = stars.length; j < x; j++) {
      var starII = stars[j];
      if (distance(starI, starII) < 150) {
        ctx.lineTo(starII.x / 2, starII.y / 2);
      }
    }
  }
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "gray";
  ctx.stroke();

  // Create vignette effect around mouse
  var gradient = ctx.createRadialGradient(
    mouse.x / 2,
    mouse.y / 2,
    50,
    mouse.x / 2,
    mouse.y / 2,
    350
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
}

function distance(point1, point2) {
  var xs = 0;
  var ys = 0;

  xs = point2.x - point1.x;
  xs = xs * xs;

  ys = point2.y - point1.y;
  ys = ys * ys;

  return Math.sqrt(xs + ys);
}

// Update star locations
function update() {
  for (var i = 0, x = stars.length; i < x; i++) {
    var s = stars[i];
    s.x += s.vx / FPS;
    s.y += s.vy / FPS;

    if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
    if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
  }
}

canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.clientX * 2;
  mouse.y = e.clientY * 2;
});

// Update and draw
function tick() {
  draw();
  update();
  requestAnimationFrame(tick);
}

tick();
