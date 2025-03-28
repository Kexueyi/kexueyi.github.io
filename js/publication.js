import { CONFERENCES } from './data/publist.js';
import { AUTHOR_LINKS } from './data/authors.js';

export class Publication {
  static createPublication(data) {
    return `
      <div class="publication">
        <div class="publication-image">
          <img src="${data.image || 'images/publications/placeholder.jpg'}" alt="${data.title}">
        </div>
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
    const primaryLink = links.project || links.paper || '#';
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
  
  //  define icons with captions
  static createLinks({ links, bibtex }) {
    return `
      <div class="paper-links">
        ${links.project ? `<a href="${links.project}" class="paper-link" data-type="project">Project</a>` : ''}
        ${links.code ? `<a href="${links.code}" class="paper-link" data-type="code">Code</a>` : ''}
        ${links.paper ? `<a href="${links.paper}" class="paper-link" data-type="paper">Paper</a>` : ''}
        ${bibtex ? `<button class="paper-link cite-button" data-type="cite" data-bibtex='${bibtex.replace(/'/g, "\\'")}'>Cite</button>` : ''}
      </div>
    `;
  }
  
  static showCitationPopup(bibtex) {
    const popup = document.createElement('div');
    popup.className = 'citation-popup';
    
    // Format the bibtex string to preserve indentation
    const formattedBibtex = bibtex
      .split('\n')
      .map(line => line.trim())  // Remove extra spaces
      .join('\n');  // Rejoin with newlines
    
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
        await navigator.clipboard.writeText(bibtex);
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
      Publication.downloadBibtex(bibtex);
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