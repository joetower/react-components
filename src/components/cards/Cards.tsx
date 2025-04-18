import React from 'react';
import Card from '../card/Card'; // Assuming Card is exported from Card.tsx
import Heading from '../text/Heading';
import Paragraph from '../text/TextBlock';
import cardsData from '../cards/cards-data.json';

interface CardData {
  title: string;
  content: string;
  link: string;
  linkTitle: string; // Added linkTitle prop
  linkText: string; // Optional prop for link text which is shown as link text
  imageSource: string;
  imageAlt: string;
  id: string;
}

interface CardsData {
  cards: CardData[];
}

const cardsDataTyped: CardsData = cardsData;
import './cards.css'; // Import the SCSS file for styling
import { useEffect } from 'react';

interface CardCollectionProps {
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary'; // Optional prop for card theme
  animation?: boolean; // Optional prop for animation class
  gridCount?: '2' | '3' | '4'; // Optional prop to specify the number of cards in the grid
  heading: string;
  text: string;
  cardsLinkUrl?: string; // Changed to string to match the expected type for href
  cardsLinkText?: string; // Optional prop for link text which is shown as link text
  cardsLinkTitle?: string; // Added linkTitle prop for title attribute
  width?: 'content' | 'full';
}

const CardCollection: React.FC<CardCollectionProps> = ({theme, gridCount, animation, heading, text, cardsLinkUrl, cardsLinkTitle, cardsLinkText, width = 'content'}) => {
  useEffect(() => {
    const listItems = document.querySelectorAll('.cards__list li');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.classList.contains('animate')) {
            setTimeout(() => {
              entry.target.classList.add('fade-in-up');
            }, 100 * (entries.indexOf(entry) + 1));
          }
        });
      },
      { threshold: 0.4 } // Adjust threshold as needed
    );

    listItems.forEach((item) => observer.observe(item));

    return () => {
      listItems.forEach((item) => observer.unobserve(item));
    };
  }, [animation]);

  return (
    <>
      <div className='cards__header' data-component-theme={theme} data-component-width={width}>
        <div className='cards__header__inner'>
          <div className='cards__heading'>
            <Heading level='h2' baseClass='cards__heading__title' content={heading} />
          </div>
          <div className='cards__content'>
            <div className='cards__text'>
              <Paragraph style="default" baseClass='cards__paragraph'>
                {text}
              </Paragraph>
            </div>
            <a className='cards__link' href={cardsLinkUrl} title={cardsLinkTitle}>
              {cardsLinkText}
            </a>
          </div>
        </div>
      </div>
      <div className="cards" data-grid-count={gridCount || 4} data-component-width={width}>
        <div className='cards__inner'>
          <ul className="cards__list">
            {cardsDataTyped.cards.map((card: CardData) => (
              <li key={card.id} className={animation ? 'cards__list__item animate' : 'cards__list__item'}>
                <Card heading={card.title} animation={animation} text={card.content} link={card.link} linkText={card.linkText} linkTitle={card.linkTitle} theme={theme} imageSrc={card.imageSource} imageAlt={card.imageAlt} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};


export default CardCollection;
