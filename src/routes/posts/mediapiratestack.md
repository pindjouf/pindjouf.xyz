---
title: "Media Pirate Stack"
date: "2024-10-03"
---

# Media Pirate Stack

Thanks to [@Kalos](https://www.youtube.com/@KalosLikesComputers) for inspiring me to do this.

This post was originally a repo but I want to clean up and only keep projects on there. Here you'll learn how to get accustomed to working with home servers, VPNs & P2P file sharing. With the goal of setting up your very own media service.

The setup is fairly simple, here's a list of what we need:

**Hardware**:
- Server = [Raspberry Pi](https://www.amazon.com.be/s?k=raspberry+pi), [ZimaBlade](https://shop.zimaboard.com/products/zimablade-single-board-server-for-cyber-native)
- Storage = [SSD](https://www.amazon.com.be/s?k=SSD), [External SSD](https://www.amazon.com.be/s?k=ssd+usb)

**Services**:
- Torrenting client = [Transmission](https://transmissionbt.com), [qBittorrent](https://www.qbittorrent.org/)
- Media Finder Interface = [Radarr](https://radarr.video/), [Sonarr](https://sonarr.tv/), [Lidarr](https://lidarr.audio/)
- API support for torrent trackers = [Jackett](https://github.com/Jackett/Jackett)
- VPN = [WireGuard](https://www.wireguard.com/), [openvpn](https://openvpn.net/)
- Media Player/Center = [VLC](https://www.videolan.org/), [Jellyfin](https://jellyfin.org/), [Kodi](https://kodi.tv/)

**Useful Resource**:
- [The 0$ Home Server](https://youtu.be/IuRWqzfX1ik?si=DbZxRGAes0HPLZP2)

## Downloading Media

When you're ready to download I suggest you run all the download related services like:
- Torrenting client = [Transmission](https://transmissionbt.com), [qBittorrent](https://www.qbittorrent.org/)
- Media Finder Interface = [Radarr](https://radarr.video/), [Sonarr](https://sonarr.tv/), [Lidarr](https://lidarr.audio/)
- API support for torrent trackers = [Jackett](https://github.com/Jackett/Jackett)

on startup it'll make the whole experience smoother.

Read below for the setup of each service.

### Torrenting Client Setup

There's not much to do here except making sure it runs on startup. You can access the web interface on port 9091.

### Media Finder Setup

There are three important things to do here:

- Go to [your_server_ip:7878/settings/mediamanagement]() and choose where you want your files to be downloaded.
- Go to [your_server_ip:7878/settings/indexers]() and setup the indexer(s) you want to use. you get the api key and tornzab feed/URL from [Jackett](https://github.com/Jackett/Jackett)
- Go to [your_server_ip:7878/settings/downloadclients]() and put in the download client you want to use.

Of course you can add more things to make your config more enjoyable but this is the basic setup to get the necessary things working.

The ports for the three services I've mentioned above are:

- Radarr = 7878
- Sonarr = 8989
- Lidarr = 8686
- Jackett = 9117

Torrent trackers I recommend in case you don't have any:

- torrentz2
- thepiratebay

#### Endnote

If the service is not finding the media for you, don't forget you can always go to interactive search and select the file you want yourself.

## Accessing Media

If you're just gonna be using the server for media, I recommend using [osmc](https://osmc.tv/) or [libreelec](https://libreelec.tv/) as your operating system. They're really small and they come with [kodi](https://kodi.tv/) preinstalled so it's the most frictionless way to gather everything in the same spot.

They also make it really easy to set up stuff like ftp, ssh, torrenting clients etc...
And if you're planning on using this with a traditional tv, there's really no beating [kodi](https://kodi.tv/) in my opinion.

If not, then I recommend using [Jellyfin](https://jellyfin.org/) since it has a really nice web interface, mobile apps & the setup is similar to the services mentionned in [downloading_media.md](https://github.com/pindjouf/mediapiratestack/blob/main/downloading_media.md).

If you just wanna go straight to the files and you plan on organizing everything neatly in directories and/or don't care for a pretty interface then I suggest downloading some media player like [VLC](https://www.videolan.org/).

You can then just mount sftp like this:
`gio mount sftp://your_server_ip` which will allow you to browse the whole system with your chosen media player.

## Setting Up Wireguard

Once you've installed wireguard you can either set it up [manually](https://www.wireguard.com/quickstart/#command-line-interface) or use [pivpn](https://www.pivpn.io/) as an easier alternative.

Here's what your config file should look like:
---
```conf
[Interface]
Address = 10.145.16.9/24
PrivateKey = fGU3YoHmVYtGnaSsKX2eTi6Z06No4BwcSw2jzA1X2aZ=
DNS = 1.1.1.1, 1.0.0.1

[Peer]
PublicKey = IATY9j5PVlNxbJXXj7YiOQOyXijykotSiohgY9ZLYz0=
PresharedKey = PclEs511E1/9Tlrg+nIhWbNofx+0eIgPvFIOzkLDYBc=
Endpoint = acrobat.duckdns.org:51820
AllowedIPs = 0.0.0.0/0, ::/0
```
___
**Notes:**

- The endpoint is supposed to be your public IP, but you can also use a domain that links to it like I did here.
- The config file is identical in the host and client.
- You can also link your PrivateKey in another file by using `PostUp = wg set %i private-key /etc/wireguard/%i.privkey` instead of `PrivateKey = fGU3YoHmVYtGnaSsKX2eTi6Z06No4BwcSw2jzA1X2aZ=`
- Here's a link to [duckdns](https://www.duckdns.org/) if you want to use a domain like me.
- You can have multiple peers.

Once everything is set up you should be able to start your connection with `wg-quick up wg0` and to close it, replace `up` with `down`

Don't forget to port forward port `51820` it is the wireguard port.

## Disclaimer:

The information provided in this material about peer-to-peer (P2P) file sharing is for educational purposes only. P2P technology can be misused for piracy, including unauthorized distribution of copyrighted material such as movies, music, books, and games, which is illegal.

I expressly disclaim any responsibility or liability for the misuse of P2P file sharing for piracy or any other illegal activity. Users are solely responsible for ensuring compliance with all applicable laws and regulations.

I condemn piracy and advocate for respect of intellectual property rights. This material does not endorse or encourage illegal activities. Use P2P file sharing responsibly and lawfully, respecting copyright holders' rights.

By accessing this material, you agree to release me from any liability arising from the misuse of P2P file sharing technology. I shall have neither liability nor responsibility to any person or entity with respect to any loss or damages arising from the information contained in this repository or from the use of the programs accompanying it.
