import React from 'react';
import Card from '../card/Card'; // Assuming Card is exported from Card.tsx
import cardsData from '../cards/cards-data.json';

interface CardData {
  title: string;
  content: string;
  link: string;
  link_title: string; // Added link_title prop
  link_text: string; // Optional prop for link text which is shown as link text
  image_source: string;
  image_alt: string;
  id: string;
}

interface CardsData {
  cards: CardData[];
}

const cardsDataTyped: CardsData = cardsData;
import './cards.css'; // Import the SCSS file for styling

interface CardCollectionProps {
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; // Optional prop for card theme
  animation?: boolean; // Optional prop for animation class
  gridCount?: '2' | '3' | '4'; // Optional prop to specify the number of cards in the grid
  heading: string;
  text: string;
  cards_link_url?: string; // Changed to string to match the expected type for href
  cards_link_text?: string; // Optional prop for link text which is shown as link text
  cards_link_title?: string; // Added link_title prop for title attribute
}

const CardCollection: React.FC<CardCollectionProps> = ({theme, gridCount, animation, heading, text, cards_link_url, cards_link_title, cards_link_text}) => {
  return (
    <>
      <div className='cards__header' data-component-theme={theme}>
        <div className='cards__header__inner'>
          <div className='cards__heading'>
            <h2>{heading}</h2>
          </div>
          <div className='cards__content'>
            <div className='cards__text'>
              <p>{text}</p>
            </div>
            <a className='cards__link' href={cards_link_url} title={cards_link_title}>
              {cards_link_text}
            </a>
          </div>
        </div>
      </div>
      <div className="cards" data-grid-count={gridCount || 4}>
        <div className='cards__inner'>
          <ul className="cards__list">
            {cardsDataTyped.cards.map((card: CardData) => (
              <li key={card.id}>
                <Card heading={card.title} animation={animation} text={card.content} link={card.link} link_text={card.link_text} link_title={card.link_title} theme={theme} imageSrc={card.image_source} imageAlt={card.image_alt} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};


export default CardCollection;
