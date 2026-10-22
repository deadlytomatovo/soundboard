const stage = document.querySelector(".stage");
const hero = document.querySelector("#hero");
const buttons = document.querySelectorAll("[data-sound]");
const stopButton = document.querySelector("#stop");
const status = document.querySelector("#status");
const healthDisplay = document.querySelector("#health");
const scoreDisplay = document.querySelector("#score");
const healButton = document.querySelector('[data-sound="heal"]');

const combatStatus = document.createElement("p");
combatStatus.setAttribute("role", "status");
stage.after(combatStatus);

const resumeButton = document.createElement("button");
resumeButton.textContent = "Resume";
resumeButton.hidden = true;
stopButton.after(resumeButton);

const restartButton = document.createElement("button");
restartButton.textContent = "Restart";
resumeButton.after(restartButton);
restartButton.addEventListener("click", () => location.reload());

const sword = document.createElement("div");
sword.className = "sword";
hero.appendChild(sword);

let health = 100;
let score = 0;
let paused = false;
let gameOver = false;
let enemy = null;
let audio = null;
let animations = [];
let actionTime = 0;
let shieldTime = 0;
let healCooldown = 0;
let attackCooldown = 0;
let enemyAttackTime = 1.2;
let spawnTime = 0;

function stopAudio() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
  buttons.forEach(button => button.classList.remove("playing"));
}

function clearAction() {
  animations.forEach(animation => animation.cancel());
  animations = [];
  hero.classList.remove("defending", "healing");
  sword.style.visibility = "hidden";
  actionTime = 0;
  shieldTime = 0;
}

async function playSound(name, button) {
  stopAudio();
  const sound = new Audio(`assets/sounds/${name}.wav`);
  sound.volume = 0.5;
  audio = sound;
  status.textContent = `Loading: ${name}...`;

  sound.addEventListener("ended", () => {
    if (audio !== sound) return;
    stopAudio();
    status.textContent = `Finished: ${name}.`;
  });

  try {
    await sound.play();
    if (audio !== sound) return;
    button.classList.add("playing");
    status.textContent = `Playing: ${name}.`;
  } catch {
    if (audio !== sound) return;
    stopAudio();
    status.textContent =
      `Sound unavailable: assets/sounds/${name}.wav. Check the file and try again. The game can still continue.`;
  }
}

function spawnEnemy() {
  enemy = document.createElement("div");
  enemy.className = "enemy";
  // Later enemies approach faster, with a minimum duration of 0.8 seconds.
  const approachSeconds = Math.max(0.8, 3 - score * 0.2);
  enemy.style.animationDuration = `${approachSeconds}s`;
  stage.appendChild(enemy);
  enemyAttackTime = 1.2;
}

function enemyIsClose() {
  if (!enemy) return false;
  const distance = enemy.getBoundingClientRect().left
    - hero.getBoundingClientRect().right;
  return distance >= -40 && distance <= 56;
}

function updateDisplay() {
  healthDisplay.textContent = health;
  scoreDisplay.textContent = score;
  healButton.textContent = healCooldown > 0
    ? `Heal (${Math.ceil(healCooldown)}s)`
    : "Heal";
}

function resumeGame() {
  if (gameOver) return;
  paused = false;
  stage.classList.remove("paused");
  resumeButton.hidden = true;
}

function pauseGame() {
  if (gameOver) return;
  paused = true;
  stage.classList.add("paused");
  stopAudio();
  clearAction();
  resumeButton.hidden = false;
  status.textContent = "Paused. Click Resume or choose an action.";
}

stopButton.addEventListener("click", pauseGame);
resumeButton.addEventListener("click", () => {
  resumeGame();
  status.textContent = "Game resumed.";
});

buttons.forEach(button => {
  button.addEventListener("click", () => {
    if (gameOver) return;
    resumeGame();
    const name = button.dataset.sound;

    if (name === "attack" && attackCooldown > 0) {
      combatStatus.textContent = "Wait a moment before attacking again.";
      return;
    }
    if (name === "heal" && healCooldown > 0) {
      combatStatus.textContent = "Healing is cooling down.";
      return;
    }
    if (name === "heal" && health === 100) {
      combatStatus.textContent = "Your health is already full.";
      return;
    }

    clearAction();
    actionTime = 0.8;
    playSound(name, button);

    if (name === "attack") {
      attackCooldown = 0.45;
      sword.style.visibility = "visible";

      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animations.push(hero.animate(
          [
            { transform: "translateY(0)" },
            { transform: "translateY(-40px)", offset: 0.45 },
            { transform: "translateY(0)" }
          ],
          { duration: 650, easing: "ease-in-out" }
        ));
        animations.push(sword.animate(
          [
            { transform: "rotate(-65deg)" },
            { transform: "rotate(35deg)", offset: 0.5 },
            { transform: "rotate(0)" }
          ],
          { duration: 650, easing: "ease-out" }
        ));
      }

      if (enemyIsClose()) {
        enemy.remove();
        enemy = null;
        score += 1;
        spawnTime = 1.5;
        combatStatus.textContent = "Hit! Enemy defeated.";
      } else {
        combatStatus.textContent = "Miss! Wait until an enemy is closer.";
      }
    }

    if (name === "defense") {
      hero.classList.add("defending");
      shieldTime = 0.8;
      combatStatus.textContent = "Shield up! Time it before an enemy hits.";
    }

    if (name === "heal") {
      hero.classList.add("healing");
      health = Math.min(100, health + 25);
      healCooldown = 5;
      combatStatus.textContent = "Health restored. Healing cooldown: 5 seconds.";
    }

    updateDisplay();
  });
});

function endGame() {
  gameOver = true;
  stage.classList.add("paused");
  stopAudio();
  clearAction();
  buttons.forEach(button => button.disabled = true);
  stopButton.disabled = true;
  resumeButton.hidden = true;
  status.textContent = "Game over. Click Restart to try again.";
  combatStatus.textContent = `You defeated ${score} enemies.`;
}

let previousTime = performance.now();

function tick(now) {
  const seconds = Math.min((now - previousTime) / 1000, 0.1);
  previousTime = now;

  if (!paused && !gameOver) {
    healCooldown = Math.max(0, healCooldown - seconds);
    attackCooldown = Math.max(0, attackCooldown - seconds);
    shieldTime = Math.max(0, shieldTime - seconds);

    if (actionTime > 0) {
      actionTime -= seconds;
      if (actionTime <= 0) clearAction();
    }

    if (enemyIsClose()) {
      enemyAttackTime -= seconds;
      if (enemyAttackTime <= 0) {
        enemyAttackTime = 1.2;
        if (shieldTime > 0) {
          combatStatus.textContent = "Blocked! Your shield stopped the hit.";
        } else {
          health = Math.max(0, health - 15);
          combatStatus.textContent = "Ouch! You lost 15 HP. Attack, defend or heal.";
          if (health === 0) endGame();
        }
      }
    }

    if (!enemy) {
      spawnTime -= seconds;
      if (spawnTime <= 0) spawnEnemy();
    }

    updateDisplay();
  }

  requestAnimationFrame(tick);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseGame();
});

combatStatus.textContent = "Enemy approaching! Attack when it gets close.";
spawnEnemy();
updateDisplay();
requestAnimationFrame(tick);
