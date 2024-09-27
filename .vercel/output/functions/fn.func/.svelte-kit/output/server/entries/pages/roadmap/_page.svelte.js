import { c as create_ssr_component } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<html lang="en" data-svelte-h="svelte-d1yolj"><head><meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>@Pindjouf</title></head> <body><div id="content"></div> <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script> <script>document.getElementById('content').innerHTML = marked.parse(\`
# Roadmap

I found an interesting exercise on X (formerly twitter) from [@dannypostmaa](https://x.com/dannypostmaa), so I did it.

[OG post](https://x.com/dannypostmaa/status/1755216233568649675)

The goal is to narrow down your area of focus for the next few years to something tangible, here is how I've completed it:

## Instructions

- craft a 10X vision (audacious goal)
- cut it up into a 3 year plan
- cut this year up into milestones to reach this years goal
- write down tasks on how to achieve those milestones

## 10x Vision

- Become *Remotely* Successful --> Revenue From Anywhere In The World

### Year 1 Plan -- 2024

- Get Cyber Job (Offer)
    - Rack Up 6k For A Year In Thailand

### Year 2 Plan -- 2025

- Start Freelancing or remote job
    - Get To > 1k MRR
    - Move To Thailand

### Year 3 Plan -- 2026

- Scale To Family MRR
    - Get Mouthfeeding MRR

## Year 1 Milestones + Tasks

- [x] **Get Selected For Bootcamp**

- [ ] **Get Internship**

- [ ] **Get Job & 6k**
    - Optimize [CV](https://www.theladders.com/career-advice/the-high-score-resume-format-how-to-write-a-resume-for-2020) with buzzwords | add extra years of exp on things you know well.
    - Apply to random jobs just to upskill your interviewing skills.
    - Make a tight little script, explaining your story 1-2 mins.
    - Have one banger project. [kof](https://github.com/pindjouf/kof)

## Year 2 Milestones + Tasks

## Year 3 Milestones + Tasks
\`);<\/script></body></html>`;
});
export {
  Page as default
};