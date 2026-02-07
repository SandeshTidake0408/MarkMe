/**
 * Components Initialization
 * Loads and makes components available globally
 */

import { Button, createButton } from './Button.js';
import { Card, createCard } from './Card.js';
import { FeatureCard, createFeatureCard } from './FeatureCard.js';

// Make available globally
window.Button = Button;
window.createButton = createButton;
window.Card = Card;
window.createCard = createCard;
window.FeatureCard = FeatureCard;
window.createFeatureCard = createFeatureCard;


