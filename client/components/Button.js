/**
 * Button Component
 * Reusable button component with variants and sizes
 */

export class Button {
  constructor(options = {}) {
    this.text = options.text || 'Button';
    this.variant = options.variant || 'primary'; // primary, secondary, danger, outline
    this.size = options.size || 'md'; // sm, md, lg
    this.fullWidth = options.fullWidth || false;
    this.onClick = options.onClick || null;
    this.type = options.type || 'button';
    this.href = options.href || null;
    this.className = options.className || '';
  }

  /**
   * Render button as HTML string
   */
  render() {
    const classes = [
      'btn',
      `btn-${this.variant}`,
      this.size !== 'md' ? `btn-${this.size}` : '',
      this.fullWidth ? 'btn-full' : '',
      this.className
    ].filter(Boolean).join(' ');

    const attributes = [
      `class="${classes}"`,
      this.type ? `type="${this.type}"` : '',
      this.onClick ? `onclick="${this.onClick}"` : ''
    ].filter(Boolean).join(' ');

    if (this.href) {
      return `<a href="${this.href}" ${attributes}>${this.text}</a>`;
    }

    return `<button ${attributes}>${this.text}</button>`;
  }

  /**
   * Create and return a DOM element
   */
  createElement() {
    const element = this.href 
      ? document.createElement('a')
      : document.createElement('button');

    element.className = [
      'btn',
      `btn-${this.variant}`,
      this.size !== 'md' ? `btn-${this.size}` : '',
      this.fullWidth ? 'btn-full' : '',
      this.className
    ].filter(Boolean).join(' ');

    element.textContent = this.text;

    if (this.href) {
      element.href = this.href;
    } else {
      element.type = this.type;
    }

    if (this.onClick) {
      element.addEventListener('click', this.onClick);
    }

    return element;
  }
}

/**
 * Helper function to create buttons quickly
 */
export function createButton(options) {
  return new Button(options);
}

// Export for use in vanilla JS
if (typeof window !== 'undefined') {
  window.Button = Button;
  window.createButton = createButton;
}

