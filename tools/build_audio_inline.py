"""Create Safari fallback assets from unchanged WAV bytes (Python stdlib only)."""
import base64
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main():
    with (ROOT / 'audio_manifest.csv').open(newline='') as file:
        samples = list(csv.DictReader(file))
    for sample in samples:
        path = sample['path']
        audio = (ROOT / path).read_bytes()
        if hashlib.sha256(audio).hexdigest() != sample['sha256']:
            raise ValueError(f'Original audio checksum mismatch: {path}')
        destination = ROOT / 'audio-inline' / Path(path).with_suffix('.js')
        destination.parent.mkdir(parents=True, exist_ok=True)
        encoded = base64.b64encode(audio).decode('ascii')
        destination.write_text(
            f'window.NanoVocoAudio.register({json.dumps(path)}, {json.dumps(encoded)});\n',
            encoding='utf-8',
        )
    print(f'Built {len(samples)} lossless audio fallback assets.')

if __name__ == '__main__':
    main()
