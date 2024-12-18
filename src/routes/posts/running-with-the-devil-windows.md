---
title: "Runnin' With the Devil"
description: "A guide to transitioning from Linux to Windows, including environment setup, customization, and maintaining productivity workflows."
date: "2024-10-16"
lastUpdated: "2024-10-16"
author: "pindjouf"
slug: "running-with-the-devil-windows"
nextPost: "publicly-passionate"
prevPost: "day-2-uart-piso-shift-register"
tags:
  - "windows"
  - "linux"
  - "customization"
  - "development"
  - "tools"
category: "Development"
readingTime: 10
language: "en"
tableOfContents: true
---

**TL;DR** I'm moving to windows! aka my 4th environment change this year

Windows...

That's why this post is called *"Runnin’ With the Devil"*. If you know me, you know that I'm a linux user at heart. but with the little work I've done in verilog, and studying *low level* programming a bit more. I think it's fair to say that in the end, it's all just transistors.

I've recently started getting back into it to expand my horizons and get out of the linux ecosystem for a little while. The reasoning behind it, is that I want to get more comfortable on multiple platforms and stop relying on my prebuilt environments, really this is working on digital anti-fragility. I want ME to be deployable on any system not just my config files.

## Getting comfy

%appdata% is your new .config and Microsoft.PowerShell_profile.ps1 is your new .bashrc  
P.S. just access it with $PROFILE:

```powershell
nvim $PROFILE
```

### Ricing

Of course as an avid linux user, and linux [ricer](https://jie-fang.github.io/blog/basics-of-ricing), I had to find a way to customize my environment. Honestly I thought it wasn't possible, I always saw windows users as people that exclusively used GUI software, and didn't take the time to look at alternative ways to do their day-to-day tasks on the computer. So I figured the "market" for things like [tiling window managers](https://en.wikipedia.org/wiki/Tiling_window_manager), hotkey daemons or different [terminal emulators](https://en.wikipedia.org/wiki/Terminal_emulator) than the default powershell one wouldn't even exist! But in fact, I was pleasantly surprised to find out that things were not so different on the other side after all.

After a quick search I was able to find alternatives to most of the things that I needed and that's what I'm gonna cover now, so whether you've been a classic GUI windows user your whole life, or a linux user trying to experiment outside of his comfort zone, you can read on to learn a bit more about my journey into the windows ecosystem.

### Tiling window manager & keymaps(hotkey daemon)

[Komorebi](https://lgug2z.github.io/komorebi/) was relatively easy to set up, as it comes with a decent config file out of the box. For people that are used to installing a wm and not even having access to an example of the configuration, this will feel like paradise. You get a bar and a fully functional window manager straight away. The only reason you would spend a lot of time in the configs, is if you want something that is really personalized. For the keybinds I use [whkd](https://github.com/LGUG2Z/whkd) it's also really easy to set up and the example config comes with VIM-bindings!!!

Alright enough talk here's a little tutorial on how to actually get this up and running.  
First of all you'll have to get yourself a package manager, I recommend [scoop](https://scoop.sh/) here's how to install it:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

Once you have that we can install our wm and hotkey daemon:

```powershell
scoop bucket add extras
scoop install komorebi whkd
```

That's it! Now we can generate our example configs (which you can keep running forever tbh)

```powershell
komorebic quickstart
```

You should get two files with this, **komorebi.json** which will be your main config, similar to a hyprland.conf and **komorebi.bar.json** which, as it says, will be for your bar configuration.  
And then you'll be able to run it with:

```powershell
komorebic start --whkd --bar
```

Here's how to get it running on startup:

```powershell
komorebic enable-autostart --whkd --bar
```

That's pretty much it.

#### What do I use?

Here’s a list of what I’m using on my Windows System:

- **WM**: [Komorebi](https://lgug2z.github.io/komorebi/)
- **GTK**: Windows Default Dark Theme
- **Bar**: [Komorebi Bar](https://lgug2z.github.io/komorebi/)
- **Editor**: [Neovim](https://neovim.io) (btw)
- **Terminal**: [Alacritty](https://alacritty.org) 
- **Hotkey Daemon**: [whkd](https://github.com/LGUG2Z/whkd)
- **Launcher**: Windows Default

## Dev environment

As I've mentioned in previous posts I'm working on [fromthetransistor](https://github.com/pindjouf/fromthetransistor) so I mostly spend time developing in verilog, and for that I need [verilator](https://www.veripool.org/verilator/). I also like having [GTKWave](https://gtkwave.sourceforge.net/) with me when possible but it's not necessary. For this it was a bit more difficult and I'm actually still working on finding a solution, the simplest way to go would be to use wsl obviously but I'd like to keep it all at the windows level since I'm trying to get better at powershell, but then again this is not something that necessarily needs to be on windows. But I've been looking for so long that it feels like a challenge now!

## where the dotfiles at?

The [dotfiles](https://github.com/pindjouf/dotfiles) for all the software I've mentioned can be found on Github. If you want to see a screenshot of what my desktop looks like at the moment, check out the [repository](https://github.com/pindjouf/dotfiles). By the time you read this I might or might not have pushed to the repo with my windows environment, if it's not there and you need them feel free to contact me on twitter: [@pindjouf](https://x.com/pindjouf)
