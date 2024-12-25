---
title: "Attack on 53: A Deep Dive into DNS"
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

### Table of Contents

1. [What is DNS Fundamentally?](#what-is-dns-fundamentally)
    1. [Why do we need DNS?](#why-do-we-need-dns)
        1. [Abstraction](#abstraction)
        2. [Load balancing and scalability](#load-balancing-and-scalability)
2. [How does DNS work?](#how-does-dns-work)
    1. [A hierarchical and distributed nature](#a-hierarchical-and-distributed-nature)
    2. [The Resolution Process](#the-resolution-process)
    3. [DNS Iterators and Authority](#dns-iterators-and-authority)
    4. [Understanding Zone Authority](#understanding-zone-authority)
3. [A Programmer's Perspective](#a-programmers-perspective)
    1. [Sockets](#sockets)
        1. [Socket type considerations](#socket-type-considerations)
    2. [Raw bytes as queries/responses](#raw-bytes-as-queriesresponses)
        1. [DNS Queries](#dns-queries)
        2. [DNS Responses](#dns-responses)
        3. [Final considerations](#final-considerations)
4. [A Hacker's Perspective](#a-hackers-perspective)

As promised in my [last article](finally-going-east), I will show you the technical aspect of passive information gathering/recon. However, I don't want to rush and simply brush over topics that are as important as DNS for instance, which is our topic of the day. I want to dive into its inner workings and explore all it has to offer since it's the main component of our attack surface. I say this because without it, we have nothing to look into. It's our main gateway into discovering the attack surface since it reveals subdomains, IPs and other infra details. You can't look into something you haven't found, can you?

I will make this a multipart series so that we have the time to truly cover all the aspects of our subjects. I felt that DNS deserved it's own article, but the next one will probably cover more topics, like the application itself and all its moving parts for instance.

## What is DNS fundamentally?

We'll start the article at a high level and dive deeper as we go by building on our foundation. Keeping with the **input -> system -> output**[[¹]](#endnotes) theme, we'll think of DNS as a black box for now. What we have to figure out first is what it takes (input), and what the system gives back after it's done (output).

An abstract way to address those two points is to see DNS as a system that takes human-friendly computer hostnames (often referred to as domain names) and converts them to IP addresses.

<br>
<img src="/assets/paradigm.png" alt="diagram" style="width: 50%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center; padding-top: 10px;">
    Figure 1: input -> system -> output
</div>

Keep this in mind as we go into more detail because you might feel lost at some point. But with this reference point, you'll have a fundamental understanding from first principles that prevents any unnecessary confusion.  

### Why do we need DNS?

I'd like to go on a brief tangeant about **why** we use DNS. Similarly to a compiler, the DNS's main purpose is to help humans interact with their machines. In the way that it allows us to input something that is easy for us to understand, and translate it to something that is easy for the machine to understand. So what's the problem and how does DNS solve it? Well as you could've guessed, it's practically impossible (or very difficult) to remember the IP addresses of all the internet services we use. And machines don't understand anything other than said IP addresses. So we bridge the gap by using DNS.

#### Abstraction

Although `domain name -> IP` is the primary purpose of DNS, it helps us in many other ways. For instance, it abstracts away the underlying infrastructure by always pointing to an entities' machines. Say a company migrates their servers to a different hosting provider for example. You'd still use the same `example.com` domain, whether their address is `104.218.63.175` or `23.154.89.126` because they would make sure that their domain name always points to it. You can think of it as pattern-matching, here's a code snippet to illustrate this (omitting the actual resolution, we cover this later in the article):

```rust
use std::net::Ipv4Addr;

enum HostingProvider {
    Epik,
    AWS,
}

fn get_server_ip(domain_name: &str, hosting_provider: HostingProvider) -> (String, Ipv4Addr) {
    let ip_address = match hosting_provider {
        HostingProvider::Epik => Ipv4Addr::new(104, 218, 63, 175),
        HostingProvider::AWS => Ipv4Addr::new(23, 154, 89, 126)
    };

    (domain_name.to_string(), ip_address)
}

fn main() {
    let domain_name = "example.com";

    let (domain, ip1) = get_server_ip(domain_name, HostingProvider::Epik);
    println!("{} points to {}", domain, ip1);

    let (domain, ip2) = get_server_ip(domain_name, HostingProvider::AWS);
    println!("{} points to {}", domain, ip2);

}
```

This practice can be done manually by handling what we call DNS records yourself, or automatically through the use of Dynamic DNS. But let's not get carried away here.

#### Load balancing and scalability

Another way DNS proves to be useful is by helping servers manage load, which makes it more scalable since it can handle billions of queries without overwhelming any single server. Like we learned in the section above, one domain doesn't necessarily mean one machine. So DNS can also act as some sort of router, which improves performance both for the user (by routing them to geographically closer servers to reduce latency) and for the servers (by distributing the queries to prevent overload).

## How does DNS work?

Now that we understand the core of DNS, we can explore its hierarchical and distributed nature. And start looking into **how** it actually works, from the original query on your device, to a response.

### A hierarchical and distributed nature

Like i've mentioned before DNS is a hierarchical system, which means that every server or resolver has a specific role in the process of resolving a query. And it's distributed because at every step of this resolution, a different server could potentially be used to continue the process. So what does a typical resolution process look like?

<img src="/assets/resolver.png" alt="tiny people in a power outlet" style="width: 80%; display: block; margin-left: auto; margin-right: auto; background-color: white;">
<div style="text-align: center; padding-top: 5px;">
    Figure 2: Example of an iterative DNS resolver
</div>

As you can see in this image, we have four dns servers. But we're actually going to take a step back for a second, because i want to go through the process of what happens before even getting to the dns iterator. Which we'll get into shortly.

### The Resolution Process

When you send a dns query from your device (like google.com), it first goes to its resolver. The distinction between a server and resolver is very important to make. Because you have to understand that you most likely don't have a dns server on your device, what you have is called a resolver and it's main function is to do exactly that, resolve dns queries. In layman's terms this would mean: find and respond with the IP of a corresponding domain name. 

Your devices resolver (which is called a **stub resolver**) primarily does this by looking through its cache, because every time it successfully finds the response to a query it caches the answer for future use. But what happens when we can't find the record in the cache?

This is where we get into DNSs distributed nature, which is something fundamental that you must grasp before moving forward. Everytime a DNS resolver doesn't have the answer to a query, it goes to the next server in the hierarchy. So in the case of your devices resolver, it would then ask your router for a response (going to the router is not default behavior, but a default in most devices network configurations).

Your router has what's called a **forwarding resolver** or **non-recursive resolver**. It works very similarly to the devices **stub resolver** with the main differences being that it's way more configurable and can have multiple upstream servers as opposed to one. So if it still can't find an answer here it will forward the query to your ISPs DNS server. This is where it gets interesting and what figure 2 is illustrating.

### DNS Iterators and Authority

Here, we'll encounter what's called a dns iterator (also called recursive resolver). I like to think of it as the starter of a Q&A session. Because as you can see in figure 2 it starts by asking a root nameserver for an answer, and goes through that whole chain until we find it. Let's explore how that plays out in practice.

But first we have to introduce a new concept called authority. As you can see in figure two there are three servers in this image that are categorized as nameservers, this differentiates them from dns servers like your routers for example because they are authoritative over a given zone. Which means they hold records and are the source of truth for them.

### Understanding Zone Authority

So we have:

- Root zone authority
- TLD zone authority
- Domain zone authority

As we've covered before, dns servers will only give you an answer when they have it. So in our little Q&A session the root server would say ***"I don't have google.com, I only know where you can find a server which has all the .com records i.e. a TLD zone authority"*** and point us to that. We'd then go to the TLD zone authority, ask it for google.com and it'd say ***"I don't have google.com, I only know where you can find a server which has all the google.com records i.e. a Domain zone authority"*** and point us to that. We'd then go to the Domain zone authority to get our final authoritative answer.

One little thing i would like to clear up because it was a common point of confusion for me is that I wondered *"but what about subdomains?"* these are all covered by the domain zone authority, full-stop. So, yeah that was a question you were asking yourself just know that the process doesn't go any further.

That pretty much covers it all, you know have a good understanding of the inner-workings of the Domain Name Systems. If you'd like to learn how to implement one yourself or hack DNS, I invite you to consult any of the following sections: [A programmer's perspective](#a-programmers-perspective), [A hacker's perspective](#a-hackers-perspective). Otherwise I hope you had a good read, and I'll see you in the next one!

## A programmer's perspective

As a practical complement to this article I made [my own DNS](https://github.com/pindjouf/deem-and-nets), so i'd like to do a brief, high-level overview of how to implement it. For the more experienced programmers among us, all the information I've provided above is probably enough to figure it out with a bit of documentation[[²]](#endnotes)[[³]](#endnotes). But this can serve as both a learning opportunity for novices and a refresher for the rest. We will see how it all ties back to cybersecurity and finding/developing exploits at the end of the article.

When you really think about it, making a basic DNS is simple. It's all about setting up a socket, receiving a string and parsing through it to build a response, then serialize the response and send it back to the client. So our first order of business is to implement our communication interface, because all networked programs need a mutually agreed-upon "place" to do so.

### Sockets

A simple way to think of sockets is that it's a place where two programs/processes agree to meet at to communicate.
As illustrated by this image, you can see that two tiny people are vibing right in there. Because that's the purpose of sockets, they're comfy endpoints for apps & processes to send and receive data through. Just like in a normal conversation, people can talk at the same time that's also the case for sockets since they're full-duplex which means that they allow for simultaneous bidirectional data transfer between client and server, contrary to traditional client-server models.

<img src="/assets/sockets.webp" alt="tiny people in a power outlet" style="width: 50%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center; padding-top: 10px;">
    Figure 3: Tiny people in sockets
</div>

Knowing where the data flows is crucial to know when implementing a system. It'll also do us good when we start looking at security implications and how DNS could be hacked on ;)

#### Socket type considerations

Traditionally, DNS has mostly relied on UDP for its speed and efficiency, but it's been changing in recent years due to new technological requirements and security considerations. While you could theoretically use any type, UDP and TCP make the most sense and allow for all of DNSs features to flourish. You can find more information on both of these and more in [IBM documentation](https://www.ibm.com/docs/ko/aix/7.1?topic=protocols-socket-types)

### Raw bytes as queries/responses

Responses and queries are typically sent as raw bytes and then deserialized inside our programs to parse through the message data. We'll look at them as hex values to simplify here. The query message structur is usually presented with an image such as this one:

<img src="/assets/dns_query_message.png" alt="tiny people in a power outlet" style="width: 80%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center; padding-top: 10px;">
    Figure 4: DNS query message
</div>

However that visualization has never worked for me, so for those of us who prefer the string here it is already broken down :)

`9620 1000 0010 0000 0000 0000 08 70696e646a6f7566 03 7a7978 00 0001 0001`

#### DNS Queries

Keeping with our example up above, we'll deconstruct what all this data really means!
DNS messages are comprised of several categories with the most notable ones being covered in Figure 4. In our header section all categories are 2 bytes long, which makes the whole section 12 bytes since it has 6 of them. Here's the header of our example query

- **ID:** `9620`  
- **Flags:** `1000`
- **Question count:** `0010`
- **Answer count:** `0000`
- **Authority count:** `0000`
- **Additional count:** `0000`

And its corresponding Question! aka the actual domain name and the question type/class!  
We can't put a pre-defined size on this since the labels are of dynamic size (although they're restricted to 63 bytes)

- **Labels (length, value):** `08 70696e646a6f7566 03 7a7978` try to guess this domain name ;)
- **Zero byte terminator:** `00`
- **Question type:** `0001` (A, AAAA, etc...)
- **Question class:** `0001` (IN, CH, etc...)

As you can see most of the counters are at 0 because this is only the first part of this "conversation" so no responses have been received yet, thus causing this lack of counts.
the flags can actually be broken down way more and as for the ID it just servers as well, an identifier so nothing worth noting happens with it. There are many articles covering these details in more depth than we would ever have the time to get into here so I invite you to look at official sources like the ones mentioned in the [endnotes](#endnotes).

#### DNS Responses

The response message follows a similar structure but includes our answer. Let's look at our example:

`9620 8180 0001 0001 0000 0001 08 70696e646a6f7566 03 7a7978 00 0001 0001 c00c 0001 0001 00000e10 0004 0a0a0a0a`

The header has the same categories but with the response bit set and counts updated to reflect included answers. The question section is preserved, and we get the additional our answer section!

- **Name pointer:** `c00c` (points back to question name/labels)
- **Type/Class:** `0001 0001` (A record, IN)
- **TTL/Length:** `00000e10 0004` (3600s, 4 bytes)
- **Address:** `0a0a0a0a` (10.10.10.10)

DNS uses compression (that `c00c` pointer) to avoid repeating the domain name.

#### Final considerations

If you know how to program you pretty much have everything you need to implement a basic DNS right here. That's all there is to it. Consult the official sources for guidelines on connection types, message structures etc... and you're good to go. Of course many features have been built on top of it but this is the core of DNS.

My implementation mostly focuses on understanding everything I've outlined in this section, so I haven't bothered to work on cache or recursive resolution as they're optimizations on top of this very basic protocol. I only have zone file parsing as my method of choice for resolution.

Perhaps I could've covered that part a bit, but I can guarantee you that I'm far from being an authority on writing lexers. mine is barely pulling what it needs to from those files so I kindly invite you to find another source for help on this!!

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

## Endnotes

I wrote this article as I was learning DNS, so if you're more knowledgeable about computers than I am feel free to reach out on [X](https://x.com/pindjouf).

Btw, if I were to learn this all over again I'd just use the `dig +trace example.com` command, and ask an LLM about everything that just popped up on my screen until I understand DNS. That's probably the quickest way to learn it in my opinion.

**Citations:**

[1] George Hotz, "what is programming? (noob lessons!)," YouTube, July 31, 2020. [Online video]. Available: https://youtu.be/N2bXEUSAiTI?si=Z9d1Wtpeh8K2ikzK&t=912.

[2] P. Mockapetris, "Domain Names - Concepts and Facilities," RFC 1034, Internet Engineering Task Force, November 1987. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc1034

[3] P. Mockapetris, "Domain Names - Implementation and Specification," RFC 1035, Internet Engineering Task Force, November 1987. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc1035

[4] Interview with Jim Morrison's father and sister YouTube, Aug 9, 2010. [Online video]. Available: https://youtu.be/Kz63-q8otYM?si=VZ8Q1r7DmZ8yJLZQ&t=16
