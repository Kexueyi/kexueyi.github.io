import { CONFERENCES } from './data/publist.js';
import { AUTHOR_LINKS } from './data/authors.js';

export class Publication {
  static createPublication(data) {
    return `
      <div class="publication${data.image ? '' : ' publication-no-image'}">
        ${data.image ? `
        <div class="publication-image">
          <img src="${data.image}" ${data.imageFull ? `data-full="${data.imageFull}"` : ''} alt="${data.title}" loading="lazy" decoding="async">
        </div>` : ''}
        <div class="publication-content">
          ${this.createHeader(data)}
          ${this.createAuthors(data.authors)}
          ${this.createVenueInfo(data)}
          ${this.createLinks(data)}
          ${data.abstract ? `<p class="abstract">${data.abstract}</p>` : ''}
        </div>
      </div>
    `;
  }

  static createHeader({ conference, year, title, links }) {
    const primaryLink = links.webpage || links.project || links.paper || '#';
    const shortYear = year.toString().slice(-2); // Get last 2 digits
    const venueTag = `${conference}&nbsp;'${shortYear}`; 
    
    return `
      <div class="paper-header">
        ${conference ? `<span class="venue-tag">${venueTag}</span>` : ''}
        <a href="${primaryLink}" class="paper-title">${title}</a>
      </div>
    `;
  }
  

  static createAuthors(authors) {
    const SELF_NAMES = ['Ke Xueyi', 'Xueyi Ke'];
    const isCoFirstAuthor = authors[0].endsWith('*') || (authors[1] && authors[1].endsWith('*'));
    
    return `
      <div class="authors">
        ${authors.map((author, index) => {
          // Remove asterisk for display but keep it for logic
          const cleanAuthor = author.replace('*', '');
          const isself = SELF_NAMES.includes(cleanAuthor);
          const link = AUTHOR_LINKS[cleanAuthor];
          const isCoAuthor = author.endsWith('*');
          
          let authorElement = link 
            ? `<a href="${link}" class="${isself ? 'author-self' : 'author-link'}">${cleanAuthor}</a>`
            : `<span class="${isself ? 'author-self' : ''}">${cleanAuthor}</span>`;
          
          // Add co-first author marker
          // usage: [author1*, author2*]
          if (isCoAuthor) {
            authorElement += '<sup>*</sup>';
          }
          
          return authorElement;
        }).join(', ')}
        ${isCoFirstAuthor ? '<br><small>* Equal contribution</small>' : ''}
      </div>
    `;
  }

  static createVenueInfo({ conference, year }) {
    return `
      <div class="venue-info">
        ${conference ? `${CONFERENCES[conference] || conference}, ` : ''}${year}
      </div>
    `;
  }
  
  // SVG icons for link buttons
  static icons = {
    webpage: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    repo: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    paper: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    cite: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/></svg>',
  };

  static createLinks({ links, bibtex }) {
    return `
      <div class="paper-links">
        ${(links.webpage || links.project) ? `<a href="${links.webpage || links.project}" class="paper-link" data-type="project">${this.icons.webpage}Webpage</a>` : ''}
        ${(links.repo || links.code) ? `<a href="${links.repo || links.code}" class="paper-link" data-type="code">${this.icons.repo}Repo</a>` : ''}
        ${links.paper ? `<a href="${links.paper}" class="paper-link" data-type="paper">${this.icons.paper}Paper</a>` : ''}
        ${bibtex ? `<button class="paper-link cite-button" data-type="cite" data-bibtex='${bibtex.replace(/'/g, "\\'")}'>${this.icons.cite}Cite</button>` : ''}
      </div>
    `;
  }
  
  static formatBibtex(bibtex) {
    // Remove leading/trailing whitespace
    let formatted = bibtex.trim();
    
    // Split into lines and clean each line
    let lines = formatted.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length === 0) return bibtex;
    
    let result = [];
    let indentLevel = 0;
    const indent = '  '; // 2 spaces for indentation
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Handle opening brace (entry start)
      if (line.match(/^@\w+\s*\{/)) {
        result.push(line);
        indentLevel = 1;
        continue;
      }
      
      // Handle closing brace (entry end)
      if (line === '}' || line === '},') {
        indentLevel = 0;
        result.push(line);
        continue;
      }
      
      // Handle field lines
      if (line.includes('=')) {
        // Split on first '=' to handle cases like "title = {A = B}"
        let [key, ...valueParts] = line.split('=');
        let value = valueParts.join('=');
        
        // Clean up key and value
        key = key.trim();
        value = value.trim();
        
        // Remove trailing comma if present
        if (value.endsWith(',')) {
          value = value.slice(0, -1).trim();
        }
        
        // Format the line with proper spacing
        let formattedLine = `${indent.repeat(indentLevel)}${key} = ${value}`;
        
        // Add comma for all lines except the last field
        if (i < lines.length - 1 && !lines[i + 1].match(/^\s*\}/) && lines[i + 1] !== '}') {
          formattedLine += ',';
        }
        
        result.push(formattedLine);
      } else {
        // Handle other lines (shouldn't normally happen in well-formed bibtex)
        result.push(`${indent.repeat(indentLevel)}${line}`);
      }
    }
    
    return result.join('\n');
  }
  
  static showCitationPopup(bibtex) {
    const popup = document.createElement('div');
    popup.className = 'citation-popup';
    
    // Format the bibtex with proper indentation and structure
    const formattedBibtex = this.formatBibtex(bibtex);
    
    // Escape HTML but preserve whitespace
    const escapedBibtex = formattedBibtex
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/`/g, '&#96;');

    popup.innerHTML = `
      <div class="popup-header">
        <button class="popup-close" type="button">&times;</button>
        <h3>Cite our work! 🥳</h3>
      </div>
      <pre class="citation-content">${escapedBibtex}</pre>
      <div class="popup-actions">
        <button class="popup-button popup-copy" type="button">
          Copy BibTeX
        </button>
        <button class="popup-button popup-download" type="button">
          Download .bib
        </button>
      </div>
    `;
  
    // Add event listeners after DOM insertion
    popup.querySelector('.popup-close').addEventListener('click', () => {
      Publication.closeCitationPopup();
    });
  
    popup.querySelector('.popup-copy').addEventListener('click', async () => {
      try {
        // Copy the formatted version
        await navigator.clipboard.writeText(formattedBibtex);
        const copyBtn = popup.querySelector('.popup-copy');
        copyBtn.setAttribute('data-copied', 'true');
        
        // Wait for animation to complete before removing attribute
        copyBtn.addEventListener('animationend', () => {
          copyBtn.removeAttribute('data-copied');
        }, { once: true }); // Use once:true to ensure the listener is removed after execution
        
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  
    popup.querySelector('.popup-download').addEventListener('click', () => {
      Publication.downloadBibtex(formattedBibtex);
    });

    // Create and append backdrop with click handler
    const backdrop = document.createElement('div');
    backdrop.className = 'popup-backdrop';
    backdrop.addEventListener('click', (e) => {
      // Only close if clicking the backdrop itself, not its children
      if (e.target === backdrop) {
        Publication.closeCitationPopup();
      }
    });

    // Add elements to DOM
    document.body.appendChild(backdrop);
    document.body.appendChild(popup);
    
    // Trigger animation
    requestAnimationFrame(() => {
      backdrop.style.display = 'block';
      popup.style.display = 'block';
      requestAnimationFrame(() => {
        backdrop.classList.add('show');
      });
    });

    // Add escape key handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        Publication.closeCitationPopup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  static closeCitationPopup() {
    const popup = document.querySelector('.citation-popup');
    const backdrop = document.querySelector('.popup-backdrop');
    
    if (popup && backdrop) {
      // Start fading out
      popup.classList.add('hide');
      backdrop.classList.add('hide');
      
      // Remove popup quickly
      setTimeout(() => {
        popup.remove();
      }, 150); // Quick removal after fade starts
      
      // Remove backdrop after transition
      setTimeout(() => {
        backdrop.remove();
      }, 300); // Full fade duration
    }
  }

  static downloadBibtex(bibtex) {
    try {
      // Extract citation key from bibtex
      const citationKey = bibtex.match(/@\w+\{([^,]+)/)?.[1] || 'citation';
      // Generate filename: citationKey_year.bib
      const filename = `${citationKey}.bib`;

      const blob = new Blob([bibtex], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  }

  static initCitationPopups() {
    document.addEventListener('click', e => {
      if (e.target.classList.contains('cite-button')) {
        this.showCitationPopup(e.target.dataset.bibtex);
      }
    });
  }
}