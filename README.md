# NanoVoco: audio demo and paper results

**[Listen to the demo](index.html)**

Companion website for **NanoVoco: Upsampling-Aware Rank–Width Reallocation for Lightweight Vocoding**.

A minimal static audio comparison website, inspired by the
[HiFi-GAN demo](https://jik876.github.io/hifi-gan-demo/).

The page includes five examples from the paper's 128 LJSpeech evaluation utterances and nine rows: Ground Truth,
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

- `index.html`: paper title and method summary, sample texts, audio players,
  Table 1 results, and a separate summary of the complete MCU TTS system.
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

## Safari playback on the anonymous site

The anonymous host does not provide byte-range responses for WAV files. If a
browser cannot stream a WAV, the player loads a complete, lossless copy from
`audio-inline/` and plays it locally as a data URL. Each copy contains exactly
the original WAV bytes; no audio is recompressed or resampled. Loading stays
on the anonymous host and does not use a public GitHub fallback.

The small per-sample scripts work within the anonymous host's sandbox without
cross-origin requests. They are loaded only after a media loading error and
cached in the page. If the browser requires another user gesture, the page
asks the listener to press Play again.

After replacing any source audio and updating its manifest checksum, regenerate
the compatibility assets with `python3 tools/build_audio_inline.py`.

## Reported results

The title and scientific description follow the accompanying anonymous manuscript.
Vocoder numbers are from Table 1 (128 utterances); CPU conditions are in Appendix F.
Complete TTS deployment figures come from §5.3 and Appendix G and are distinguished
from vocoder-only results. The site does not host MCU-generated samples or firmware.
All reported results are transcribed from the paper, not recalculated from the five
listening examples. Links to code and weights use the anonymous repository.
