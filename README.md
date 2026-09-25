# NanoVoco audio demo

**[Listen to the demo](index.html)**

A minimal static audio comparison website, inspired by the
[HiFi-GAN demo](https://jik876.github.io/hifi-gan-demo/).

The page includes five LJSpeech test utterances and nine rows: Ground Truth,
NanoVoco, HiFi-GAN V2, HiFi-GAN V1, Parallel WaveGAN, FreGrad, RNDVoC,
MelGAN, and BigVGAN-base. All 45 original WAV files are included without
resampling, trimming, or loudness normalization. They are mono at 22,050 Hz.

## Preview locally

From this directory:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. No build step or external dependencies are required.

## GitHub Pages

Publish this repository from **Settings → Pages → Deploy from a branch**,
using the **main** branch and **/ (root)** folder. All URLs are relative, so
the page works under a GitHub Pages project path.

## Content

- `index.html`: sample texts, labels, and audio players.
- `style.css`: desktop comparison table and mobile single-sample layout.
- `script.js`: pauses other players during playback and switches mobile samples.
- `<model_directory>/<LJSpeech_ID>.wav`: original supplied audio.
- `audio_manifest.csv`: public sample metadata, relative paths, durations, and SHA-256 checksums.

The original server paths have been omitted from the public manifest.
Sample indices in the supplied test set are 20, 32, 49, 78, and 88. The website
labels these Sample 01–05 for readability and includes their LJSpeech IDs.

Audio is loaded only when played. Switching samples pauses current playback;
starting another player pauses the previous one. On small screens, the sample
selector shows the same nine models for one utterance at a time.
