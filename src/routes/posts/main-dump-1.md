---
title: "MainDump #1"
description: "A collection of personal notes, project ideas, and inspiring quotes from my main.md file, including current tasks and reading recommendations."
date: "2024-11-08"
lastUpdated: "2024-11-08"
author: "pindjouf"
slug: "main-dump-1"
tags:
  - "notes"
  - "projects"
  - "ideas"
  - "personal"
category: "Notes"
readingTime: 5
language: "en"
series: "MainDump"
seriesOrder: 1
---

I keep a `main.md` file on all my devices, and I sync it with git. That's the main idea behind [kof](https://github.com/pindjouf/kof) (currently in the pits of side project hell). As a way to maintain anti-fragility over that commit history I've decided that I'm gonna dump the file's state on this web page once in a while to have another copy of it, because why not.

Here it is:

# Stuff to keep in mind

*First you get the money, then you get the power, then you get the woman.*

Cure to perfectionism -> [video](https://youtu.be/nMViEZzAIxc?si=wSd6PC8CNAzFkhk9)

## Side project ideas

### calendar ai type shit

- mfs prompt for a schedul
- get a .ics with that schedule

### find bars, venues, third places that play the music u listen to on spotify (live music or not it doesn't matter)

#### notes

GOOGLE_MAPS_API_KEY=

### OpenGraphed

I can't figure out og:image so I want to make a website to fix it.

- user inputs url of their website
- bot goes on url, screenshots
- resize to right format for twitter and open graph while preserving quality
- upload screenshots to https://imgbb.com/
- spit out `<meta property="og:image" content="https://your-image-url.com/image.png">` and `<meta name="twitter:image" content="https://your-image-url.com/image.png">`

## uart -- current task(s)

- uart top_module

## cryptoooor -- current task(s)

- config -> hash, salt, key
- funcs for converting hex to Vec<u8> and vice-versa -> key interops

## kof -- current task(s)

- make syncing great
- hide dotfiles (.git) in fuzzy finder -> in find()
- trim empty bottom lines. (fix journal files formatting) -> in create_entry() -> check [cw](https://github.com/pindjouf/perso_rustlings/tree/master/1.cw) line counter, do the same but check line content if empty check if previous empty. if condition is true trim that shit.

## toread

- [Museums of the future](https://vitalik.eth.limo/general/2024/08/03/museumfuture.html)

## quotes

> *A mediocre product with an audience has more impact than a cure to cancer without any.*  
> *The yap is a force multiplier.*  
> *There are no right or wrong ways to do things, only ways to do them and ways not to.*  
> *The bigger your house, the less you see it.*  
