---
title: "OSCP Log #2"
description: "A deep dive into web security challenges, evolving study methods, and experiments with polyphasic sleep while preparing for OSCP"
date: "2025-01-22"
lastUpdated: "2025-01-22"
author: "pindjouf"
slug: "oscp-web-log-2"
prevPost: "day-1-arm-assembly-basics"
tags:
  - "oscp"
  - "infosec"
  - "ctf"
  - "web-security"
  - "study-methodology"
  - "personal-growth"
category: "Security"
readingTime: 15
language: "en"
featured: true
published: false
---

### Table of Contents

<div class="toc">

1. [A new schedule & a polyphasic experiment](#a-new-schedule--a-polyphasic-experiment)
2. [A new study methodology](#a-new-study-methodology)
   1. [Consciousness expansion](#consciousness-expansion)
   2. [Connecting the dots](#connecting-the-dots)
   3. [Feynman method](#feynman-method)
3. [Penetrating the web](#penetrating-the-web)
   1. [Ben 10 -- A first experience with broken access control](#ben-10--a-first-experience-with-broken-access-control)
      1. [Enumeration](#enumeration)
      2. [Foothold](#foothold)
   2. [MZEEAV](#mzeeav)
      1. [Enumeration](#enumeration-1)
      2. [Foothold](#foothold-1)
   3. [Sightless](#sightless)
      1. [Enumeration](#enumeration-2)
      2. [Foothold](#foothold-2)
4. [End notes](#end-notes)
   1. [Songs I spammed last week](#songs-i-spammed-last-week)

</div>

Welcome to the second log of my OSCP/pentesting journey!  
It's now been about 2 months since my original purchase of the Learn One subscription, and I've definitely not spent enough time on it since then unfortunately. But this isn't an article to complain, I want to propose solutions to the problem(s) rather than whining about it.
I also want to talk about a few updates on my schedule, experiments & boxes I did during week 3 of 2025 (lots of web stuff).

## A new schedule & a polyphasic experiment

If you remember the schedule from [OSCP Log #1](https://pindjouf.xyz/posts/oscp-preparation-log-1), hats off to you, because I don't. I threw that one out the window a few days in, it was too restrictive and I often found myself drifting over it throughout the day. For one I barely adhered to the sleep schedule because I rarely wake up that early if I don't have something important to do, it's far too unnatural for me. Furthermore the workouts were planned as a way to deal with the frustration of "missing" out on life and staying at a desk all-day everyday. But that's far from what I've been experiencing. So I kinda gave up on working out for now, and that in turn reduces my need to consume food, which gives me more time in the day and makes the 3-4 meals I'd planned obsolete. I barely need one meal to stay energized and primarily consume water, tea and soup now.

For what it's worth, I quite enjoy it. Not because I prefer staring at a monitor and bash my head against problems 24/7 over being a hippie in SEA. But because I understand that everything is cyclical, and I know that these are *sacrifices* I have to make at the moment to ensure a better future. I kept up with the ultradian cycle based work/break blocks for quite a while though, through the use of [STD](https://github.com/pindjouf/std) (alledgedly a timer daemon, but that's debatable). Although I'm not as strict on it anymore, I find that having this idea of preparing myself to ***get into a work/study session*** feels nice, it's like the feeling before a game of basketball against a good team. You know it's going to be hard but if you and your teammates lock in, you might very well get the win.

This brings me to something new I'd like to try, I've had it floating in my mind (somewhere) for a while. Yet I've never actually stopped to think about how to implement it. I'm talking about polyphasic sleep. If I'm not mistaken, it's not supported by any scientific research at all and is purely an anecdotal thing. But these kinds of practices, no matter how anectodal, have helped me countless times in my life. So I have no reason to be too sceptical about it. I mean we all know someone that can get into deep sleep at the drop of a hat. And while that's often caused by a prolonged state of sleep deprivation, I think that with careful planning we might actually be able to hack our way around this and get to live more life per unit of time! I've never liked sleep, but I've always needed so much of it. That's why I've always tried to get it dialed in, during periods in my life where I needed to be extra-sharp mentally.

If you're a podcast-bro you're probably familiar with the Huberman Lab. That's where I first started hearing about practices to get better sleep. I've been able to derive lots of value from his conversation(s) with Dr. Matt Walker, so here's a **very condensed and simplified summary of what I learned from it:** 
- **Light:** Get as much as possible of it in the morning + throughout the day, minimize when approaching bed time and ideally have none in your bedroom (to sleep obviously).
- **Routine (circadian rhythm):** Get in and out of bed at roughly the same time every day, no exceptions for weekends.
- **Substances:** Space out caffeine consumption from bedtime as much as possible, this is especially important to pay attention to if you're very sensitive to it. Alcohol makes falling asleep easier, but despite that it worsens the actual quality of it.

Ironically enough, they dismantle the idea of polyphasic sleep in the first podcast. Dr. Matt Walker, clearly states that it mostly brings disease and a poorer quality of life if anything. But being that I'm young and healthy (the perfect combination for stupid decisions), I'll see what happens and report back. I haven't even planned this carefully like I suggested earlier, I'll mostly sleep when I'm tired and try to make that fit my schedule.  
Anyways, that's enough about the shell[[¹](#endnotes)] let's get back to studies and pentesting.

## A new study methodology

I've noticed that my approach of simply reading documentation about how things work without ever seeing someone do it, in things like say a tutorial, was tremendously hindering my progress. I don't know why I felt so opposed to tutorials and guides that show you how to do things. Perhaps I was scared of the echoes I heard about tutorial hell, I mean everyone on the internet is talking about how to get out of it, but my approach was too extreme! I'm now much more flexible about those and in fact they're a core component, of my new methodology. It is structured in **three phases**. Consciousness expansion, Connecting the dots, and the Feynman method. Dramatic names I know...

### Consciousness expansion

This is the **exploration phase**, where I follow guides, tutorials and read as much as I can about a topic. Really the idea here is to expose myself to all the angles of a topic, it's not possible to discover them all because of time constraints and the constant nature of change, but goals don't always have to be reachable. In fact those are the most fun.

### Connecting the dots

This is the **experimental phase**, which lets me be creative and put my own spin on things (something I like a lot). Once I've acquired one, two or more basic experience with the thing I'm learning, I start poking at it in several ways to really understand the core of it. A very simple example could be if you're *learning programming* and they first show you how to print a hello world in python. The tutorial could be showing you: `print("Hello, World!")` you could experiment by changing the string argument, print a variable instead, print a return value, etc... What all these little experiments teach you is invaluable, and something you can't get from a tutorial. That's why at first I just look at how it's done, then I take that and try to tweak it just a little bit, in *insignificant* and/or significant ways, to push my understanding of what stands at the core of this thing. With our hello world example you'd now understand some things about the `print()` function that weren't shown in the tutorial, and so you'd have effectively *forked* a project. There's so much to learn from such little experiments and I see them as redefining the thing in your own words. People often advise you to do just that (redefining things in your own words) to see if you really got it, and aren't just regurgitating the definitions that were fed to you. Which brings us to the last phase.

### Feynman method

The last part is the one I enjoy the most, I get to vibe out listening to music, while writing something I think is interesting and useful. I'm not going to explain what the feynman method is, that's been covered in detail all over the internet much better than I could. But to me, it simply means ***learning through teaching***. If you need more information on it, google's your friend (or is it?). It's a good test to check yourself and your confidence level around a topic. And ultimately we can say that confidence is a proxy for trust. But my LT always said ***trusting is good, but verifying is better.*** And that's exactly what these technical articles do for me, they're part of the knowledge verification pipeline. (I had to reach far to connect that one, I'm doing too much fr)

## Penetrating the web

I didn't plan for it but last week had a very web-oriented vibe to it, that's why this section is called that way. Armed with my new methodology and an inspirational X (formerly twitter) post, I was on my way to spamming boxes (not as many as I'd like to since I started this mid-week and have been a bit overwhelmed by things outside of studies).

Part of what pushed me to change my study methodology to be more tutorial-friendly was this post of someone getting their OSCP at 16 and subsequently becoming a full-time pentester (from the looks of it) 

<img src="/assets/oscp_post.png" alt="A satirical post with an interesting thread" style="width: 80%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center;">
    <i>A satirical post with an interesting thread -> <a href="https://x.com/thoughtfault/status/1862602310385348616">https://x.com/thoughtfault/status/1862602310385348616</a></i>
</div>

OP advises us to follow a volume based approach where we focus mostly on doing HTB and watching all IPPSEC videos *twice*. This confirms what I've been told at [Noir Chapeau](https://noirchapeau.com), where I got the advice to start following walkthroughs to understand how things are actually done. Overall, it was a good week that served as an introduction to web pentesting. I learned about Broken access control, SSRF, SSTI and XSS through these boxes:

- Ben 10 (srdnlen CTF)
- MZEEAV (PG Practice)
- Sightless (HTB)

### Ben 10 -- A first experience with broken access control

I did a CTF last weekend where I performed quite poorly. It's the first one I did on my own, so I really got to see in what areas I was lacking skills. Well, it turns out I'm bad at everything pentest related since I only managed to get 3 flags and 1 one of them was greppable so it barely counts. This was a good wake-up call and showed me how trash I was, this L will drive me until I git gud at pentesting.

Anyways here's a challenge called Ben 10 I was able to solve i.e. the one most participants got 360/800!!

Here's the description we had to work with:
> Ben Tennyson's Omnitrix holds a mysterious and powerful form called Materia Grigia — a creature that only those with the sharpest minds can access. It's hidden deep within the system, waiting for someone clever enough to unlock it. Only the smartest can access what’s truly hidden.
Can you outsmart the system and reveal the flag?
Website: http://ben10.challs.srdnlen.it:8080
Author: @gheddus

#### Enumeration

As evidenced by the URL, you can see that we're pretty deep in the subdomains category so I didn't look into that area at all, they also gave us the source code so I already had access to all the routes and didn't bother fuzzing that either.

<img src="/assets/ben10_login.png" alt="Ben 10 login page" style="width: 80%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center;">
    <i>Figure 1: Ben 10 login page</i>
</div>

From the source code we could see this was a Flask app, we also had a Dockerfile which is always fun when modifying the code. I didn't have any credentials yet, so I decided to create an account with these `logo:logo` and login to see where it would lead us. We also had a `database.db` but there was nothing inside it besides a table and columns.

<img src="/assets/ben10_home.png" alt="Ben 10 home page" style="width: 80%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center;">
    <i>Figure 2: Ben 10 home page</i>
</div>

The source code explicitly shows us how to get the flag in this dynamic route (the image viewer):

```python
@app.route('/image/<image_id>')
def image(image_id):
    """Display the image if user is admin or redirect with missing permissions."""
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']

    if image_id == 'ben10' and not username.startswith('admin'):
        return redirect(url_for('missing_permissions'))

    flag = None
    if username.startswith('admin') and image_id == 'ben10':
        flag = FLAG

    return render_template('image_viewer.html', image_name=image_id, flag=flag)
```

Here we can take a few interesting notes. For one, our username is used in the session token, and the `ben10` image is only available to users whose username starts with `admin`. That's where the flag is located, so nothing complex here. There's only one condition preventing us from getting to it. That seems simple enough to solve right? I think the two most logical hypotheses to derive form this are to go create an account that starts with `admin` or even spinning up the docker container and removing that restrictive condition.

Well I quickly got met with the fact that this wasn't entirely possible because they'd made the environment variable for the flag in the Dockerfile a test flag so no luck there. And when I tried to create a new account that starts with `admin` I realized there was in fact more than one condition blocking our administrative dreams.

In the `/register` route they would do an early return if we tried to create our desired account.

```python
if username.startswith('admin') or '^' in username:
    flash("I don't like admins", "error")
    return render_template('register.html')
```

#### Foothold

At this point it became clear to me that we probably weren't going to have a lot of options to solve this through the webapp/GUI itself. Remember that session token? Well it has our username in it, doesn't it? Perhaps if we could change that we'd finally get the flag I thought.

I went into devtools and saw it looked like this `session:"eyJ1c2VybmFtZSI6ImxvZ28ifQ.Z424XA.p-k-WRv_LtS8ji-Q_b97hZ0nYxA"`

To identify which part was our username, I logged in and out a couple times to clear the session.

```js
Accounts:
- logo:logo -- session: "eyJ1c2VybmFtZSI6ImxvZ28ifQ.Z4wJhg.d-GtEtjuAlZ26VoXO582_8TXvSc"
- logo:logo -- session: "eyJ1c2VybmFtZSI6ImxvZ28ifQ.Z4wPBQ.UTntgoSlqGdFsH2qQLqBN2p1-ss"
- logo:logo -- session: "eyJ1c2VybmFtZSI6ImxvZ28ifQ.Z4wPVA.tA1NDFAx0sfZqmjiNzQsf-5kFQA"
```

This showed us a static part of the token but wasn't enough proof for me so I created accounts with different usernames to push the hypothesis further.

```js
- asmin:asmin -- session: "eyJ1c2VybmFtZSI6ImFzbWluIn0.Z4wQkA.OfGUJplEJF4C685buWybGaR-t74"
- qwertyuiop:qwertyuiop -- session: "eyJ1c2VybmFtZSI6InF3ZXJ0eXVpb3AifQ.Z4wRFg.FMBz-9MefXCyPANwMx-GrsyBRDU"
```

Now we could clearly see what part of the string was our username i.e. the first sequence before the period. This got confirmed by base64 decoding that part of the token and getting output like this `{"username":"qwertyuiop"}` or `{"username":"asmin"}` or `{"username":"logo"}`.

Now that we were sure of this, we'd simply have to modify that value to start with `admin` and get the flag. Unfortunately, when I went to manually modify the username part of the token I got logged out. That makes sense since the token probably became invalid.

Now we had to find an alternative way to get a token that starts with `admin` the best way to do this I thought was to log into an account that starts with `admin` get that token and use that value to get the flag. As we've seen though, we can't create that. But if we simply removed that condition from the `app.py` and ran the app locally, we'd still get a valid token! So I did just that and got this out of it: `eyJ1c2VybmFtZSI6ImFkbWluIn0.Z43Dow.XIllJ1ZgdtjGbW5F3ge3iOACjX0`. This is a valid token because it was generated by the app itself and starts with `admin`, in fact that's all I put as the username -> `{"username":"admin"}`.

Now we'd simply have to visit http://ben10.challs.srdnlen.it:8080/image/ben10 with that session token, and there it was!

### MZEEAV -- Getting a web shell through file uploads



#### Enumeration

#### Foothold

### Sightless -- SSRF leading to root!

#### Enumeration

#### Foothold

## End notes

I've got nothing else to say, cya.

### Songs I spammed last week

- [The Mamas & The Papas - Dancing Bear](https://www.youtube.com/watch?v=HXvyyWBQjck) 
- [Nelly Furtado - Maneater](https://www.youtube.com/watch?v=8wmbSYASPsY)
- [TURQUOISEDEATH - don't look back](https://www.youtube.com/watch?v=Hpth12Qdd8c)

**References:** 

[1] Cool paper about ghost in the shell: https://www.revistaperspectivas.org/perspectivas/article/view/817
