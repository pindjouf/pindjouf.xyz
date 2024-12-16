---
title: "Where X=verilog"
description: "A quick reference guide to Verilog basics, including module declarations, signal assignments, operators, and common syntax patterns."
date: "2024-08-06"
lastUpdated: "2024-08-06"
author: "pindjouf"
slug: "learn-verilog-quick-reference"
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

First I would like to thank Hackman since a lot of the verilog stuff I learned comes from his website! [His verilog article.](https://lateblt.tripod.com/verilog.htm)
There is a lot more to verilog that I still have to learn but these are the basics, I will continually come back and upgrade the page when I feel the need to.

Btw if you don't know this is written in the style of [learnxinyminutes.com](https://learnxinyminutes.com/), I just decided to make mine because they don't have one for verilog.

## Simple hello world example:

```verilog
initial $display("Hello, world!");
```

## Declaring a module looks like this:

```verilog
module top_module (
    input a,
    output b
    );
endmodule

## Instantiation of a module looks like this:

module tb;
    wire a;
    reg b;

    top_module dut(
        .a(a),
        .b(b)
        );
endmodule
```

## Assigning signals looks like this:

```verilog
assign b = a;
```

## Simple diagram of the module \`top\_module\`:

```verilog
// a->□->b
```

## Wires and Registers:

```verilog
// Wires are just there to connect different elements, they are driven by continuous assign statements or module ports. 
//They can be thought of as physical wires.
```

## Buses or Vectors:

```verilog
// Buses or Vectors let you extend your ports or signals by giving them a range of n-bits.
// They're usually written from MSB to LSB although it doesn't really matter.
// Ex with an 8-bit input port:
input [7:0] hehe;

// Assign n-wire to an output:
assign out = hehe[4];
```

## Number Representations:

```verilog
// Numbers in verilog can represented in multiple number systems like hex, octal, decimal or binary.
// The syntax is as follows:
// w'snnn
// w = width of digit(s) (how many bits it uses) 
// s = number system
// nnn = the actual numbers
// Binary example:
8'b01010101;

// Hex example:
2'h55;

// Decimal example:
2'd85;

// Octal example:
3'o125;
// Notice I've used the exact same value for each example.
```

## Operators:

```verilog
// NOT = ~
// AND = &
// OR = |
// XOR = ^
// NOR = ~( x | y )
// NAND = ~( x & y )
// Logical Operators are the same as for any other programming language.
```

## IF statement:

```verilog
if (condition) begin
  // code to execute if true;
end else begin
  // code to execute if not true;
end
```

## Delays:

```verilog
// Delays tell the program how many time units to wait before executing a line of code. Similar to the sleep command in shell.
#20; // code goes here;
```

## Always blocks:

```verilog
// Always, is a procedural block. It can be used as a set of instruction or as a statement.
// Statement example:
always #5 clk = ~clk;

// Block example that tells the program to execute the code block whenever the stop signal is true:
always @(stop) begin
    // code goes here;
end

// More common block example that executes on the positive edge of a clock signal/cycle:
always @(posedge clk) begin
    // code goes here;
end
// I think of the always blocks as being if statements inside a while true.
```
<br>
