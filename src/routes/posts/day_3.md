---
title: "Day 3 of making a UART 𓇲 I made a baud rate generator"
date: "2024-11-18"
---

# Day 3 of making a UART 𓇲 I made a baud rate generator

I want to try a different approach for this article, instead of simply explaining my implementation and reasoning, I'd like to explore the topic first. I'm working on improving my problem-solving skills by following the practices outlined in this [article](https://learnhowtolearn.org/how-to-understand-and-retain-any-concept-10x-better). My first order of business will be to break down the topic to a point where it's easily digestible. Down to first principles. Which means a fundamental truth, one that doesn't need any additional information or facts to prove its validity. "Fire is hot" for instance is not something to be debated, it just is, regardless of any external factors. Only then will I move on to explaining how I've implemented it, so let's get started!

## What are we trying to achieve?

Before trying to understand the what and diving into too much detail, I'd like to define the desired outcome first. This allows us to have a clear idea of what the final result should look like, and derive a set of actions from there.
The purpose of a baud rate generator in our case (making a UART) is to determine communication speed. Being that the A in UART stands for asynchronous, meaning that the devices don't have to share a clock signal, we know that we can't just rely on system clocks being the same to synchronize transmission and reception. + that would limit portability.

Let's look at the importance of agreeing on a set speed of communication: If I have one device transmitting at 20 bit/s and the other receiving at 10 bit/s I'm only gonna get 50% of the data! It's fairly simple to understand now, why we need a way to coordinate our efforts and make sure we're on the same page between devices.

## The benefits of having baud rate

I've already covered the main benefit, which is that with the same baud rate we're sure to not miss any data (this is actually not true, we're only improving the odds of data reception but there's no guarantee it will arrive to the reception device, I cover this later in the article). But I wanted to make this little section for those of us (like me) who sometimes need a bit more of a verbose explanation to understand something.

Let's say you have device A we'll call it **Tx**, the transmitter and device B which we'll call **Rx**, the receiver.

We'll create a struct in pseudo-code for each of them and look at the benefits of a baud rate from a different perspective:

```rust
struct Tx {
    SYSTEM_CLOCK_FREQ: u32 = 50000000; // 50 MHz
    BAUD_RATE: u32 = 115200;
    DIVIDER: u32 = SYSTEM_CLOCK_FREQ / BAUD_RATE; // 434
}

struct Rx {
    SYSTEM_CLOCK_FREQ: u32 = 100000000; // 100 MHz
    BAUD_RATE: u32 = 115200;
    DIVIDER: u32 = SYSTEM_CLOCK_FREQ / BAUD_RATE; // 868
}
```

As we can see by using the same baud rate, we effectively make the devices match each other because the divider compensates for the different clock speeds. This is the beauty of the baud rate generator—it abstracts away the differences in system clock speeds and ensures that the baud signal remains consistent across devices. Which might seem counterintuitive because the `DIVIDER` value ends up being smaller on the `Tx` than the `Rx` so it must go faster the `Rx` because we toggle the signal more often right? Well no, because even though the baud signal needs less clock cycles in `Tx` to toggle, we have to remind ourselves that its clock is of a slower frequency, which means each clock cycle takes more time here therefore we end up with both devices transmitting and receiving at the same speed!

P.S. Baud rate **Bd** and bit rate **bit/s** aren't the same in certain cases but for our intents and purposes, they are. So let's not waste too much time on it.

## My implementation

Let's see what it looks like in code:

### Port declaration

```verilog
module baudUnit (
    input clk,
    // input reset,
    output reg baud,
    output reg sample
);
```

I've commented out the `reset` signal because I'm feeling conlficted about it. On one hand it's a common practice and is very useful for testing and/or shutting down a signal. But I'm not sure what the purpose of it would be since our top_module needs the baud. Add to that the fact that it's a bad practice to stop clock-like signals anyways because it messes with everything else. With the UART being dependent on the baud rate I truly do not see the point in having a reset port. That being said I recognize that perhaps I haven't thought long enough about this so there might be some faults in my judgement. I'd be more than happy to receive some feedback and debate why it could be a good idea to keep it in.

Besides that, as we can see we have a very short list of ports and they're fairly simple, `clk` and `baud` are a given. But some of you might get confused about the `sample` output, don't fret it, I'll touch on it later.

We'll also need an extra register to count how many clock cycles it takes to toggle the baud signal, which is called the `DIVIDER` (it's explained in the next code block). Here's what our counter looks like -> `reg [15:0] counter;`

### Parameters

```verilog
parameter SYSTEM_CLOCK_FREQ = 100000000; // 100 MHz
parameter BAUD_RATE = 115200;

localparam int DIVIDER = SYSTEM_CLOCK_FREQ / BAUD_RATE;
```

My system's clock frequency is 100 MHz because I toggle the `clk` signal every 5 ns, so I declare it as such.  
There are many common baud rates like 9600, ..., ... but I settled on 115200, for no particular reason other than wanting to get on with it. (I'm not sure how others make that choice, perhaps it's about cost or something similar).  
The `DIVIDER` is a parameter we use to divide the system clock frequency by the baud rate to determine how many clock cycles it takes for each `baud` signal toggle. That's my simplified explanation. If you want the full details, feel free to check out this excerpt from wikipedia:

> The symbol duration time, also known as the [unit interval](url), can be directly measured as the time between transitions by looking at an eye diagram of the signal on an oscilloscope. The duration *Ts* can be calculated as:

<img src="/assets/formula.svg" alt="formula" style="width: 15%; display: block; filter: invert(1) brightness(2);">

> where fs is sthe symbol rate. There is also a chance of miscommunication which leads to ambiguity.
> Example: Communication at the baud rate *1000 Bd* means communication by means of sending *1000 symbols per second.* The symbol duration time is 1/1000 second (that is, 1 millisecond).

This excerpt wasn't necessary, but I feel that it could help the reader understand the concept more deeply in case of any future confusion. I know that it helped me clarify some misunderstandings.

### Combinational logic

```verilog
always @(posedge clk) begin
    if (counter >= DIVIDER - 1) begin
        counter <= 0;
        baud <= ~baud;
        sample <= 0;
    end else if (counter >= DIVIDER / 2) begin
        sample <= 1;
        counter <= counter + 1;
    end else begin
        counter <= counter + 1;
    end
end
```

Here we've got 2 conditions (excluding the default condition).  
What the first one does is fairly simple, once our counter reaches the `DIVIDER` value i.e. 868 in our case. We reset every signal to 0 and toggle the baud signal.

The second condition is where I get to talk about the utility of a `sample` signal, this is exclusively used in my receiver, but it's purpose is very interesting. The `sample` signal is used to send a sample bit every time we're in the middle of the symbol duration time i.e. in the middle of a `baud` signal, which is a method used to ensure we reduce the risks of missing a bit, since by default, the *"catching"* logic on the reception side is done at the positive edge of the `baud` signal we might try to catch it too early. So having a standardized way to ensure we only activate reception when there's a sample bit is very useful! We increment the counter in here as well.

The default condition is fairly obvious, as long as we haven't reached any of the previous conditions, we keep incrementing the counter.

That's pretty much it for my baud rate generator. If you have any questions or suggestions, feel free to reach out on [X](https://x.com/pindjouf) (formerly twitter). Or if you want to go take a look at the project and perhaps work on your own implementation of a UART, feel free to go fork it on [GitHub](https://github.com/pindjouf/uart).
