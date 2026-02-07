/**
 * Card Component
 * Reusable card component for displaying content
 */

export class Card {
  constructor(options = {}) {
    this.title = options.title || '';
    this.content = options.content || '';
    this.footer = options.footer || '';
    this.className = options.className || '';
    this.feature = options.feature || false; // Enable feature card styling
    this.icon = options.icon || null; // SVG icon HTML
    this.iconGradient = options.iconGradient || null; // Gradient for icon background
  }

  /**
   * Render card as HTML string
   */
  render() {
    const cardClass = this.feature ? 'feature-card card' : 'card';
    const classes = [cardClass, this.className].filter(Boolean).join(' ');

    let iconHTML = '';
    if (this.icon && this.feature) {
      const iconStyle = this.iconGradient 
        ? `style="background: ${this.iconGradient};"`
        : '';
      iconHTML = `
        <div class="feature-icon" ${iconStyle}>
          ${this.icon}
        </div>
      `;
    }

    return `
      <div class="${classes}">
        ${iconHTML}
        ${this.title ? `<h3>${this.title}</h3>` : ''}
        ${this.content ? `<p>${this.content}</p>` : ''}
        ${this.footer ? `<div class="card-footer">${this.footer}</div>` : ''}
      </div>
    `;
  }

  /**
   * Create and return a DOM element
   */
  createElement() {
    const card = document.createElement('div');
    const cardClass = this.feature ? 'feature-card card' : 'card';
    card.className = [cardClass, this.className].filter(Boolean).join(' ');

    if (this.icon && this.feature) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'feature-icon';
      if (this.iconGradient) {
        iconDiv.style.background = this.iconGradient;
      }
      iconDiv.innerHTML = this.icon;
      card.appendChild(iconDiv);
    }

    if (this.title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = this.title;
      card.appendChild(titleEl);
    }

    if (this.content) {
      const contentEl = document.createElement('p');
      contentEl.innerHTML = this.content;
      card.appendChild(contentEl);
    }

    if (this.footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'card-footer';
      footerEl.innerHTML = this.footer;
      card.appendChild(footerEl);
    }

    return card;
  }
}

/**
 * Helper function to create cards quickly
 */
export function createCard(options) {
  return new Card(options);
}

// Export for use in vanilla JS
if (typeof window !== 'undefined') {
  window.Card = Card;
  window.createCard = createCard;
}

