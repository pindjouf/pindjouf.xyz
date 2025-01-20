---
title: "Day 1 of making an ARM assembler 🛠️ I'm learning assembly"
description: "A beginner's journey into ARM assembly, breaking down the basics of registers, instructions, and system calls through building a simple exit program. Learn how assembly relates to machine code and memory management from first principles."
date: "2025-01-18"
author: "pindjouf"
published: true
nextPost: "oscp-web-log-2"
prevPost: "linkvortex"
slug: "day-1-arm-assembly-basics"
tags:
  - "assembly"
  - "arm"
  - "low-level"
  - "programming"
  - "computer-architecture"
  - "learning"
category: "Technical"
readingTime: 15
language: "en"
featured: true
---

A little background on why I'm doing this, I plan to complete the [From the Transistor to the Web Browser](https://github.com/geohot/fromthetransistor) course in 2025. I've been slacking on this so if I don't start picking up the pace starting now, it'll never get done and I will never learn how computers actually work.

I come at this with the idea that I know practically nothing about computers besides what I'm learning in the course, so that I keep a clear mind and let the ideas work their magic, instead of coming in with preconceived notions.
I used to think that I had work on finding all the solutions myself. But in fact I'm starting to change my idea of what it means to learn fast and effectively, I'm slowly building a mental model and a methodical approach but I don't want to rush it. I'll let the ideas simmer in my subconscious for a little while before I put it on paper, and ultimately bring it to this blog and my study sessions! 

With that introduction being done, I still want to preface this article with some ideas on how I want to approach the rest of the course and learning in general. The basic idea is to start by exposing myself to as much information about the topic as possible and follow along with study material, tutorials, etc... After that I want to tweak the project just a bit to understand the core of it. Then I extract the learnings from that cycle into an article to *test* my knowledge (gaps) which is what I'm doing right here. As a practical complement to this article I also started a mini-course called [Assemblings](https://github.com/pindjouf/assemblings), it's the equivalent of [rustlings](https://github.com/rust-lang/rustlings) for ARM assembly. I just asked Claude.ai to make a course outline and ran with it, we'll see how that goes I guess...  
You can do this as well if you wish, it's similar to a concept called [**études**](https://en.wikipedia.org/wiki/%C3%89tude) in music.

> An étude (/ˈeɪtjuːd/; French: [e.tyd]) or study is an instrumental musical composition, usually short, designed to provide practice material for perfecting a particular musical skill.  
-- ***Wikipedia***

Jim Morrison used to follow a similar practice to improve his vocabulary[[¹]](#endnotes) by writing stories around each new word he would learn. This cycle of learning new information and practicing applying it in different contexts and scenarios is the blueprint to effective knowledge consolidation, as your brain becomes flexible to the ideas and understands how and when it makes sense to apply them.

## Meeting Assembly

At it's core, assembly is simply machine code in a human-readable format. We have some directives to point to certain sections/areas in memory, directives to make labels global so they're accessible to external programs, etc... But the most important thing to remember, and focus on is the first sentence of this paragraph!

**So what's machine code?**  
Well here's an example from the program we're going to be covering today: `1110 0011 1010 0000 0111 0000 0000 0001`. As you can see it's complete gibberish, and a totally impractical way to program. But this is the only thing your machine understands, patterns of electrical signals. So to combat this we've made a programming language that is one abstraction layer above that, which is called assembly.

Now you can also notice that our machine code example is 32 bits, that's because I'm going to be working with the ARMv7 in mind which is a 32-bit CPU, so all our instructions must respect that word[[²](#endnotes)] length.

I followed a tutorial by [Laurie Wired](https://www.youtube.com/watch?v=kKtWsuuJEDs&list=PLn_It163He32Ujm-l_czgEBhbJjOUgFhg) to learn my very first instructions in assembly. The main goal is to learn how to successfully exit a program. We do this by using the registers at our disposal, for the ARMv7 there are 16 of them. Registers are small blocks of fast access memory that are very close to the processor, this is what we use to do our business.

For now that's basically all we have to remember about how our ARMv7 CPU works:
- CPU gets instructions (from main memory)
- Execute instructions on the registers
- [optionally write back to main memory]

***simple*** 

## My first exercise

Let's not waste any more time, here's the code:

```asm
.global _start

.section .text

_start:
    mov r7, #1
    swi 0
```

As you can see it already looks much better than the machine code I showed you earlier. So what does all of this mean?

**Line 1:** Declares the `_start` label as global, meaning that other programs will have access to it. If you're already familiar with programming, you can think of this as scope, but at the OS level!

**Line 3:** Declares a section, a very particular one at that. The `.text` section, is where we'll put all the instructions of our program.

**Line 5:** This is the entry point of our program, I didn't mention this yet but what the `_start` label does, is stand as a placeholder for the ***starting*** location in memory for the first instructions, and that tells our program where to go look for them. We'll see what this actually looks like later.

**Line 6:** Here goes our first instruction! We use `mov` which is an instruction that moves a value to a register. In our case we're putting the immediate value `#1` inside our `R7` register. This is actually the `syscall`[[³](#endnotes)] register, and putting `1` inside it calls the `exit` system call. (Something that happens in the background, is that the actual exit code gets fetched from `R0`. You can manually set that exit code but if you don't, it automatically gets initialized as `0` to signal a successful exit.)

**Line 7:** The instruction we previously called i.e. `mov r7, #1` doesn't actually get executed until we call a software interrupt or `swi`. The actual implications of this command are above my current level of understanding, but I'll get back to it later in this journey.

So this is a high level overview of the source code, you'd now have to assemble and link it for it to turn into an ELF executable!

Once you've done that we can start playing with the executable to extract more knowledge about this whole process, and how assembly works. I'd first check that you get a successful exit call, which should be the value you manually put there, or a `0`.

Let's review our disassembled executable now:

```rust
Disassembly of section .text:

00008000 <_start>:
    8000:	e3a07001 	mov	r7, #1
    8004:	ef000000 	svc	0x00000000
```

Now perhaps the `_start` label makes a bit more sense to you, as you can see it's serves as a placeholder that points to the memory location of the first instruction. `0x8000` in our case. Under that we can see our two instructions, in both hexadecimal and assembly representation! Well do you remember our machine code? `1110 0011 1010 0000 0111 0000 0000 0001` Perhaps it's a little more clear now but it is our first instruction! (`mov r7, #1`)

`1110 0011 1010 0000 0111 0000 0000 0001` is the same as `e3a07001` is the same as `mov	r7, #1`  
`1110 1111 0000 0000 0000 0000 0000 0000` is the same as `ef000000` is the same as `svc	0x00000000`

What's also worth noting is the memory location to the left of our instructions. It's 4 bytes/32 bits here because we're working with the ARM instruction set, and all instructions within that ISA are 4 bytes long indeed. But the ARMv7 supports both ARM and Thumb instructions sets, which are 16-bit instructions so they'd take up less space in memory.

If you were wondering why our `swi` instruction transformed to `svc` that's because `swi` is basically a legacy instruction, starting from the ARMv6 they've introduced `svc` because it better describes what it does, it's the **Supervisor Call**. However `swi` is still accepted in many assemblers for backwards compatibility and also because it's semantically indentical. These are all little things I'm excited to get into as I learn how computers really work!

I also have to mention that while I've simplified the instruction structure quite a lot here, we have to keep in mind that their capabilities are much more intricate, I've seen things like conditionals which are set with a few bits in the documentation. But I see these things as *advanced* for now, but I'll get into them in due time!

## Endnotes

That pretty much concludes my first experience with ARM assembly! As evidenced by the excessive use of exclamation marks throughout this article, I'm quite happy to be learning this stuff and I'll try to make time for it each day, and who knows, if I start working on it more regularly I'll have the capacity to digest my learnings faster and write articles that are a little less verbose and all over the place as this one!

As I always say, if you know computers better than I do, and spotted a few (or many) mistakes in this article, feel free to reach out on X [@pindjouf](https://x.com/pindjouf).

**References:**

[1] Interview with Jim Morrison's father and sister YouTube, Aug 9, 2010. [Online video]. Available: https://youtu.be/Kz63-q8otYM?si=VZ8Q1r7DmZ8yJLZQ&t=16  
[2] Word (computer architecture), Dec 24, 2024. [Wikipedia article]. Available: https://en.wikipedia.org/wiki/Word_(computer_architecture)  
[3] List of ARM system calls, 2024. [Online index]. Available: https://arm.syscall.sh/
