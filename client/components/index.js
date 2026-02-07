/**
 * Components Index
 * Export all components from a single entry point
 */

export { Button, createButton } from './Button.js';
export { Card, createCard } from './Card.js';
export { FeatureCard, createFeatureCard } from './FeatureCard.js';

// Also make available globally for vanilla JS
if (typeof window !== 'undefined') {
  import('./Button.js').then(module => {
    window.Button = module.Button;
    window.createButton = module.createButton;
  });

  import('./Card.js').then(module => {
    window.Card = module.Card;
    window.createCard = module.createCard;
  });

  import('./FeatureCard.js').then(module => {
    window.FeatureCard = module.FeatureCard;
    window.createFeatureCard = module.createFeatureCard;
  });
}

