import React from 'react';
import Card from '../card/Card'; // Assuming Card is exported from Card.tsx
import cardsData from '../cards/cards-data.json';

interface CardData {
  title: string;
  content: string;
  link: string;
  link_title: string; // Added link_title prop
  image_source: string;
  image_alt: string;
}

interface CardsData {
  cards: CardData[];
}

const cardsDataTyped: CardsData = cardsData;
import './cards.css'; // Import the SCSS file for styling

interface CardCollectionProps {
  variant?: 'primary' | 'secondary' | 'tertiary'; // Optional prop for card variant
  animation?: boolean; // Optional prop for animation class
  gridCount?: '2' | '3' | '4'; // Optional prop to specify the number of cards in the grid
  heading: string;
  text: string;
  link: React.ReactNode; // Changed to React.ReactNode to allow for any type of link
  link_title: string; // Added link_title prop
}

const CardCollection: React.FC<CardCollectionProps> = ({variant, gridCount, animation, heading, text, link, link_title}) => {
  return (
    <>
      <div className='cards__heading'>
        <h2>{heading}</h2>
      </div>
      <div className='cards__content'>
        <div className='cards__text'>
          <p>{text}</p>
        </div>
        <div className='cards__link'>
          {link}
        </div>
      </div>
      <div className="cards" data-grid-count={gridCount || 4}>
        {cardsDataTyped.cards.map((card: CardData) => (
          <Card heading={card.title} animation={animation} text={card.content} link={card.link} link_title={card.link_title} variant={variant} imageSrc={card.image_source} imageAlt={card.image_alt} />
        ))}
      </div>
    </>
  );
};


export default CardCollection;
