---
title: "Information gathering/Reconnaissance (passive)"
description: "An introduction to passive reconnaissance in penetration testing, using real-world analogies to explain core concepts and methodologies."
date: "2024-12-11"
lastUpdated: "2024-12-11"
author: "pindjouf"
prevPost: "oscp-preparation-log-1"
slug: "passive-reconnaissance-guide"
tags:
  - "security"
  - "pentesting"
  - "recon"
  - "hacking"
  - "infosec"
category: "Security"
readingTime: 15
language: "en"
ogImage: "/assets/4_digit_pin_lock.jpg"
tableOfContents: true
series: "Pentesting Fundamentals"
seriesOrder: 1
---

I'm learning how to pentest, and I was reading an [article on attack surface analysis](https://cheatsheetseries.owasp.org/cheatsheets/Attack_Surface_Analysis_Cheat_Sheet.html#defining-the-attack-surface-of-an-application) by [OWASP](https://owasp.org/) today. But it was too interesting to just sit there and keep reading so I started ranting to myself. After my rant was over, I was quite satisfied with it. So now I'm here writing it down for all those interested in the subject matter, and to consolidate my knowledge. Feynman style.

All of this stems from a thinking paradigm I learned from George Hotz. In his stream titled [*"what is programming?"*](https://youtu.be/N2bXEUSAiTI?si=785VNsBWhCNoiPG) he boils down hacking (and computers for that matter) to **input -> system -> output**. This visual aid serves as a reference to the question: "*What input to the system, will generate my desired output/outcome?*" but the workflow in hacking is actually the reverse. Based on the seven stages of a pentest, we'd start by figuring out the desired output and work our way down from there.

As I read through the article with that paradigm in mind, I couldn't make sense of it all. So I decided to stop, walk around and try to apply the concepts to a "*real*" scenario. I needed something simple to work on, so I settled on using a gym padlock I had lying around. This padlock would serve as the main topic of my rant, which went through every step in the paradigm. Suffice to say that the desired outcome is pretty easy to define. Any person off the street could guess what information we're trying to get in the recon phase of a hack/pentest, with reasonable accuracy. But we shouldn't take its simplicity for granted, as it's one of the first steps towards a successful hack/pentest.

<img src="/assets/4_digit_pin_lock.jpg" alt="4-digit PIN padlock" style="width: 40%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center;">
    <i>Figure 1: A 4-digit PIN padlock</i>
</div>

For this scenario, we'll assume the role of a thief. Which happens to go to the gym quite often. In the locker room, he's often faced with members securing their bags with a padlock. Up to that point he'd always stolen from easy targets, like the elderly in the streets. As he started to level up with his skills he decided to look for missions that wouldn't cause as much trouble. Like stealing from people that aren't present, so he chose the gym locker room as his new workplace.

## Output

We're actually pretty far along in figuring out what we'd like to get out of this mission already! The desired outcome is straightforward, unlock the locks without raising any suspicions or causing a fuss. It's a short section. But one that when well defined, will help you on your mission. And without it, we wouldn't know where to start.

## System

Our target (the padlock) works in a certain way. By figuring this out, we'll be able to move along to the next section and look at potential exploits. From what we know about padlocks, having used some before and seen others interact with them. We won't have to guess too much about it's inner workings. But it's by iteratively looking into how the system works that we discover new ways to poke at it, perhaps there's some things we hadn't seen before that are now present. Or functionalities we didn't care to check.

The main function of a padlock is to prevent access to secured items until the right combination of digits is provided. Things like this may seem obvious, but it's important to define them clearly and ponder on our definitions before moving forward. Padlocks like the one we're focused on, aren't that complex. So simply getting that basic definition of the systems functionality will be crucial to our next step. Since the padlock expects the right combination of digits to grant us access, the next logical question to ask would be: **"How do I get the right combination of digits?"**

## Input

One *"easy"* way to figure out the right combination, would be to just try every one of them from 0000 through 9999 until we find it. This is called **brute-forcing** and it can make sense in some contexts, although it's still manageable in our example with 4 digits, think about what happens when we start dealing with 5, 6, 7-digit combinations? A common technique to accelerate such tasks is to enumerate over a list of common values. This ensures we don't spend time trying the ones with low probability, and effectively reduces the time it takes to find a solution. In a computing context, this would allocate the machines ressources more efficiently, since it would have to process less data to come to a conclusion.

<img src="/assets/common.jpg" alt="List of common 4-digit PIN combinations" style="width: 70%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center;">
    <i>Figure 2: A list of common 4-digit PIN combinations</i>
</div>

Something else we could try is to simply watch the owner input the right combination. This is similar to the concept of **sniffing** data on a network. Just like eavesdropping, you simply need to be present in the room where the information is being exchanged to hear what you need to hear. There's nothing more to it other than being relatively discreet, and coming up with a good excuse if you get caught. Although this is getting quite intrusive in the context of passive information gathering, which could lead you to believe we're bordering on active recon. Some would still consider this as passive (although loosely) since we're not directly interacting with the target.

## Mapping out our attack surface

Something I should've talked about earlier in the article, is the purpose of information gathering/reconnaissance. Which is to identify and/or expand our attack surface. But oh well here we are. An attack surface is defined by everything a threat actor could possibly use to get in and/or cause damage.

Here's a non-exhaustive list of the components we could identify on a mission such as the one we did:

**Physical Components:**
- Padlock mechanism itself
- Lock shackle and body
- Physical wear patterns on frequently used numbers

**Human Components:**
- Padlock owner
  - Personal information (birthdays, anniversaries)
  - Daily routines and gym habits
- Other gym members
  - Potential witnesses
- Gym staff
  - Security protocols
  - Observation patterns
- Cleaning staff
  - Access patterns
  - Schedules

Environmental Components:
- Locker room layout
- Security camera placement
- Mirror placement
- Time-based factors (peak hours, quiet periods)

To tie it back to the George Hotz paradigm, we can link it in the following ways.

```txt
input {
- brute-forcing
- sniffing
}
system {
- padlock
- padlock owner (I mention why/how in the next paragraph)
}
output {
- access granted to padlock
}
```

### Look between the lines

I've purposely left out some things in our example, to show how iteratively checking for new information always proves to be helpful. So far we've only considered the padlock as a **system** to study. But what about its owner? There are various data we could get by taking the human as our system. For instance we know that to choose a combination the person thought about it. There's obviously no point in selecting a PIN that you won't remember. Which means the owner **has to** remember the PIN! It might seem like I'm exagerating on the importance of that piece of information, but let's see how it could be beneficial in our quest for the right combination.

The human memory tends to be associative. Meaning we mostly remember information that is relevant to our lives. If something has no connection or relevance to us, our brain quickly forgets it. So for the PIN combination, we know that our target either chose something that's easy to remember (see Figure 2), or something that means a lot to them. We could easily tie that back to a birhtdate for instance (in DD:MM or MM:DD) as it's something that people often hold onto dearly. It could be the birthdate of a loved one, a celebrity or their own.

I can imagine you now understand that shifting our idea of what the **system** can be, is beneficial in several ways. It makes us recontextualize the whole situation, like how we were able to narrow down the PIN code to birthdates, just by thinking of the padlock owner as a **system**. Of course we'd still be guessing, but we'd be doing it with a much smaller sample size, which increases the efficiency of the method. Moreover we have to consider the fact that this **is** the nature of hacking/pentesting. We're always dealing with incomplete information, but we have to keep advancing despite that fact. This is especially true in the stage of passive Information gathering/Reconnaissance.

## Endnotes

This article has drifted away from being purely recon-based a few times, but I truly believe in giving the full picture in any material that's been designed to teach. That's how I learn best, so It'd be a disservice to my readers to not offer the same treatment I appreciate.

I recognize that this has mostly been theoretical, but my reasoning is that the thinking framework matters more than the technical aspects, tools, etc... Because a well defined framework can do without tools, but the same cannot be said for the opposite. That's why I wanted to start with this. Also, I could never for the life of me, remember every tool that is out there. I will probably end up making my own tool that interacts with all these other tools, how's that for a spin?

That way I won't have to remember any names or the weird ways the devs have decided to make it work, I'll simply click, click and click to get what I want haha. I intend on writing a more technical article after practicing with some tools though, don't get me wrong they're all great but there's just too many and with the paradigm we've studied today, you'll inevitably end up learning new tools, protocols, techniques, etc because that's part of studying a **system** and since they're all just a liiiiiitttle bit different, you'll have to adapt and use different things to compromise them!

If you have any comments on this article feel free to reach out to me on [X](https://x.com/pindjouf).
