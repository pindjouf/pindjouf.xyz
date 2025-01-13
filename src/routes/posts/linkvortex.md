---
title: "Linkvortex write-up"
description: "A quick reference guide to Verilog basics, including module declarations, signal assignments, operators, and common syntax patterns."
date: "2024-08-06"
lastUpdated: "2024-08-06"
author: "pindjouf"
slug: "linkvortex"
nextPost: "escape_two"
prevPost: "mario-sees-nothing"
tags:
  - "verilog"
  - "hardware"
  - "hdl"
  - "digital-design"
  - "fpga"
  - "tutorials"
category: "Hardware Engineering"
readingTime: 7
language: "en"
published: false
tableOfContents: true
series: "Hardware Description Languages"
seriesOrder: 1
featured: true
references:
  - name: "Hackman's Verilog Article"
    url: "https://lateblt.tripod.com/verilog.htm"
  - name: "Learn X in Y Minutes"
    url: "https://learnxinyminutes.com"
---

## Our base -- 10.10.11.47 (target machine)

After connecting to the vpn I get this ip assigned to my virtual interface -> `10.10.14.55/23`
And this is what my routing table became (including only relevant parts):

```sh
10.10.10.0/23 via 10.10.14.1 dev tun0 
10.10.14.0/23 dev tun0 proto kernel scope link src 10.10.14.158 
10.129.0.0/16 via 10.10.14.1 dev tun0 
```

As we can see we're connected to 2 other networks than the one we're in, and all that through our default gateway `10.10.14.1`.
And we know that our interface has routing to the 10.10.11.0/24 subnet because that's our target's subnet and we're able to ping them so why not other machines on that network? It must be routed through a machine on one of the networks we just discovered but that's out of our reach (for now)

## Information gathering -- recon phase

Since we've discovered these new subnets let's see who we got around here! I did a few ping sweeps for network discovery (tried for 10.10.13.0/23 and 10.129.0.0/16 but they didn't yield any additional results)

```bash
nmap -v -sn 10.10.10.0/23 -oG ping-sweep.txt && clear && grep Up ping-sweep.txt | cut -d " " -f 2 > ips.txt
nmap -v -sn 10.10.14.0/23 -oG ping-sweep.txt && clear && grep Up ping-sweep.txt | cut -d " " -f 2 >> ips.txt
```

Here's all the IP addresses I was able to find.

```sh
10.10.10.2
10.10.10.3
10.10.10.245
10.10.11.9
10.10.11.10
10.10.11.24
10.10.11.26
10.10.11.28
10.10.11.30
10.10.11.31
10.10.11.32
10.10.11.33
10.10.11.34
10.10.11.35
10.10.11.36
10.10.11.37
10.10.11.38
10.10.11.39
10.10.11.40
10.10.11.41
10.10.11.42
10.10.11.43
10.10.11.44
10.10.11.45
10.10.11.46
10.10.11.47
10.10.11.48
10.10.11.50
10.10.11.221
10.10.14.1
10.10.14.55
```

I tried to visit our target IP in the browser just by curiosity but I was met with a redirection to `linkvortex.htb` a domain that obviously wouldn't resolve on my machine. I assumed that those records would perhaps be somewhere on a DNS in the network so I quickly scanned for port 53 with this.

`for ip in $(cat ips.txt); do if nmap -sU -p 53 -n --open $ip | grep -q "53/udp open"; then echo $ip >> dns.txt; done`

And effectively reduced my sample size to the following IPs:

```sh
10.10.10.2
10.10.10.3
10.10.11.24
10.10.11.26
10.10.11.31
10.10.11.35
10.10.11.39
10.10.11.41
10.10.11.42
10.10.11.45
10.10.14.1
```

Before querying these servers for the `linkvortex.htb` domain name, I decided to go look for some more because I saw that most of these servers had an Active Directory LDAP running on them (thanks to [my nmap visualizer](https://idy.pindjouf.xyz) and an aggressive `nmap` scan of all the hosts) so I was quickly able to find the hostnames associated to those machines. I now had around 6 hostnames, but I wanted more. Since the target's IP redirected us to a domain name, why wouldn't the others do the same? So I ran a for loop to send requests to all the IPs I had, like this: `for ip in $(cat ips.txt); do echo "Sending request to: $ip" && timeout 1s curl --head "$ip":80; done`

I could now see which IP I was sending a request to, and I'd look through them to see if there was any redirection happening (no clever tricks or command line magic here).

After all of this I was left with a few more domain names which I added to the list. Here's what we've got so far:

```txt
magicgardens.htb
monitorsthree.htb
sightless.htb
caption.htb
trickster.htb
yummy.htb
instant.htb
university.htb
alert.htb
heal.htb
linkvortex.htb
2million.htb
vintage.htb
administrator.htb
certified.htb
cicada.htb
ghost.htb
sightless.htb
```

To be honest, I didn't know what to do at this point.
Luckily enough, I decided to read a blog post from [past3ll3](https://github.com/past3ll3) aka [shinyhat](https://purple.shinyhat.org/) where he mentioned encountering something similar, where web servers redirect you to unknown domain names. He then added them to his `/etc/hosts` to have local resolution and it worked! This may seem obvious to more experienced people, and I'm even surprised I didn't think of it myself because of how much sense it makes. Yet I don't think I would've thought of it had I not read that blog post. This works to bypass the redirection because instead of being forced to go to an unknown location we actually implement our own resolver which forces our requests to go to the actual IP instead of being redirected. Super simple, but you don't know what you don't know. Perhaps I could've figured this out, had I pondered on it for a little while.

I now had access to all the websites that had *records* in our `/etc/hosts`!

One last thing I wanted to check was the DNS servers, I still hadn't made great use of them so I decided to loop through them all, and query for each domain name that I had on my list. This is what it looked like: `for dns in $(cat dns.txt); do for host in $(cat hosts.txt); do dig +tries=1 +time=2 any "$host" @"$dns"; done; done`

Here's what I got from it (I cleaned up to just have the answer, additional and server sections):

```ruby
;; ANSWER SECTION:
infiltrator.htb.	600	IN	A	10.10.11.31
infiltrator.htb.	3600	IN	NS	dc01.infiltrator.htb.
infiltrator.htb.	3600	IN	SOA	dc01.infiltrator.htb. hostmaster.infiltrator.htb. 419 900 600 86400 3600

;; ADDITIONAL SECTION:
dc01.infiltrator.htb.	3600	IN	A	10.10.11.31

;; SERVER: 10.10.11.31#53(10.10.11.31) (TCP)

;; ANSWER SECTION:
university.htb.		600	IN	A	192.168.99.1
university.htb.		600	IN	A	10.10.11.39
university.htb.		3600	IN	NS	dc.university.htb.
university.htb.		3600	IN	SOA	dc.university.htb. hostmaster.university.htb. 541 900 600 86400 3600

;; ADDITIONAL SECTION:
dc.university.htb.	3600	IN	A	192.168.99.1
dc.university.htb.	3600	IN	A	10.10.11.39

;; SERVER: 10.10.11.39#53(10.10.11.39) (TCP)

;; ANSWER SECTION:
vintage.htb.		600	IN	A	10.10.11.45

;; SERVER: 10.10.11.45#53(10.10.11.45) (UDP)

;; ANSWER SECTION:
administrator.htb.	600	IN	A	10.10.11.42

;; SERVER: 10.10.11.42#53(10.10.11.42) (UDP)

;; ANSWER SECTION:
certified.htb.		600	IN	A	10.10.11.41

;; SERVER: 10.10.11.41#53(10.10.11.41) (UDP)

;; ANSWER SECTION:
cicada.htb.		600	IN	A	10.10.11.35

;; SERVER: 10.10.11.35#53(10.10.11.35) (UDP)

;; ANSWER SECTION:
ghost.htb.		600	IN	A	10.0.0.254
ghost.htb.		600	IN	A	127.0.0.1
ghost.htb.		600	IN	A	10.10.11.24

;; SERVER: 10.10.11.24#53(10.10.11.24) (UDP)
```

We've got quite a few interesting things here now! We can identify two domain controllers (`dc.university.htb` and `dc01.infiltrator.htb`), ans consequently two email addresses `hostmaster@university.htb` and `hostmaster@infiltrator.htb` a brand new IP/subnet `192.168.99.1` and some records we couldn't have found from our http redirection scan! (some of the domain names seen in the previous list were found here btw)

I also did a reverse lookup by adding the `-x` flag to the `dig` command and querying for the ips instead of the hostnames (obviously), but that didn't yield any results.

Since we discovered new records I decided to add those to my `/etc/hosts`, but when I tried to access their web page I'd either get a 404 or there wouldn't be any web server at all. So I decided to investigate further by querying the respective DNS servers for their own hostnames.

I put the hostnames I got from these new records and the DNS IPs in two separate files in the same order. And ran this on them:

```sh
paste dns_ip_tmp.txt dns_hostnames_tmp.txt | while IFS=$'\t' read -r ip hostname; do
    echo "Querying $hostname at $ip"
    dig any "$hostname" @"$ip"
done
```

I combine the two files' content line by line separated by tabs in a buffer, with the `paste` command. I then pipe that to a while loop that assigns each column's content to the respective variable with `read`. We then use those to send out queries.

This shows us that they're all in fact domain controllers!

```ruby
;; ANSWER SECTION:
infiltrator.htb.	600	IN	A	10.10.11.31
infiltrator.htb.	3600	IN	NS	dc01.infiltrator.htb.
infiltrator.htb.	3600	IN	SOA	dc01.infiltrator.htb. hostmaster.infiltrator.htb. 419 900 600 86400 3600

;; ADDITIONAL SECTION:
dc01.infiltrator.htb.	3600	IN	A	10.10.11.31

;; SERVER: 10.10.11.31#53(10.10.11.31) (TCP)

;; ANSWER SECTION:
university.htb.		600	IN	A	192.168.99.1
university.htb.		600	IN	A	10.10.11.39
university.htb.		3600	IN	NS	dc.university.htb.
university.htb.		3600	IN	SOA	dc.university.htb. hostmaster.university.htb. 541 900 600 86400 3600

;; ADDITIONAL SECTION:
dc.university.htb.	3600	IN	A	192.168.99.1
dc.university.htb.	3600	IN	A	10.10.11.39

;; SERVER: 10.10.11.39#53(10.10.11.39) (TCP)

;; ANSWER SECTION:
vintage.htb.		600	IN	A	10.10.11.45
vintage.htb.		3600	IN	NS	dc01.vintage.htb.
vintage.htb.		3600	IN	SOA	dc01.vintage.htb. hostmaster.vintage.htb. 222 900 600 86400 3600

;; ADDITIONAL SECTION:
dc01.vintage.htb.	3600	IN	A	10.10.11.45

;; SERVER: 10.10.11.45#53(10.10.11.45) (TCP)

;; ANSWER SECTION:
administrator.htb.	600	IN	A	10.10.11.42
administrator.htb.	3600	IN	NS	dc.administrator.htb.
administrator.htb.	3600	IN	SOA	dc.administrator.htb. hostmaster.administrator.htb. 122 900 600 86400 3600

;; ADDITIONAL SECTION:
dc.administrator.htb.	3600	IN	A	10.10.11.42

;; SERVER: 10.10.11.42#53(10.10.11.42) (TCP)

;; ANSWER SECTION:
certified.htb.		600	IN	A	10.10.11.41
certified.htb.		3600	IN	NS	dc01.certified.htb.
certified.htb.		3600	IN	SOA	dc01.certified.htb. hostmaster.certified.htb. 165 900 600 86400 3600

;; ADDITIONAL SECTION:
dc01.certified.htb.	3600	IN	A	10.10.11.41

;; SERVER: 10.10.11.41#53(10.10.11.41) (TCP)

;; ANSWER SECTION:
cicada.htb.		600	IN	A	10.10.11.35
cicada.htb.		3600	IN	NS	cicada-dc.cicada.htb.
cicada.htb.		3600	IN	SOA	cicada-dc.cicada.htb. hostmaster.cicada.htb. 154 900 600 86400 3600

;; ADDITIONAL SECTION:
cicada-dc.cicada.htb.	3600	IN	A	10.10.11.35

;; SERVER: 10.10.11.35#53(10.10.11.35) (TCP)

;; ANSWER SECTION:
ghost.htb.		600	IN	A	10.0.0.254
ghost.htb.		3600	IN	A	127.0.0.1
ghost.htb.		600	IN	A	10.10.11.24
ghost.htb.		3600	IN	NS	dc01.ghost.htb.
ghost.htb.		3600	IN	SOA	dc01.ghost.htb. hostmaster.ghost.htb. 244 900 600 86400 3600

;; ADDITIONAL SECTION:
dc01.ghost.htb.		3600	IN	A	10.10.11.24
dc01.ghost.htb.		3600	IN	A	10.0.0.254

;; SERVER: 10.10.11.24#53(10.10.11.24) (TCP)
```

Now that I had all this information I wanted to check for common vulnerable ports like SMB for instance which I scanned with this `for ip in $(cat recon/ips.txt); do nmap -v -p 139,445 --script smb-os-discovery "$ip"; done` this got me a bit more data on one host! A brand new domain name and subdomain and a computer name. So let's add those to the list and keep going.

```js
Nmap scan report for 10.10.10.3

PORT    STATE SERVICE
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds

Host script results:
| smb-os-discovery:
|   OS: Unix (Samba 3.0.20-Debian)
|   Computer name: lame
|   NetBIOS computer name:
|   Domain name: hackthebox.gr
|   FQDN: lame.hackthebox.gr
|_  System time: 2025-01-08T20:46:57-05:00

Read data files from: /usr/bin/../share/nmap
```
I quickly tried to ask the DNS servers if they had any information about these new domain names but alas they had nothing.
However I was able to find quite a lot of information about this machines by using `enum4linux-ng -u '' 10.10.10.3` and `smbmap -u -H 10.10.10.3` I did this on all the machines, but the most notable ones are `10.10.10.3` & `10.10.11.35`

Like a list of users (for `10.10.10.3`):

```txt
root
daemon
bin
sys
sync
games
man
lp
mail
news
uucp
proxy
www-data
backup
list
irc
gnats
libuuid
dhcp
syslog
klog
sshd
bind
postfix
ftp
postgres
mysql
tomcat55
distccd
telnetd
proftpd
msfadmin
user
service
nobody
```

And shares:

```js
[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 1 authenticated session(s)

[+] IP: 10.10.10.3:445	Name: hackthebox.gr       	Status: Authenticated
	Disk                                                  	Permissions	Comment
	----                                                  	-----------	-------
	print$                                            	NO ACCESS	Printer Drivers
	tmp                                               	READ, WRITE	oh noes!
	opt                                               	NO ACCESS
	IPC$                                              	NO ACCESS	IPC Service (lame server (Samba 3.0.20-Debian))
	ADMIN$                                            	NO ACCESS	IPC Service (lame server (Samba 3.0.20-Debian))
```

```js
[*] Detected 1 hosts serving SMB
[*] Established 1 SMB connections(s) and 0 authenticated session(s)

[+] IP: 10.10.11.35:445    Name: CICADA-DC            Status: Unauthenticated
        Disk                                                  	Permissions	Comment
        ----                                                  	-----------	-------
        ADMIN$                                            	NO ACCESS	Remote Admin
        C$                                               	NO ACCESS	Default share
        DEV                                              	READ ONLY	
        HR                                               	READ ONLY	
        IPC$                                             	READ ONLY	Remote IPC
        NETLOGON                                         	READ ONLY	Logon server share
        SYSVOL                                           	READ ONLY	Logon server share
```

I couldn't get much from SMTP so I went straight to SNMP enumeration with `snmpwalk -c public -v2c -Oa 10.10.11.48` and found this on our target's neighbor machine!

```ruby
Scanning: 10.10.11.48
iso.3.6.1.2.1.1.1.0 = STRING: "Linux underpass 5.15.0-126-generic #136-Ubuntu SMP Wed Nov 6 10:38:22 UTC 2024 x86_64"
iso.3.6.1.2.1.1.2.0 = OID: iso.3.6.1.4.1.8072.3.2.10
iso.3.6.1.2.1.1.3.0 = Timeticks: (935969) 2:35:59.69
iso.3.6.1.2.1.1.4.0 = STRING: "steve@underpass.htb"
iso.3.6.1.2.1.1.5.0 = STRING: "UnDerPass.htb is the only daloradius server in the basin!"
iso.3.6.1.2.1.1.6.0 = STRING: "Nevada, U.S.A. but not Vegas"
iso.3.6.1.2.1.1.7.0 = INTEGER: 72
iso.3.6.1.2.1.1.8.0 = Timeticks: (5) 0:00:00.05
iso.3.6.1.2.1.1.9.1.2.1 = OID: iso.3.6.1.6.3.10.3.1.1
iso.3.6.1.2.1.1.9.1.2.2 = OID: iso.3.6.1.6.3.11.3.1.1
iso.3.6.1.2.1.1.9.1.2.3 = OID: iso.3.6.1.6.3.15.2.1.1
iso.3.6.1.2.1.1.9.1.2.4 = OID: iso.3.6.1.6.3.1
iso.3.6.1.2.1.1.9.1.2.5 = OID: iso.3.6.1.6.3.16.2.2.1
iso.3.6.1.2.1.1.9.1.2.6 = OID: iso.3.6.1.2.1.49
iso.3.6.1.2.1.1.9.1.2.7 = OID: iso.3.6.1.2.1.50
iso.3.6.1.2.1.1.9.1.2.8 = OID: iso.3.6.1.2.1.4
iso.3.6.1.2.1.1.9.1.2.9 = OID: iso.3.6.1.6.3.13.3.1.3
iso.3.6.1.2.1.1.9.1.2.10 = OID: iso.3.6.1.2.1.92
iso.3.6.1.2.1.1.9.1.3.1 = STRING: "The SNMP Management Architecture MIB."
iso.3.6.1.2.1.1.9.1.3.2 = STRING: "The MIB for Message Processing and Dispatching."
iso.3.6.1.2.1.1.9.1.3.3 = STRING: "The management information definitions for the SNMP User-based Security Model."
iso.3.6.1.2.1.1.9.1.3.4 = STRING: "The MIB module for SNMPv2 entities"
iso.3.6.1.2.1.1.9.1.3.5 = STRING: "View-based Access Control Model for SNMP."
iso.3.6.1.2.1.1.9.1.3.6 = STRING: "The MIB module for managing TCP implementations"
iso.3.6.1.2.1.1.9.1.3.7 = STRING: "The MIB module for managing UDP implementations"
iso.3.6.1.2.1.1.9.1.3.8 = STRING: "The MIB module for managing IP and ICMP implementations"
iso.3.6.1.2.1.1.9.1.3.9 = STRING: "The MIB modules for managing SNMP Notification, plus filtering."
iso.3.6.1.2.1.1.9.1.3.10 = STRING: "The MIB module for logging SNMP Notifications."
iso.3.6.1.2.1.1.9.1.4.1 = Timeticks: (3) 0:00:00.03
iso.3.6.1.2.1.1.9.1.4.2 = Timeticks: (3) 0:00:00.03
iso.3.6.1.2.1.1.9.1.4.3 = Timeticks: (3) 0:00:00.03
iso.3.6.1.2.1.1.9.1.4.4 = Timeticks: (3) 0:00:00.03
iso.3.6.1.2.1.1.9.1.4.5 = Timeticks: (3) 0:00:00.03
iso.3.6.1.2.1.1.9.1.4.6 = Timeticks: (4) 0:00:00.04
iso.3.6.1.2.1.1.9.1.4.7 = Timeticks: (4) 0:00:00.04
iso.3.6.1.2.1.1.9.1.4.8 = Timeticks: (5) 0:00:00.05
iso.3.6.1.2.1.1.9.1.4.9 = Timeticks: (5) 0:00:00.05
iso.3.6.1.2.1.1.9.1.4.10 = Timeticks: (5) 0:00:00.05
iso.3.6.1.2.1.25.1.1.0 = Timeticks: (937724) 2:36:17.24
iso.3.6.1.2.1.25.1.2.0 = STRING: "....&2.+.."
iso.3.6.1.2.1.25.1.3.0 = INTEGER: 393216
iso.3.6.1.2.1.25.1.4.0 = STRING: "BOOT_IMAGE=/vmlinuz-5.15.0-126-generic root=/dev/mapper/ubuntu--vg-ubuntu--lv ro net.ifnames=0 biosdevname=0"
iso.3.6.1.2.1.25.1.5.0 = Gauge32: 0
iso.3.6.1.2.1.25.1.6.0 = Gauge32: 310
iso.3.6.1.2.1.25.1.7.0 = INTEGER: 0
iso.3.6.1.2.1.25.1.7.0 = No more variables left in this MIB View (It is past the end of the MIB tree)
```

This `iso.3.6.1.2.1.25.1.2.0 = STRING: "....&2.+.."` particular line intrigues me quite a bit, it seems to be encrypted. Mind you I only used the `-Oa` flag, because it was originally a hex string. I thought let's try version 1 since there was no encryption then and it changed to this: `iso.3.6.1.2.1.25.1.2.0 = STRING: "....(%.+.."`. Nothing crazy here, but I'll still take a mental note of it.

## Vulnerability assessment


