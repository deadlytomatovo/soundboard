import math
import struct
import wave
from pathlib import Path

folder = Path(__file__).resolve().parent / "assets" / "sounds"
folder.mkdir(parents=True, exist_ok=True)
sample_rate = 44100

sounds = {
    "attack": [800, 600, 400, 200],
    "defense": [220, 330, 220, 330],
    "heal": [440, 554, 659, 880],
}

for name, notes in sounds.items():
    frames = bytearray()
    duration = 0.2
    count = int(sample_rate * duration)

    for frequency in notes:
        for i in range(count):
            time = i / sample_rate
            fade = min(1, i / 400, (count - 1 - i) / 400)
            tone = math.sin(2 * math.pi * frequency * time)
            value = int(0.25 * 32767 * tone * fade)
            frames.extend(struct.pack("<h", value))

    with wave.open(str(folder / f"{name}.wav"), "wb") as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(sample_rate)
        audio.writeframes(frames)

    print(f"Created: assets/sounds/{name}.wav")
