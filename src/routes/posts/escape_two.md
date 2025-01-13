---
title: "EscapeTwo write-up"
description: "A quick reference guide to Verilog basics, including module declarations, signal assignments, operators, and common syntax patterns."
date: "2024-08-06"
lastUpdated: "2024-08-06"
author: "pindjouf"
slug: "linkvortex"
prevPost: "linkvortex"
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

## Our base -- 10.10.11.51 (target machine)



## Information gathering -- recon phase

```js
[*] Detected 1 hosts serving SMB                                                                                                  
[*] Established 1 SMB connections(s) and 1 authenticated session(s)                                                      
                                                                                                                             
[+] IP: 10.10.11.51:445	Name: 10.10.11.51         	Status: Authenticated
	Disk                                                  	Permissions	Comment
	----                                                  	-----------	-------
	Accounting Department                             	READ ONLY	
	ADMIN$                                            	NO ACCESS	Remote Admin
	C$                                                	NO ACCESS	Default share
	IPC$                                              	READ ONLY	Remote IPC
	NETLOGON                                          	READ ONLY	Logon server share 
	SYSVOL                                            	READ ONLY	Logon server share 
	Users                                             	READ ONLY	
[*] Closed 1 connections
```

mfs accounts:

```js

| First Name | Last Name | Email | Username | Password |
|------------|-----------|-------|----------|----------|
| Angela | Martin | angela@sequel.htb | angela | 0fwz7Q4mSpurIt99 |
| Oscar | Martinez | oscar@sequel.htb | oscar | 86LxLBMgEWaKUnBG |
| Kevin | Malone | kevin@sequel.htb | kevin | Md9Wlq1E5bZnVDVo |
| NULL | NULL | sa@sequel.htb | sa | MSSQLP@ssw0rd |
```

```js
PS C:\SQL2019\ExpressAdv_ENU> cat sql-Configuration.INI
[OPTIONS]
ACTION="Install"
QUIET="True"
FEATURES=SQL
INSTANCENAME="SQLEXPRESS"
INSTANCEID="SQLEXPRESS"
RSSVCACCOUNT="NT Service\ReportServer$SQLEXPRESS"
AGTSVCACCOUNT="NT AUTHORITY\NETWORK SERVICE"
AGTSVCSTARTUPTYPE="Manual"
COMMFABRICPORT="0"
COMMFABRICNETWORKLEVEL=""0"
COMMFABRICENCRYPTION="0"
MATRIXCMBRICKCOMMPORT="0"
SQLSVCSTARTUPTYPE="Automatic"
FILESTREAMLEVEL="0"
ENABLERANU="False" 
SQLCOLLATION="SQL_Latin1_General_CP1_CI_AS"
SQLSVCACCOUNT="SEQUEL\sql_svc"
SQLSVCPASSWORD="WqSZAF6CysDQbGb3"
SQLSYSADMINACCOUNTS="SEQUEL\Administrator"
SECURITYMODE="SQL"
SAPWD="MSSQLP@ssw0rd!"
ADDCURRENTUSERASSQLADMIN="False"
TCPENABLED="1"
NPENABLED="1"
BROWSERSVCSTARTUPTYPE="Automatic"
IAcceptSQLServerLicenseTerms=True
```

## Vulnerability assessment

```js
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-01-13 13:33:02Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
1433/tcp open  ms-sql-s      Microsoft SQL Server 2019 15.00.2000
| vulners: 
|   cpe:/a:microsoft:sql_server:2019: 
|     	CVE-2023-36785	7.8	https://vulners.com/cve/CVE-2023-36785
|_    	CVE-2022-23276	7.8	https://vulners.com/cve/CVE-2022-23276
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows
```
