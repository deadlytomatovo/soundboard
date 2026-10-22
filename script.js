const soundButtons = document.querySelectorAll("[data-sound]");
const stopButton = document.querySelector("#stop");
const status = document.querySelector("#status");

let currentAudio = null;

function stopCurrentSound() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  soundButtons.forEach(button => {
    button.classList.remove("playing");
  });
}

soundButtons.forEach(button => {
  button.addEventListener("click", async () => {
    stopCurrentSound();

    const name = button.dataset.sound;
    const label = button.textContent;
    const audio = new Audio(`assets/sounds/${name}.wav`);
    audio.volume = 0.5;
    currentAudio = audio;
    status.textContent = `Loading: ${label}...`;

    audio.addEventListener("ended", () => {
      if (currentAudio !== audio) return;
      stopCurrentSound();
      status.textContent = `Finished: ${label}. Choose another sound.`;
    });

    try {
      await audio.play();
      if (currentAudio !== audio) return;

      button.classList.add("playing");
      status.textContent = `Playing: ${label}.`;
    } catch (error) {
      if (currentAudio !== audio) return;

      stopCurrentSound();
      status.textContent =
        `Could not play ${label}. Check that assets/sounds/${name}.wav exists and is a valid audio file, then try again.`;
    }
  });
});

stopButton.addEventListener("click", () => {
  stopCurrentSound();
  status.textContent = "Stopped. Choose a sound.";
});

// Animate the pixel hero when Attack is clicked.
const hero = document.querySelector("#hero");
let heroAnimation = null;

function resetHero() {
  if (heroAnimation) {
    heroAnimation.cancel();
    heroAnimation = null;
  }
}

soundButtons.forEach(button => {
  button.addEventListener("click", () => {
    resetHero();

    if (button.dataset.sound === "attack") {
      heroAnimation = hero.animate(
        [
          { transform: "translateY(0)" },
          { transform: "translateY(-40px)", offset: 0.45 },
          { transform: "translateY(0)" }
        ],
        {
          duration: 650,
          easing: "ease-in-out"
        }
      );
    }
  });
});

stopButton.addEventListener("click", resetHero);

// Show a short visual effect for Defense and Heal.
let effectTimer = null;

function clearEffect() {
  clearTimeout(effectTimer);
  hero.classList.remove("defending", "healing");
}

soundButtons.forEach(button => {
  button.addEventListener("click", () => {
    clearEffect();

    const name = button.dataset.sound;

    if (name === "defense" || name === "heal") {
      hero.classList.add(name === "defense" ? "defending" : "healing");
      effectTimer = setTimeout(clearEffect, 800);
    }
  });
});

stopButton.addEventListener("click", clearEffect);

// Pause the scenery with Stop; resume when an action is chosen.
const stage = document.querySelector(".stage");

stopButton.addEventListener("click", () => {
  stage.classList.add("paused");
});

soundButtons.forEach(button => {
  button.addEventListener("click", () => {
    stage.classList.remove("paused");
  });
});

// First enemy prototype: approach the hero, then wait.
const enemy = document.createElement("div");
enemy.className = "enemy";
stage.appendChild(enemy);

// Show and swing a sword during Attack.
const sword = document.createElement("div");
sword.className = "sword";
hero.appendChild(sword);

let swordAnimation = null;

function hideSword() {
  if (swordAnimation) {
    swordAnimation.cancel();
    swordAnimation = null;
  }
  sword.style.visibility = "hidden";
}

soundButtons.forEach(button => {
  button.addEventListener("click", () => {
    hideSword();

    if (button.dataset.sound !== "attack") return;

    sword.style.visibility = "visible";
    swordAnimation = sword.animate(
      [
        { transform: "rotate(-65deg)" },
        { transform: "rotate(35deg)", offset: 0.5 },
        { transform: "rotate(0deg)" }
      ],
      { duration: 650, easing: "ease-out" }
    );

    swordAnimation.onfinish = hideSword;
  });
});

stopButton.addEventListener("click", hideSword);

// Show combat feedback separately from audio playback feedback.
const combatStatus = document.createElement("p");
combatStatus.setAttribute("role", "status");
combatStatus.textContent = "Wait for the enemy to get close, then attack.";
stage.after(combatStatus);

document.querySelector('[data-sound="attack"]')
  .addEventListener("click", () => {
    if (!enemy.isConnected) {
      combatStatus.textContent = "Enemy defeated! Refresh to try again.";
      return;
    }

    const heroBox = hero.getBoundingClientRect();
    const enemyBox = enemy.getBoundingClientRect();
    const distance = enemyBox.left - heroBox.right;

    if (distance >= -40 && distance <= 56) {
      enemy.remove();
      combatStatus.textContent = "Hit! You defeated the enemy.";
    } else {
      combatStatus.textContent = "Miss! Let the enemy come closer.";
    }
  });
