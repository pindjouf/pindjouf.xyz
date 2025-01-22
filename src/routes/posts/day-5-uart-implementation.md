---
title: "Day 5 of making a UART 𓇲 why I made a UART!"
description: "A reflective manifesto on the importance of creating systems to avoid being enslaved by them, inspired by William Blake's philosophy and the cyberpunk hacker ethos."
date: "2025-01-01"
lastUpdated: "2025-01-01"
author: "pindjouf"
slug: "day-5-uart-implementation"
published: true
tags:
  - "cyberpunk"
  - "systems-thinking"
  - "philosophy"
  - "hacking"
  - "technology"
nextPost: "a-few-notes-on-wireguard"
prevPost: "domain-name-system-dns-guide"
canonicalUrl: "https://pindjouf.xyz/posts/why-i-made-a-uart"
featured: true
category: "Philosophy & Technology"
readingTime: 8
language: "en"
tableOfContents: false
ogImage: "/assets/nebuchadnezzar.JPG"
keywords: "systems thinking, cyberpunk hacker, William Blake, manifesto, creating systems, technology philosophy"
summary: "Inspired by William Blake's words, this post reflects on the importance of creating systems to stay in control of technology, rejecting dependency, and embracing the hacker ethos."
---

It's about time we finish the series. As evidenced by the release dates of each UART article, this took far longer than five days. But I find that it looks cleaner this way, so I'm keeping the title! The reason it took so long is actually threefold: First, I didn't dedicate enough time to studying the subject matter before diving into the implementation, which left me confused and frustrated every time I tried coding. Second, I procrastinated quite a bit. And lastly, I've been busy with other things, like job searching and being a hippie in Southeast Asia.

This won't be a super technical article since most of the implementation details have already been covered. If you're looking for that, check out the [repo](https://github.com/pindjouf/uart).

## Happy New Year

Now that we're wrapping up the UART series—Happy New Year! I wanted to make this post to set the tone for 2025. Things are looking a bit better since the [SEA](https://pindjouf.xyz/posts/finally-going-east) article. I've got an internship starting later this month, which is cool, though I might be gaslighting myself into thinking it's more exciting than it actually is.

We aren't quite done with UART yet though, because I still need to explain why I started this journey in the first place. If you've read my other posts, you're probably aware that I think George Hotz is a goat. He made a course outline called [From the Transistor to the Web Browser](https://github.com/geohot/fromthetransistor), which I [forked](https://github.com/pindjouf/fromthetransistor) and have been following loosely for a while (progress has been slow, obviously). 

That's **my** main motivation, but the benefits of learning UART are far broader. It’s taught me foundational concepts in computer communication like, data framing, and error handling—all at the **register** level. These are concepts that will stay with me forever and form a reliable base for everything I build. For instance, this newfound understanding of data framing has helped me implement a [primitive DNS](https://github.com/pindjouf/deem). These foundational ideas are crucial to understanding computer systems, and all tech mfs should learn them.

All computer communications rely on predefined data structures that enable seamless packet interpretation. Here are a few examples from protocols we're all familiar with:

**HTTP:**  
```
[Method][Request-URI][HTTP Version]
[Header Field: Value]
[Header Field: Value]
[Blank Line]
[Body Data]
```

**DNS:**  
```
[Transaction ID][Flags][Questions Count][Answer RRs Count]
[Authority RRs Count][Additional RRs Count]
[Question Name][Question Type][Question Class]
[Answer Name][Answer Type][Answer Class]
[Time to Live][Data Length]
[Resource Data]
```

**IP:**  
```
[Version][Header Length][Type of Service][Total Length]
[Identification][Flags][Fragment Offset]
[Time to Live][Protocol][Header Checksum]
[Source Address][Destination Address]
[Options (if any)][Payload Data]
```

To some, this may seem obvious—you might even be thinking "duh, how else would it work?" But for me, internalizing these ideas has been a series of breakthrough moments. There’s a big difference between *knowing* something and truly *internalizing*, *visualizing*, *feeling* it. Too many people work with data without ever understanding it. They simply accept the rules as they are, without questioning or challenging their own understanding. That makes them slaves to their environment, something I strive to avoid.

## The Cyberpunk Hacker Arc

Here's a quote from William Blake that encapsulates this mindset:

> I must create a system, or be enslaved by another man's. I will not reason and compare: my business is to create.  
***-- William Blake*** 

This idea deeply resonates with me. Here's my favorite artwork of his as well, *Nebuchadnezzar* (totally random mention & rant but who cares. btw if you ever have to offer me a gift it should definitely be this):

<img src="/assets/nebuchadnezzar.JPG" alt="nebuchadnezzar" style="width: 60%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center; padding-top: 10px;">
    Figure 1: Nebuchadnezzar (A king in <a href="https://en.wikipedia.org/wiki/Hubris">hubris</a>)
</div>

The story behind this artwork teaches a profound lesson. Nebuchadnezzar, a once-proud king, was punished by God for his arrogance. He was transformed into a beast, forced to roam the wilderness and reflect on his place in the world. It's a stark reminder of our human limitations and the importance of humility.

Some say we were made in God's image, which means we were meant to create. Yet, so many fail to embrace that role, contenting themselves as passive consumers in every area of life. Don't get me wrong—I'm not bashing those people. I like to be lazy too. But it's unfortunate if that's all your life amounts to. Passive consumption, with nothing of your own to leave behind.

So that pretty much sums up the vibes for 2025: the Cyberpunk Hacker Arc. It's actually the first time in my life that I'll embody the role of a nerd, which I've always been but always tried to avoid. However, I've grown into adulthood with much more confidence in my identity and have much more aura than anyone who could call me a nerd + if you're a relatively normal person and you understand social dynamics, you should be able to make being a nerd look cool. If you can't do it, that's just a skill issue. Please increase your aura and make us look good.

I should stop talking like this—Gen Z Twitter yap makes everything sound so unserious bro—but you get the point. Let’s lock in this year.
