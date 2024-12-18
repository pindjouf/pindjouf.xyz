---
title: "Chord Functionalities"
description: "A deep dive into chord relationships, tonic functions, and modulation techniques in music theory, with examples in F# minor."
date: "2022-01-23"
lastUpdated: "2022-01-23"
author: "pindjouf"
slug: "chord-functionalities-music-theory"
nextPost: "hello-world"
tags:
  - "music-theory"
  - "chords"
  - "modulation"
  - "harmony"
  - "composition"
category: "Music"
readingTime: 8
language: "en"
tableOfContents: true
---

The tonic chord is the big boss, no matter what you’re doing there comes a time when you have to return to it otherwise you’re just building tension indefinitely, and no one wants to hear that.

So understanding how a chord relates to the tonic chord is essential in music.  
You have to know the intervals from and back to the tonic, and how they communicate between each other.

Let’s take the key of **F#** minor, its chords are the following:

1.  **F#m**: **F#**, **A**, **C#**
2.  **G#°**: **G#**, **B**, **D**
3.  **A**: **A**, **C#**, **E**
4.  **Bm**: **B**, **D**, **F#**
5.  **C#m**: **C#**, **E**, **G#**
6.  **D**: **D**, **F#**, **A**
7.  **E**: **E**, **G#**, **B**

As you can see there’s a beautiful replacement effect in our 1,3 and 5 chords.  
Each note goes left while replacing the 5th with its 7th:

**F#m**: **F#**, **A**, **C#**  
**A**: **A**, **C#**, **E**  
**C#m**: **C#**, **E**, **G#**  

Another interesting effect that takes place is shown by how simple modulation can sometimes be.  
Take your tonic and sub-dominant chords for instance and let’s see how we can modulate "endlessly":

**F#m**: **F#**, **A**, **C#** / Dominant of **Bm**  
**Bm**: **B**, **D**, **F#** / Our new tonic and the dominant of **Em**  
**Em**: **E**, **G**, **B** / Our new tonic that simultaneously brings us to a new key and the dominant of **Am**  
**Am**: **A**, **C**, **E** / Our new tonic and the dominant of **Dm**  
**Dm**: **D**, **F**, **A** / Our new tonic and the dominant of **Gm**  
**G#°**: **G**, **Bb**, **D** / Our new tonic and the dominant of **Cm**  
**Cm**: **C**, **Eb**, **G** / Our new tonic and the dominant of **Fm**  
**Fm**: **F**, **Ab**, **C** / Our new tonic and the dominant of **Bbm**  

As you can see we’ve gone through multiple scales and yet there are still more to discover.  
Equivalently, using major chords is an option that allows us to either head to a major key or provide a more intense resolution when we do end up changing to our minor tonic of choice.  
  
Also take note that the transition from chord 1 to 4 is simply raising the third and fifth degree to its second / 9th all whilst making our ex-tonic the new fifth. See detailed explanation below;  
(Inverted tonic chord / **Bm** for illustrative purposes only)

**F#m**: **F#**, **A** **C#**  
**Bm** 2nd inv: **F#**, **B** **D**} in natural minor the tonic chord's 3rd degree goes up a whole tone and the 5th goes up by a semitone.

**F#m**: **F#**, **A#** **C#**  
**Bm** 2nd inv: **F#**, **B** **D**} in harmonic minor the tonic chord's 3rd degree goes up a semitone and the 5th goes up by a semitone.

**F#m**: **F#**, **A#** **C#**  
**Bm** 2nd inv: **F#**, **B** **D#**} in natural major the tonic chord's 3rd degree goes up a semitone and the 5th goes up by a whole tone.
