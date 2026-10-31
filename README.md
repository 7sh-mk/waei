# Waei · واعي

**Spot scam messages and links before you fall for them.**

A free, Arabic-first awareness website built for a cybersecurity awareness campaign. It trains people to recognize the SMS and WhatsApp scams that target users in Saudi Arabia, and gives them a tool to check any suspicious link.

**Live:** https://7sh-mk.github.io/waei/

<p align="center">
  <img src="docs/screenshots/home.png" width="240" alt="Home screen">
  <img src="docs/screenshots/result.png" width="240" alt="Real or scam: final score">
  <img src="docs/screenshots/link-danger.png" width="240" alt="Link checker: look-alike letters detected">
</p>

## Features

### 1. Real or Scam?
A short challenge built on messages modeled after real ones from Absher, Nafath, SPL, banks, telecoms and online stores.

- Each round draws 10 messages: 5 real, 5 scams, shuffled. Answering "scam" every time cannot pass.
- Real messages use the official domains (`absher.sa`, `splonline.com.sa`, `stc.com.sa`, `amazon.sa`). Scams use look-alikes (`absher-sa.com`, `nafath.sa-verify.com`, `amaz0n-sa.com`, `bit.ly`), OTP requests, fake prizes, refunds and "new number" family scams.
- Swipe the card or tap **Real** / **Scam**. Every answer reveals the truth and two clues.
- Ends with a score out of 10 and an awareness level.

<p align="center">
  <img src="docs/screenshots/game.png" width="240" alt="Message card">
  <img src="docs/screenshots/feedback.png" width="240" alt="Answer and clues">
  <img src="docs/screenshots/result.png" width="240" alt="Final score">
</p>

### 2. Link Checker
Paste any link. It is analyzed as text on the device, never opened or fetched, and returns a clear verdict with the real domain behind it.

| Check | Example | Level |
| --- | --- | --- |
| Letters from another alphabet that look English (homograph) | `аmazon.com` with a Cyrillic «а» | Dangerous |
| Brand impersonation on a different domain | `absher-sa.com` instead of `absher.sa` | Dangerous |
| Brand name used as a disguise at the start | `nafath.sa-verify.com` | Dangerous |
| Digits replacing letters | `amaz0n.com` | Dangerous |
| IP address or `@` hiding the destination | `http://192.168.1.5` | Dangerous |
| URL shortener | `bit.ly/...` | Suspicious |
| Unencrypted link, risky TLD, bait words, too many subdomains | `http://`, `.top`, `login`, `gift` | Suspicious |
| Official domain of a known organization | `https://www.absher.sa` | Official |

For homographs, the tool decodes the hidden `xn--` form, names each foreign letter and its alphabet, and states which official site it imitates.

<p align="center">
  <img src="docs/screenshots/link-danger.png" width="240" alt="Homograph detected">
  <img src="docs/screenshots/link-sub.png" width="240" alt="Brand used as a disguise">
  <img src="docs/screenshots/link-official.png" width="240" alt="Official link">
</p>

## How It Works

**Real or Scam?**

```mermaid
flowchart LR
    A[Start challenge] --> B[Draw 10 messages<br/>5 real + 5 scam]
    B --> C[Show message card]
    C --> D{Swipe or tap<br/>Real / Scam}
    D --> E[Reveal answer<br/>+ 2 clues]
    E -->|next| C
    E -->|after 10| F[Score out of 10<br/>+ awareness level]
```

**Link Checker**

```mermaid
flowchart TD
    A[Paste link] --> B[Parse URL on the device<br/>never opened or fetched]
    B --> C[Decode punycode xn--<br/>back to the letters shown]
    C --> D1[Look-alike letters<br/>Cyrillic, Greek, accents]
    C --> D2[Brand impersonation<br/>vs. official domains]
    C --> D3[Digit swaps, @, IP]
    C --> D4[Shorteners, risky TLDs,<br/>bait words, http]
    D1 --> E{Verdict}
    D2 --> E
    D3 --> E
    D4 --> E
    E --> F[Dangerous]
    E --> G[Suspicious]
    E --> H[Official]
    E --> I[No clear signs]
```

## Privacy by Design
- Everything runs in the browser. No server, no accounts, no storage, no analytics, no cookies.
- A Content Security Policy blocks the page from connecting to any external server.
- Links inside both tools are plain text and are never opened.

## Tech Stack
HTML, CSS and vanilla JavaScript. No frameworks, libraries or build step.

## Project Structure
| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `style.css` | Styles |
| `app.js` | Routing and language switch |
| `game.js` | Real or Scam? logic |
| `scenarios.js` | Challenge messages (Arabic + English) |
| `link.js` | Link analysis and punycode decoding |
| `config.js` | Official domains, detection rules and all UI text |

## Run Locally
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Author
**Sharifa Alzubaidi** · [X](https://x.com/7sh_mk) · [LinkedIn](https://www.linkedin.com/in/sharifa-alzubaidi-ksa/)
