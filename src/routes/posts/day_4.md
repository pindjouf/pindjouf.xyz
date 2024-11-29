---
title: "Day 4 of making a UART 𓇲 I made a transmitter"
date: "2024-11-29"
---

# Day 4 of making a UART 𓇲 I made a transmitter

This is a continuation of the PISO shift register. Or more accurately, a design refactor. After learning a few things in passing here and there, I came to the conclusion that implementing a shift register should really only require a few lines at most. If you've been following this learning journey, you'd know that I previously made modules for a D flip flop, and PISO/SIPO shift registers. Those "experiments" let's call them, were good for learning and understanding what they are and how they work. But it gets redundant real fast and only adds to your project's complexity unnecessarily.

As per my last article in the series I'd like to first define what it is we're trying to achieve in the context of implementing a UART transmitter. So without further ado let's get to it.

## A high level overview of a transmitter module in UART

The most important part of the transmission module is the `tx` output wire. Its purpose is to transmit serial data as per the UART protocol. So what is the UART protocol you might ask? Like any protocol, it's just a simple ruleset that two (or more) devices agree upon for communication. Just like we humans have language, culture, social norms to dictate how we communicate. Machines have protocols!

Our UART has multiple components, notably a [PISO shift register](https://pindjouf.xyz/posts/day_2), [baud rate generator](https://pindjouf.xyz/posts/day_3) and a state machine that all work together to make the transmission of a UART packet possible. We can easily break down the packet into four distinct parts, of which one is optional.

<img src="/assets/uart_packet.jpg" alt="shift reg states" style="width: 50%; display: block;">
<i>Figure 1: UART Packet Structure</i>

### Start bit

It's purpose is fairly obvious, we use it to signal the start of a packet to the receiving device. The way we do this, is by sending a `0`. Because our UART runs in the IDLE state by default, which is constantly sending 1's. Sending a `0` is an effective method to show a change, which signals the start of a transmission! In this state our transmitter has no other purpose than to transmit 1's continuously, no matter what its input bus or shift register holds. Which leads us to the data frame.

### Data frame

This holds the actual information we're transmitting and is what the receiving device will end up processing. Anything outside of this, is just a protocol formality you could say. This is where you can hold an ASCII character's value for example. Like 87, the decimal representation of `W` which translates to 01010111 in your data frame! Now we can move on to how to stop this transmission.

### Stop bit(s)

When we're done with the packet, we send a final `1` bit to indicate the transmission is finished! This is just convention and might make less sense that the start bit, but that's a detection job for our receiver ;) You might not think that it makes less sense but I find that the abrupt switch from a constant stream of 1's to a 0 is a clear indicator. Whereas our last bit in the data frame might very well be a 1, which makes it less intuitive to me.

You get to choose between one or two stop bits. This choice is mostly made based on your area of focus. Do you care more about speed or reliability? One stop bit is enough for most cases (and it's faster!), but if you really need to make sure the data gets sent properly you can include a second one which will improve synchronization and error detection. It might seem like overkill but it makes sense, especially in long distance communications or noisy environments which are noisier by default. Keep in mind that UART isn't typically used in long distance communications though.

### Parity bit (optional)

I kept this one last even though that's not its actual position in a packet, as evidenced in the above figure. But since it's not a vital part of the packet, I felt it shouldn't get prioritized over the other fundamental parts.

This exists mostly as a way to improve error detection. The way it works is by making the total number of 1s in the data frame (including the parity bit) even or odd. Being that the receiver will know this as they'd be using an agreed-upon parity scheme. It'd request retransmission of the data if it detects a mismatch!

## My implementation

As I've mentioned above, there are a few things which made me reconsider using full modules to represent the flip flops and shift registers, and "abstract away" those concepts in a few lines inside the transmitter module.

The first one being the discovery of enums! Don't get me wrong although I'm quite new to programming I was vaguely aware of what enums were, I had just never considered using them in verilog (or even thought of a way to do it). This discovery made it very simple to incorporate a state machine in my design.

### Transmitter states

I defined all my states in a file called `states.vh` (vh for verilog header):

```verilog
typedef enum reg[2:0] {IDLE, WRITE, SHIFT, CLEAR, START, STOP} state;
```

Which allowed me to create variables with the `state` data type! I declared states to use in my receiver as well, so don't mind those. The ones that matter are shown in the figure below (excluding IDLE).

<img src="/assets/tx.gif" alt="shift reg states" style="width: 50%; display: block;">
<i>Figure 2: UART States in action</i>

I then found a code snippet (I can't remember where) that directly glued to my memory, as I knew it was the missing piece in actually handling the change of those newly acquired states!

It looked something like this:

```verilog
state cur_state, nxt_state;

always @(posedge clk or posedge rst) begin
    if (rst) begin
        cur_state <= IDLE;
    end else begin
        cur_state <= nxt_state;
    end
end
```

Which I think is a very clever way to handle state transitions! Our `nxt_state` variable controls the next state as you could've guessed and we stay in IDLE as long as reset is active.

Now that we've covered all our bases, I feel comfortable breaking down my full `transmitter.v` file.

### Port declarations

I was struggling a little with this because we always hear that UART communicates only using two **wires**. See, if they said two signals I wouldn't have gotten stuck on this point, but unfortunately it's something you see in every article talking about UART basics. I ended up declaring my tx signal to be of the `reg` data type because that's the only way I could come up with to handle hardcoding the transmission of a stream of 1's.

```verilog
module transmitter (
    input [7:0] bus,
    input clk,
    input rst,
    output reg tx
    );
```

As you can see it's quite a minimal list, I did this on purpose to not confuse myself further. I'd experienced some troubles debugging in the past so I wanted to keep this list very clean to know exactly what was going on.

`clk` & `rst` are conventional but what's really unique to the UART transmitter here is the input bus vector and the output `tx` which I've already covered. The input bus is what our main device will send us when it's trying to communicate.

We'll have to deal with that data bus accordingly by sending it through a shift register.

### Variables

We need a baud signal to handle our sequential logic and send the bits at each posedge as per the UART protocol. You might be asking yourself why the shift register is 10-bits wide when we're dealing with an 8-bit data bus. Well if you remember correctly we use start and stop bits in our packet and they have to be included in th transmission somehow, since we can't force them into the data bus as that's an input port, we just extend our shift register by 2 bits to give them space.

The shift counter is what we'll use to get out of the SHIFT state but let's not get ahead of ourselves, and I believe you're already familiar with our enum by now!

```verilog
reg baud;
reg [9:0] shift_register;
reg [3:0] shift_counter;
state cur_state, nxt_state;
```
## Sequential logic

We start our always block with a switch statement which will match cur_state's value against its elements.

### IDLE

The default state of our transmitter is one that we've covered already so I won't get into it too much other than explain my code:

```verilog
IDLE: begin
    shift_counter <= 4'b0000;
    tx <= 1'b1;
    if (bus >= 8'b00000001) begin
        nxt_state <= WRITE;
    end else begin
        nxt_state <= IDLE;
    end
end
```

Here I simply initialize the counter to zero and force an active high signal into `tx`. I also check for the input bus being greater than 0 to initiate the state change so that as long as we have nothing, we just stay IDLE!

### WRITE

Here we load the full packet into our shift register, keep in mind that UART is little-endian so we go from LSB to MSB which makes us put the start bit at index 0.

We then check to see if the packet has been correctly loaded and shift if that's the case, if not we stay in WRITE!

```verilog
WRITE: begin
    shift_register <= {1'b1, bus, 1'b0};
    if (shift_register == {1'b1, bus, 1'b0}) begin
        nxt_state <= SHIFT;
    end else begin
        nxt_state <= WRITE;
    end
end
```

### SHIFT

Here you can see what I meant with the shift register only requiring a few lines instead of being a full module! We output index 0 of the shift register and concatenate 1 bit to the left of the shift register's 9 most significant bits (first bits). Effectively pushing out the last value at index 0 on each baud cycle as per figure 2.

We increment the counter for every shift and check once we've reached 9 (1001 in bits) to change states if the condition is satisfied!

```verilog
SHIFT: begin
    tx <= shift_register[0];
    shift_register <= {1'b1, shift_register[9:1]};
    shift_counter <= shift_counter + 1'b1;
    if (shift_counter == 4'b1001) begin
        nxt_state <= CLEAR;
    end else begin
        nxt_state <= SHIFT;
    end
end
```

### CLEAR

Now that the transmission was successful we can clear the counter and shift register so that we don't deal with any leftover data or unexpected behaviors and prepare for the next bus!

Once it's clean we can go back to IDLE, otherwise we keep retrying to clear it all.

```verilog
CLEAR: begin
    shift_counter <= 4'b0000;
    shift_register <= 10'b0000000000;
    if (shift_register == 10'b0000000000) begin
        nxt_state <= IDLE;
    end else begin
        nxt_state <= CLEAR;
    end
end
```

## A few considerations

Voila! That's my implementation of a UART transmitter feel free to go check out the [repo](https://github.com/pindjouf/uart). I'd also like to acknowledge the fact that some people will probably see the flaws in my design straight away, from what I know I still have to implement things like handling the the data changing in between states with something like a `tx_busy` signal. I know there are many ways to make this design more robust, but for now I'd like to focus on a basic implementation to understand the basics. I plan on coming back to this as a more knowledgeable person and rewriting it from top to bottom with better practices.

If you have any advice on how to improve this design or ideas on how to better understand computers, feel free to reach out on [X](https://x.com/pindjouf) (formerly twitter).
