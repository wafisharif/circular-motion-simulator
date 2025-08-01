let angle = 0;
let radius_px, omega_frame, mass;

const velocityScale = 3;
const accelScale = 200;
const forceScale = 50;

let isPaused = false;

const PIXELS_PER_METER = 100; // 100 pixels = 1 meter
const FRAME_RATE = 60;        // frames per second

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent('canvasContainer');
  angleMode(RADIANS);
  frameRate(FRAME_RATE);
}

function draw() {
  background(20);
  translate(width / 2, height / 2);

  // Raw slider values
  radius_px = float(document.getElementById("radiusSlider").value);   // in px
  omega_frame = float(document.getElementById("omegaSlider").value);  // in rad/frame
  mass = float(document.getElementById("massSlider").value);          // in kg

  // Convert to real-world units
  let radius_m = radius_px / PIXELS_PER_METER;
  let omega_rad_s = omega_frame * FRAME_RATE;
  let velocity_m_s = omega_rad_s * radius_m;
  let acceleration_m_s2 = omega_rad_s ** 2 * radius_m;
  let force_N = mass * acceleration_m_s2;

  // Update slider value displays in real-world units
  document.getElementById("radiusValue").innerText = nf(radius_m, 1, 2);      // meters
  document.getElementById("omegaValue").innerText = nf(omega_rad_s, 1, 2);    // rad/s
  document.getElementById("massValue").innerText = mass;                      // kg

  // Draw circular path
  noFill();
  stroke(150);
  ellipse(0, 0, 2 * radius_px);

  // Position of object on path (still in px)
  let x = radius_px * cos(angle);
  let y = radius_px * sin(angle);

  fill(255, 100, 100);
  noStroke();
  ellipse(x, y, 20);

  // Vectors (in px/frame)
  let vVec = createVector(-radius_px * omega_frame * sin(angle), radius_px * omega_frame * cos(angle));
  let aVec = createVector(omega_frame ** 2 * x, omega_frame ** 2 * y);
  let fVec = aVec.copy().mult(mass);

  // Draw vectors based on toggles
  if (document.getElementById("showVelocity").checked) {
    drawArrowWithTail(createVector(x, y), vVec.copy().mult(velocityScale), 'blue');
  }
  if (document.getElementById("showAcceleration").checked) {
    drawArrowWithTail(createVector(x, y), aVec.copy().mult(accelScale), 'green');
  }
  if (document.getElementById("showForce").checked) {
    drawArrowWithTail(createVector(x, y), fVec.copy().mult(forceScale), 'red');
  }

  // Animate angle based on real-world omega
  if (!isPaused) {
    angle += omega_rad_s / FRAME_RATE;
  }

  // Display motion stats
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT);
  let statsX = -width / 2 + 20;
  let statsY = -height / 2 + 20;
  text(`Radius: ${nf(radius_m, 1, 2)} m`, statsX, statsY);
  text(`Angular Velocity: ${nf(omega_rad_s, 1, 2)} rad/s`, statsX, statsY + 20);
  text(`Linear Velocity: ${nf(velocity_m_s, 1, 2)} m/s`, statsX, statsY + 40);
  text(`Centripetal Acceleration: ${nf(acceleration_m_s2, 1, 2)} m/s²`, statsX, statsY + 60);
  text(`Centripetal Force: ${nf(force_N, 1, 2)} N`, statsX, statsY + 80);

  // Legend
  let legendX = -width / 2 + 20;
  let legendY = height / 2 - 60;
  fill('blue'); rect(legendX, legendY, 20, 5);
  fill(255); text("Velocity", legendX + 30, legendY + 5);
  fill('green'); rect(legendX, legendY + 20, 20, 5);
  fill(255); text("Acceleration", legendX + 30, legendY + 25);
  fill('red'); rect(legendX, legendY + 40, 20, 5);
  fill(255); text("Net Force", legendX + 30, legendY + 45);

  // Pause overlay
  if (isPaused) {
    textAlign(CENTER);
    textSize(20);
    fill(255, 200, 0);
    text("PAUSED — Press SPACE to resume", 0, 0);
  }

  // Pause instruction
  fill(180);
  textSize(12);
  textAlign(CENTER);
  text("Press SPACE to pause/unpause", 0, height / 2 - 10);
}

function drawArrowWithTail(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(2);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function keyPressed() {
  if (key === ' ' || keyCode === 32) {
    isPaused = !isPaused;
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const infoBtn = document.getElementById('infoBtn');
  const infoPanel = document.getElementById('infoPanel');
  const closeBtn = document.getElementById('closeInfo');

  infoBtn.addEventListener('click', () => {
    // Toggle visibility
    infoPanel.style.display = (infoPanel.style.display === 'block') ? 'none' : 'block';
  });

  closeBtn.addEventListener('click', () => {
    infoPanel.style.display = 'none';
  });
});

