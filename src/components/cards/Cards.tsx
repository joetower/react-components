import React from 'react';
import Card from '../card/Card'; // Assuming Card is exported from Card.tsx
import './cards.css'; // Import the SCSS file for styling

interface CardCollectionProps {
  variant?: 'primary' | 'secondary' | 'tertiary'; // Optional prop for card variant
  animation?: boolean; // Optional prop for animation class
  gridCount?: '2' | '3' | '4'; // Optional prop to specify the number of cards in the grid
}

const CardCollection: React.FC<CardCollectionProps> = ({variant, gridCount, animation}) => {
  return (
    <div className="cards" data-grid-count={gridCount || 4}>
      <Card heading="Card 1" animation={animation} text="This is the first card." link="#" variant={variant} imageSrc='https://placehold.co/600x400' imageAlt='Placeholder Image' />
      <Card heading="Card 2" animation={animation} text="This is the second card." link="#" variant={variant} imageSrc='https://placehold.co/600x400' imageAlt='Placeholder Image' />
      <Card heading="Card 3" animation={animation} text="This is the third card." link="#" variant={variant} imageSrc='https://placehold.co/600x400' imageAlt='Placeholder Image' />
      <Card heading="Card 4" animation={animation} text="This is the fourth card." link="#"variant={variant} imageSrc='https://placehold.co/600x400' imageAlt='Placeholder Image' />
    </div>
  );
};

export default CardCollection;
