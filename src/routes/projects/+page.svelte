<script>
  import projects from '$lib/projects.json';

  const getBadgeColor = (category) => {
    switch (category) {
      case 'online': return 'green';
      case 'in dev': return 'yellow';
      case 'abandoned': return 'grey';
    }
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
</script>

<svelte:head>
    <title>Projects | Pindjouf.xyz</title>
</svelte:head>

<style>
  :root {
    --whiiiiiiite: #fff;
    --gruvbox-fg: #ebdbb2; 
    --gruvbox-green: #98971a;
    --gruvbox-yellow: #fabd2f;
  }

  main {
    color: var(--whiiiiiiite);
    /*font-family: monospace;*/
  }

  h1 {
    margin-bottom: 2rem;
    color: var(--whiiiiiiite);
  }

  .project {
    margin-bottom: 1rem;
    border-left: 0.2rem solid;
    border-radius: 30px;
    padding: 1rem;
  }

  .project-title {
    font-size: 16px;
    font-weight: bold;
    color: var(--whiiiiiiite);
  }

  .project-link {
    color: var(--whiiiiiiite);
    text-decoration: none;
    opacity: 0.66;
  }

  .project-link:hover {
    text-decoration: underline;
  }

  .badge {
    display: inline-block;
    margin-left: 10px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    border-radius: 3px;
  }

  .green {
    background-color: var(--gruvbox-green);
    color: var(--whiiiiiiite);
  }

  .yellow {
    background-color: var(--gruvbox-yellow);
    color: black;
  }

  .grey {
    background-color: #6c757d;
    color: var(--whiiiiiiite);
  }

  .launch-date {
    color: var(--whiiiiiiite);
    font-size: 0.85rem;
    margin-top: 5px;
    opacity: 0.33;
  }

  .description {
    margin-top: 5px;
    font-size: 1rem;
    color: var(--whiiiiiiite);
    opacity: 0.88;
  }
</style>

<main>
  <h1>Projects</h1>
  {#each projects as project}
    <div class="project">
      <div class="project-title">
        {project.title}
        <span class="badge {getBadgeColor(project.category)}">
          {#if project.category === 'online'}ONLINE{/if}
          {#if project.category === 'in dev'}IN DEV{/if}
          {#if project.category === 'abandoned'}ABANDONED{/if}
        </span>
      </div>
      {#if project.link}
        <a class="project-link" href={project.link}>{project.link}</a>
      {/if}
      <div class="description">{project.description}</div>
      <div class="launch-date">
        {#if project.category === 'online'}
          Launched {formatDate(project.launch_date)}
        {/if}
        {#if project.category === 'in dev'}
          Started {formatDate(project.launch_date)}
        {/if}
        {#if project.category === 'abandoned'}
          Abandoned {formatDate(project.launch_date)}
        {/if}
      </div>
    </div>
  {/each}
</main>
