---
title: "Domain Name System"
description: "A comprehensive technical guide to DNS, covering its fundamentals, architecture, and role in passive information gathering and reconnaissance."
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
category: "Technical"
readingTime: 15
language: "en"
tableOfContents: true
featured: true
---

### Table of Contents

1. [Domain name system](#domain-name-system)
2. [What is DNS fundamentally?](#what-is-dns-fundamentally)
    1. [Why do we need DNS?](#why-do-we-need-dns)
        1. [Abstraction](#abstraction)
        2. [Load balancing and scalability](#load-balancing-and-scalability)
3. [How does DNS work?](#how-does-dns-work)
    1. [A hierarchical and distributed nature](#a-hierarchical-and-distributed-nature)

As promised in my [last article](finally-going-east), I will show you the technical aspect of passive information gathering/recon. However, I don't want to rush and simply brush over topics that are as important as DNS for instance, which is our topic of the day. I want to dive into its inner workings and explore all it has to offer since it's the main component of our attack surface. I say this because without it, we have nothing to look into. It's our main gateway into discovering the attack surface since it reveals subdomains, IPs and other infra details. You can't look into something you haven't found, can you?

I will make this a multipart series so that we have the time to truly cover all the aspects of our subjects. I felt that DNS deserved it's own article, but the next one will probably cover more topics, like the application itself and all its moving parts for instance.

## What is DNS fundamentally?

We'll start the article at a high level and dive deeper as we go by building on our foundation. Keeping with the **input -> system -> output**[[¹]](https://youtu.be/N2bXEUSAiTI?si=Z9d1Wtpeh8K2ikzK&t=912) theme, we'll think of DNS as a black box for now. What we have to figure out first is what it takes (input), and what the system gives back after it's done (output).

An abstract way to address those two points is to see DNS as a system that takes human-friendly computer hostnames (often referred to as domain names) and converts them to IP addresses.

<br>
<img src="/assets/paradigm.png" alt="diagram" style="width: 50%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center;">
    <br>
    Figure 1: input -> system -> output
    <hr style="width: 40%; display: block; margin-left: auto; margin-right: auto;">
</div>

Keep this in mind as we go into more detail because you might feel lost at some point. But with this reference point, you'll have a fundamental understanding from first principles that prevents any unnecessary confusion.  

### Why do we need DNS?

I'd like to go on a brief tangeant about **why** we use DNS. Similarly to a compiler, the DNS's main purpose is to help humans interact with their machines. In the way that it allows us to input something that is easy for us to understand, and translate it to something that is easy for the machine to understand. So what's the problem and how does DNS solve it? Well as you could've guessed, it's practically impossible (or very difficult) to remember the IP addresses of all the internet services we use. And machines don't understand anything other than said IP addresses. So we bridge the gap by using DNS.

#### Abstraction

Although `domain name -> IP` is the primary purpose of it, DNS helps us in many other ways. For instance, it abstracts away the underlying infrastructure by always pointing to an entities' machines. Say a company migrates their servers to a different hosting provider for example. You'd still use the same `example.com` domain, whether their address is `104.218.63.175` or `23.154.89.126` because they would make sure that their domain name always points to it. You can think of it as pattern-matching, here's a code snippet to illustrate this (omitting the actual resolution, we cover this later in the article):

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

Now that we understand the core of DNS, we can explore its hierarchical and distributed nature. And start looking into **how** it actually works.

### A hierarchical and distributed nature


## A programmer's perspective

I'd like to do a high-level overview of how to implement a DNS. For the more experienced programmers among us, all the information I've provided above is probably enough to figure it out with a bit of documentation[[²]](https://datatracker.ietf.org/doc/html/rfc1034)[[³]](https://datatracker.ietf.org/doc/html/rfc1035). But this can serve as both a learning opportunity for novices and a refresher for the rest. We will see how it all ties back to cybersecurity and finding/developing exploits at the end of the article.

The first step would be to implement our communication interface, because all networked programs need a mutually agreed-upon "place" to do so. We also need it to be full-duplex to allow for concurrent sending and receiving of data, that's why in the case of DNS they chose to use a socket.

### Socket

A simple way to think of sockets is that it's a place where two mfs agree to meet at to communicate.
As illustrated by this image, you can see that two mfs are just relaxing right in there. Because that's the purpose of sockets, they're comfy endpoints for apps & processes to send and receive data through. Just like in a normal conversation, people can talk at the same time that's also the case for sockets since they're full-duplex which means that they allow for simultaneous bidirectional data transfer between client and server, contrary to traditional client-server models.

<img src="/assets/sockets.webp" alt="tiny people in a power outlet" style="width: 50%; display: block; margin-left: auto; margin-right: auto;">
<div style="text-align: center;">
    <br>
    Figure 1: input -> system -> output
    <hr style="width: 40%; display: block; margin-left: auto; margin-right: auto;">
</div>

#### Socket type considerations

Now we've got to take a look at the different ways that the socket can do its job. We're primarily going to focus on TCP and UDP, as they're the traditional and most sensible choices for DNS implementations. While you could theoretically use any type, these make the most sense and allow for all of DNS's features to work correctly. You can find more information on both of these and more in [IBM documentation](https://www.ibm.com/docs/ko/aix/7.1?topic=protocols-socket-types)

##### TCP



##### UDP

UDP is the simplest of the two because it's literally the lazy man's transportation. It's key charachteristics are that you don't need to establish a connection, you don't get a guarantee of delivery and the packets might come back all jumbled up. But that's all to the benefit of speed! Just think about how much time you gain by removing all of these controls!

## A hacker's perspective

## Endnotes

I wrote this article as I was learning DNS, so if you're more knowledgeable about computers than I am feel free to reach out on [X](https://x.com/pindjouf).

**Citations:**

[1] George Hotz, "what is programming? (noob lessons!)," YouTube, July 31, 2020. [Online video]. Available: https://youtu.be/N2bXEUSAiTI?si=Z9d1Wtpeh8K2ikzK&t=912.

[2] P. Mockapetris, "Domain Names - Concepts and Facilities," RFC 1034, Internet Engineering Task Force, November 1987. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc1034

[3] P. Mockapetris, "Domain Names - Implementation and Specification," RFC 1035, Internet Engineering Task Force, November 1987. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc1035
