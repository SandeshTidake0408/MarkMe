/**
 * Feature Card Component
 * Specialized card component for feature displays
 */

import { Card } from './Card.js';

export class FeatureCard extends Card {
  constructor(options = {}) {
    super({
      ...options,
      feature: true
    });
    this.icon = options.icon || '';
    this.iconGradient = options.iconGradient || 'linear-gradient(135deg, var(--primary), var(--primary-light))';
  }

  /**
   * Render feature card with icon
   */
  render() {
    const iconHTML = this.icon ? `
      <div class="feature-icon" style="background: ${this.iconGradient};">
        ${this.icon}
      </div>
    ` : '';

    return `
      <div class="feature-card card ${this.className}">
        ${iconHTML}
        ${this.title ? `<h3 style="margin-bottom: var(--spacing-md); color: var(--primary); font-size: 1.5rem;">${this.title}</h3>` : ''}
        ${this.content ? `<p style="color: var(--text-secondary); line-height: 1.7;">${this.content}</p>` : ''}
      </div>
    `;
  }
}

/**
 * Helper function to create feature cards quickly
 */
export function createFeatureCard(options) {
  return new FeatureCard(options);
}

// Export for use in vanilla JS
if (typeof window !== 'undefined') {
  window.FeatureCard = FeatureCard;
  window.createFeatureCard = createFeatureCard;
}

