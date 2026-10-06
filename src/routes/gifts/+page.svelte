<script>
  import giftsData from '$lib/gifts.json';

  const sortedGifts = giftsData.categories.map(group => ({
    ...group,
    items: [...group.items].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
  }));

  const date = new Date(giftsData.lastUpdated);
  const formattedDate = [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getFullYear())
  ].join('-');
</script>

<svelte:head>
    <title>Gifts | Pindjouf.xyz</title>
    <meta name="description" content="A wish list of things I'd love to receive. Browse by category — tea, home, gym gear — and find the perfect gift with direct links to each item." />

    <meta property="og:title" content="Gift Wish List | Pindjouf.xyz" />
    <meta property="og:description" content="A curated wish list of items I'd love to receive. Tea, home, gym gear — with direct links to each product." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://pindjouf.xyz/gifts" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Gift Wish List | Pindjouf.xyz" />
    <meta name="twitter:description" content="A curated wish list of items I'd love to receive. Tea, home, gym gear — with direct links to each product." />

    <meta name="keywords" content="gift list, wish list, gifts, presents, tea, home, gym" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://pindjouf.xyz/gifts" />
</svelte:head>

<style>
    :root {
      --whiiiiiiite: #fff;
      --gruvbox-blue: #30B0B8;
      --line: #8b8b8b;
    }

    h1 {
      margin-bottom: 1rem;
      border-bottom: unset;
    }

    h2 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: var(--whiiiiiiite);
      border-bottom: 1px solid var(--line);
    }

    .gift-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.75rem;
    }

    .gift-item a {
      color: var(--gruvbox-blue);
      text-decoration: none;
    }

    .gift-item a:hover {
      text-decoration: underline;
    }

    .gift-price {
      opacity: 0.66;
      font-size: 0.9em;
    }

    .empty {
      opacity: 0.5;
      font-style: italic;
    }

    .updated {
      opacity: 0.5;
      font-size: 0.85em;
      margin-top: 2rem;
    }
</style>

<main>
  <h1>Gifts</h1>
  <p>If you're looking for gift ideas, here's a list of things I'd love to receive. Everything is linked directly to the product page.</p>

  {#each sortedGifts as group}
    <h2>{group.category}</h2>
    {#if group.items.length}
      <ul>
        {#each group.items as item}
          <li class="gift-item">
            <a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>
            <span class="gift-price">{item.priceCurrency} {item.price.toFixed(2)}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="empty">Nothing here yet &mdash; working on it.</p>
    {/if}
  {/each}

  <p class="updated">Last updated: {formattedDate}</p>
</main>
