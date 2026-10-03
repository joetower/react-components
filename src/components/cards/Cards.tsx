import { useEffect } from 'react';
import Card from '../card/Card';
import Heading from '../text/Heading';
import TextBlock from '../text/TextBlock';
import cardsData from '../cards/cards-data.json';
import './cards.css';
interface CardData {
  title: string;
  content: string;
  link: string;
  imageName: string;
  linkTitle: string;
  linkText: string;
  imageSource: string;
  imageAlt: string;
  id: string;
  showButton: boolean;
}

interface CardsData {
  cards: CardData[];
}

const cardsDataTyped: CardsData = {
  cards: cardsData.cards.map(card => ({
    ...card,
    showButton: card.showButton ?? false,
  })),
};

interface CardCollectionProps {
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  animation?: boolean;
  gridCount?: '2' | '3' | '4';
  heading: string;
  cardsHeadingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  cardHeadingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
  cardsLinkUrl?: string;
  cardsLinkText?: string;
  cardsLinkTitle?: string;
  width?: 'content' | 'full';
  showButtons?: boolean;
}

const CardCollection: React.FC<CardCollectionProps> = ({theme, gridCount, animation, heading, cardsHeadingLevel = 'h2', cardHeadingLevel = 'h3', text, cardsLinkUrl, cardsLinkTitle, cardsLinkText, width = 'content', showButtons}) => {
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
      { threshold: 0.4 }
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
            <Heading level={cardsHeadingLevel} baseClass='cards__heading__title' content={heading} />
          </div>
          <div className='cards__content'>
            <div className='cards__text'>
              <TextBlock style="default" baseClass='cards__paragraph'>
                <p>{text}</p>
              </TextBlock>
            </div>
            <a className='cards__link' href={cardsLinkUrl} title={cardsLinkTitle}>
              {cardsLinkText}
            </a>
          </div>
        </div>
      </div>
      <div className="cards" data-grid-count={gridCount || 4} data-component-width={width} data-component-card-show-buttons={showButtons}>
        <div className='cards__inner'>
          <ul className="cards__list">
            {cardsDataTyped.cards.map((card: CardData) => (
              <li key={card.id} className={animation ? 'cards__list__item animate' : 'cards__list__item'}>
                <Card heading={card.title} headingLevel={cardHeadingLevel} imageName={card.imageName} animation={animation} text={card.content} link={card.link} linkText={card.linkText} linkTitle={card.linkTitle} theme={theme} imageSrc={card.imageSource} imageAlt={card.imageAlt} showButton={showButtons}/>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CardCollection;
