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
