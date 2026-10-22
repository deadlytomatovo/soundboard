# Pixel Battle Soundboard

A small browser game for people who enjoy simple pixel games.
It started as a soundboard and developed into a battle game where each action has sound and visual feedback.

## How to play
- Attack: swing a sword. Enemies must be close enough to hit.
- Defense: raise a shield for 0.8 seconds to block incoming damage.
- Heal: restore up to 25 HP, with a 5-second cooldown. It cannot be used at full health.
- Stop: pause the game and stop the sound.
- Resume: continue the paused game.
- Restart: start again with 100 HP and a score of zero.

Nearby enemies deal 15 damage every 1.2 seconds unless blocked.
Defeat enemies to increase the score. New enemies appear after each defeat.
At zero HP, the game ends.

## Run locally
You need a modern browser and Python 3 for the local server.
No extra Python packages or JavaScript libraries are required.

In Terminal:

```sh
cd ~/Documents/game-soundboard
python3 -m http.server 8000 --bind 127.0.0.1

```

Open http://127.0.0.1:8000 in your browser.
Keep Terminal running while playing. Press Control+C to stop the server.

The included WAV files are ready to use.
To regenerate them, run:

```sh
python3 generate_sounds.py
```

## Feedback and error handling
Buttons and messages indicate audio playback.
The character jumps and swings a sword, raises a shield, or glows when healing.
Health, score, and healing cooldown are visible.

If a sound file is missing or cannot be played, a message identifies its path.
Gameplay continues without that sound.
Switching browser tabs pauses the game.

## Assets and credits
The pixel character, enemy, sword, and shield are drawn with HTML and CSS.
The three WAV sounds are synthesised by the included generate_sounds.py script.
No external images or sound recordings are used.

ChatGPT/Codex assisted with planning, code, sound generation, and documentation.
See PROCESS.md for development decisions and testing.

## Known limitations
There is one enemy type and no final level.
Combat is based on horizontal distance rather than precise sword collision.
Blocking requires timing, and the sounds are simple synthesised tones.
Testing so far has been on my Mac browser; other devices have not been verified.

## Screenshot
To be added before submission.
