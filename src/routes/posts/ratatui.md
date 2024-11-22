---
title: "Ratatui first impressions"
date: "2024-11-22"
---

# Ratatui first impressions

I was looking to work on refreshing my infra skills, but the tasks I had laid out seemed tedious and I didn't want to waste time doing something I'd already done countless times before, so I decided to try a different approach. I chose to automate simple server setups, following IaC principles. I'd also been waiting for an opportunity to try out [ratatui](https://ratatui.rs/) for a while, so this seemed like the perfect opportunity for it. I wrote this article while learning it so I really break it down to the basics up until the completion of my program!

## How do you make a TUI?

Starting this project I had no idea where to start so this was my first question. One of the first sections in a [tutorial on the ratatui website](https://ratatui.rs/tutorials/hello-world) mentions **initializing the terminal**, **setting up & restoring its state**. Which already gave me a few hints about the next steps, but then they immediately followed those statements with paragraphs addressing ***how*** to setup the terminal, with a few simple concepts.

### Alternate screen

The first step to writing a TUI program is to enter an alternate screen. You can find their full definition of it [here](https://ratatui.rs/concepts/backends/alternate-screen/) but basically, they say that it's *a separate buffer that some terminals provide, distinct from the main screen*. It's a fairly simple concept to grasp if you've ever used any TUIs. I think of it like a **layer**, in image editors. You get to work on top of it as you wish, and once you're done it just dissapears without affecting your regular session at all.

### Raw mode

Next we need to enable raw mode, this is a mode that turns off all input and output processing or handling from your terminal. Your usual special characters like `CTRL-C` or `CTRL-D` for instance, won't work in this mode. It's responsible for memes like [how to exit vim?](https://stackoverflow.blog/2017/05/23/stack-overflow-helping-one-million-developers-exit-vim/) Which is a perfect example of an application that uses this mode.

### Backends

Backends allow ratatui to interface with the terminal emulator. It's thanks to them that we're able to activate **raw mode**. Like mentioned in the official website they *grant ratatui the ability to capture keypresses, maneuver the cursor, style the text with colors and other features.*

#### init() and restore()

The three concepts I've just outlined, are all taken care of with the [init()](https://docs.rs/ratatui/latest/ratatui/fn.init.html) function! It creates a new `DefaultTerminal` and initializes it with the defaults we just talked about like:

- Backend: CrosstermBackend writing to Stdout
- Raw mode is enabled
- Alternate screen buffer enabled
- A panic hook is installed that restores the terminal before panicking. Ensure that this method is called after any other panic hooks that may be installed to ensure that the terminal is restored before those hooks are called.

You can then use the [restore()](https://docs.rs/ratatui/latest/ratatui/fn.restore.html) function before exiting your program to go back to its original state! It disables raw mode and leaves the alternate screen buffer.

### side note

Before we move on to the UI I'd like to take the time to address tomething crucial first, I've already covered how to initialize a program and then restore the terminal back to its original state. But the actual magic of a TUI is what happens in between, the loop. Without a loop between your `init()` and `restore()` you won't have any app, it'll just start and close straight away because that's all you ask it to do.

## Layout

Now that we've got the basics down, we need build a ui to interact with it.


