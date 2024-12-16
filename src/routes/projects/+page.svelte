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
    <meta name="description" content="Explore my portfolio of software projects, from active web applications and hardware designs to experimental prototypes. Featuring detailed development status, launch dates, and live demos." />
    
    <meta property="og:title" content="Software Projects Portfolio | Pindjouf.xyz" />
    <meta property="og:description" content="Browse through my collection of software projects, including web applications, hardware designs, and experimental prototypes. See project statuses, launch dates, and live demos." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://pindjouf.xyz/projects" />
    
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Software Projects Portfolio | Pindjouf.xyz" />
    <meta name="twitter:description" content="Browse through my collection of software projects, including web applications, hardware designs, and experimental prototypes. See project statuses, launch dates, and live demos." />
    
    <meta name="keywords" content="software projects, web development, hardware design, portfolio, open source, programming, development" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://pindjouf.xyz/projects" />
    
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
    }

    h1 {
      margin-bottom: 2rem;
      color: var(--whiiiiiiite);
      border-bottom: unset;
    }

    a {
        color: unset;
        text-decoration: unset;
    }

    .project {
      margin-bottom: 1rem;
      border-left: 0.2rem solid var(--whiiiiiiite);
      padding: 1rem;
      transition: background-color 0.3s ease;
    }

    .clickable:hover .project-title {
      text-decoration: underline;
    }

    .clickable {
      cursor: pointer;
      display: block;
    }

    .clickable:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .clickable:hover .green {
      background-color: #7c9f1a;
    }

    .clickable:hover .yellow {
      background-color: #c99a2e;
    }

    .project-title {
      font-size: 16px;
      font-weight: bold;
      color: var(--whiiiiiiite);
      text-decoration: none;
    }

    .project-link {
      color: var(--whiiiiiiite);
      text-decoration: none;
      opacity: 0.66;
      display: block;
      margin-top: 0.5rem;
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
    {#if project.link}
      <a class="project-link-wrapper clickable" href={project.link} target="_blank" rel="noopener noreferrer">
        <div class="project">
          <div class="project-title">
            {project.title}
            <span class="badge {getBadgeColor(project.category)}">
              {#if project.category === 'online'}ONLINE{/if}
              {#if project.category === 'in dev'}IN DEV{/if}
              {#if project.category === 'abandoned'}ABANDONED{/if}
            </span>
          </div>
          <a class="project-link" href={project.link} target="_blank">{project.link}</a>
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
      </a>
    {:else}
      <div class="project">
        <div class="project-title">
          {project.title}
          <span class="badge {getBadgeColor(project.category)}">
            {#if project.category === 'online'}ONLINE{/if}
            {#if project.category === 'in dev'}IN DEV{/if}
            {#if project.category === 'abandoned'}ABANDONED{/if}
          </span>
        </div>
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
    {/if}
  {/each}
</main>
