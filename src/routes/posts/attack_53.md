---
title: "Attack on 53: A Deep Dive into DNS hacking"
description: "An in-depth technical exploration of DNS architecture, from basic principles to advanced concepts. Learn how DNS works from the ground up, including resolver types, zone authorities, and hierarchical resolution. Understand DNS from multiple perspectives: as a system administrator, programmer, and security professional."
date: "2024-12-11"
lastUpdated: "2024-12-11"
author: "pindjouf"
published: false
prevPost: "passive-reconnaissance-guide"
slug: "domain-name-system-dns-guide"
draft: true
tags:
  - "dns"
  - "networking"
  - "security"
  - "recon"
  - "infosec"
  - "infrastructure"
  - "system-design"
category: "Technical"
readingTime: 25
language: "en"
tableOfContents: true
featured: true
---

## A hacker's perspective

Finally, at last. Let's get into how to hack on DNS! I'll be breaking the promise of only keeping this in the realm of passive recon because I took way too long to finish this article and I've been advancing a bit in the topics I'm covering. As we've seen up to this point, it's one of the most critical systems on the internet. So digging into all the previous sections will help us understand how and why the following techniques work. Furthermore, it goes without saying that DNS is a very interesting system to target because of all the information it contains!

I'll try to not bombard you with full commands and code snippets here. Because even though we're going to be covering the practical side of things, I think it'd be doing the reader a disservice to show answers for everything. I find that I'm able to retain information much better when I have to work on finding solutions myself. You don't have to go write full scripts just to understand small bits of infomration but, I think that going and writing your own solutions, no matter how small, is never insignificant. You can do it as practice if you wish, this is similar to a concept called [**études**](https://en.wikipedia.org/wiki/%C3%89tude) in music.

> An étude (/ˈeɪtjuːd/; French: [e.tyd]) or study is an instrumental musical composition, usually short, designed to provide practice material for perfecting a particular musical skill.  
-- ***Wikipedia***

Jim Morrison used to follow a similar practice to improve his vocabulary[[⁴]](#endnotes) by writing stories around each new word he would learn. This cycle of learning new information and practicing applying it in different contexts and scenarios is the blueprint to effective knowledge consolidation, as your brain becomes flexible to the ideas and understands how and when it makes sense to apply them.

I invite you to do the same while reading this section!

Another important thing to note is that all recon is cyclical. Meaning that every new piece of information you get can unlock new pathways of investigation. And it keeps going until there's nothing left to find. (which practially never happens)
It's akin to diving down a rabbit hole on YouTube (back when that was still possible), each new video made you pull at the thread and you kept unveiling new information on what you were investigating. You're just like a hamster in a hamster weel, chasing the next bit after bit, but it's important to know when to get off or automate further research. Because at some point you'll experience diminishing returns that might not be worth the squeeze.

### DNS Enumeration

The first and most obvious way to use DNS from a hacker's perspective and to expand our attack surface, is to find records. These will help us by mapping out the target's network infrastructure. I'm sure you can imagine that finding two hostnames pointing to addresses that are in the same network range could reveal valuable information about their network topology and potential trust relationships between systems.

A simple way to get the corresponding IP of a domain name is to use the [**host**](https://linuxcommandlibrary.com/man/host) command. There's a simple 1-to-1 relationship here, that will allow you to start building short scripts to automate this search based on the responses you get. Effectively brute-forcing your way to a list of valid/valuable hosts. The responses you get from this command are very minimal, something that is nice when all you need is an IP/nameserver/domain name pointer or to check the validity of a potential resource.

Typical responses look like this:

```txt
pindjouf ~ host noirchapeau.com
noirchapeau.com has address 76.76.21.21
noirchapeau.com mail is handled by 10 redir.epik.com.
pindjouf ~ host edu.noirchapeau.com
edu.noirchapeau.com is an alias for c4cbb505df-hosting.gitbook.io.
c4cbb505df-hosting.gitbook.io has address 172.64.147.209
c4cbb505df-hosting.gitbook.io has address 104.18.40.47
c4cbb505df-hosting.gitbook.io has IPv6 address 2606:4700:4400::ac40:93d1
c4cbb505df-hosting.gitbook.io has IPv6 address 2606:4700:4400::6812:282f
```

Now that you know a new command, try to figure out how you could emulate the basic function of a popular tool like [Sublist3r](https://github.com/aboul3la/Sublist3r) by discovering the subdomains of a specific domain.

I made a simple script to learn how to do this myself, you can check out the repo right [here](https://github.com/pindjouf/)

We've only seen how to discover subdomains through brute-forcing, which isn't the only way to do it. We can also leverage search engines like google or bing by doing what's called google dorking. Or scrape data from DNS services like Netcraft, DNSdumpster, etc...

## Introduction to DNS Security
- Key attack surfaces in DNS infrastructure
- Why DNS is a critical target
- Common misconfigurations and vulnerabilities

## 1. DNS Enumeration & Reconnaissance
### Information Gathering Fundamentals
- Record types and their security implications
- Manual vs automated enumeration techniques
- Tool overview (dnsenum, subfinder, amass)

### Advanced Enumeration Techniques
- Certificate transparency logs
- DNS zone transfers (AXFR/IXFR)
- Brute force vs intelligent enumeration
- OSINT integration with DNS recon

## 2. DNS Cache Poisoning
### Understanding DNS Spoofing
- Message format manipulation
- Transaction ID prediction
- Race conditions in DNS

### Cache Poisoning Techniques
- Kaminsky attack methodology
- Birthday attacks against DNS
- Response manipulation strategies
- Modern cache poisoning variants

## 3. DNS Tunneling
### Data Exfiltration
- DNS query/response structure abuse
- Encoding techniques
- Detection evasion strategies

### Command & Control
- Building DNS-based C2 channels
- Protocol limitations and workarounds
- Real-world DNS tunneling case studies

## 4. DNS Amplification Attacks
### DDoS Fundamentals
- UDP reflection basics
- Amplification factors
- Open resolver abuse

### Advanced Amplification Techniques
- ANY query abuse
- EDNS0 exploitation
- Multiple resolver chaining

## 5. DNS Infrastructure Attacks
### DNS Hijacking
- Registrar-level attacks
- Resolver manipulation
- Infrastructure takeover techniques

### DNS Rebinding
- Same-origin policy bypass
- Internal network access
- Modern rebinding techniques

## 6. Advanced DNS Exploitation
### Protocol-Level Attacks
- DNSSEC exploitation
- Zone walking techniques
- NSEC/NSEC3 analysis

### DNS Covert Channels
- Domain generation algorithms
- Steganography via DNS
- Custom record type abuse

## Practical Tools & Techniques
- Building custom DNS tools
- Automated attack frameworks
- Detection evasion strategies

## Defense & Mitigation
- Modern DNS security measures
- Common defense bypass techniques
- Future of DNS security

## Endnotes

**Citations:**

[1] Interview with Jim Morrison's father and sister YouTube, Aug 9, 2010. [Online video]. Available: https://youtu.be/Kz63-q8otYM?si=VZ8Q1r7DmZ8yJLZQ&t=16
