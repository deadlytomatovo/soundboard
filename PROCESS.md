# Process

## Starting idea
A small game soundboard with Attack, Defense, Heal, and Stop buttons.

## First design
I started with four labelled buttons and a status message.
I then added spacing, contrasting colours, and a keyboard focus outline to make the controls easier to identify.

## Tools and AI assistance
I used Terminal, Git, and a browser.
ChatGPT/Codex helped plan the project and provided the initial HTML and CSS, which I copied into the files.
I opened the page to check the layout. Sound playback is not implemented yet.

## User trial
Not carried out yet.

## Developing the pixel battle idea
I wanted the soundboard to feel more like a small game, so I chose a pixel character with action animations.
With ChatGPT/Codex assistance, I added moving scenery, an approaching enemy, and a sword swing.
Attack now checks distance: it misses when the enemy is far away and defeats it when close enough.
I tested both cases in the browser and confirmed they worked.
Health, damage, and healing gameplay are not implemented yet.

## From soundboard to a small battle game
I expanded the idea into a small pixel battle game.
The player can attack nearby enemies, briefly defend, and heal with a cooldown.
Enemies deal damage when close, and defeated enemies are replaced.
Stop pauses the game, Resume continues it, and Restart starts a new round.

ChatGPT/Codex helped write and reorganise the JavaScript.
I kept the action sounds and added visual combat feedback so each button has a visible effect.

## My browser checks
I checked health loss, healing and its cooldown, blocking, defeating enemies, the score, pausing, game over, and restarting.
These checks worked in my browser.
This was my own testing; a trial with another person is still pending.
