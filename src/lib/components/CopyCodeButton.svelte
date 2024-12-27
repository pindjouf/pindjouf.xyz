<script>
  import { onMount } from 'svelte';
  
  export let buttonPosition = 'top-right';
  
  const addCopyButtons = () => {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(pre => {
      if (pre.querySelector('.copy-button')) return;
      
      const copyButton = document.createElement('button');
      copyButton.innerHTML = '📋';
      copyButton.className = `copy-button ${buttonPosition}`;
      copyButton.setAttribute('aria-label', 'Copy code to clipboard');
      
      copyButton.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText;
        
        try {
          await navigator.clipboard.writeText(code);
          copyButton.innerHTML = '✓';
          copyButton.classList.add('copied');
          
          setTimeout(() => {
            copyButton.innerHTML = '📋';
            copyButton.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          copyButton.innerHTML = '❌';
          setTimeout(() => {
            copyButton.innerHTML = '📋';
          }, 2000);
        }
      });
      
      pre.style.position = 'relative';
      pre.appendChild(copyButton);
    });
  };

  onMount(() => {
    addCopyButtons();
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          addCopyButtons();
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => observer.disconnect();
  });
</script>

<style>
  :global(.copy-button) {
    position: absolute;
    padding: 8px;
    background: #3c3836;
    border: none;
    border-radius: 4px;
    color: #ebdbb2;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
    z-index: 10;
  }

  :global(.copy-button:hover) {
    opacity: 1;
  }

  :global(.copy-button.copied) {
    background: #98971a;
  }

  :global(.copy-button.top-right) {
    top: 8px;
    right: 8px;
  }

  :global(.copy-button.top-left) {
    top: 8px;
    left: 8px;
  }

  :global(pre) {
    position: relative !important;
  }
</style>
