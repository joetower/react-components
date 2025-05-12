import { useState, useEffect } from 'react';
import Heading from '../text/Heading';
import TextBlock from '../text/TextBlock';
import './where-to.css';

const initialItems = [
  { title: 'Sweden', id: 0, flag: 'https://flagcdn.com/se.svg', alt: 'Flag of Sweden' },
];

const flagApiUrl = 'https://flagcdn.com/en/codes.json';

interface WhereToProps {
  baseClass?: string | 'where-to';
  width?: 'components' | 'inner';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  flag?: string;
  whereToContent?: string;
  whereToHeading?: string;
  children?: React.ReactNode;
}

export default function Places({ whereToContent = "let's go somewhere", whereToHeading = "Where would you like to go?", baseClass = "places", width = "components", theme = "secondary", children }: WhereToProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);
  const [countryCodes, setCountryCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch country codes when the component mounts
    fetch(flagApiUrl)
      .then((response) => response.json())
      .then((data) => setCountryCodes(data))
      .catch((error) => console.error('Error fetching country codes:', error));
  }, []);

  const selectedItem = items.find(item => item.id === selectedId);

  function handleItemChange(id: number, e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    // Reverse lookup: Find the country code by matching the title (value)
    const countryCode = Object.keys(countryCodes).find(
      (key) => countryCodes[key].toLowerCase() === newTitle.toLowerCase()
    );

    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: newTitle,
          flag: countryCode ? `https://flagcdn.com/${countryCode}.svg` : '',
          alt: countryCode ? `Flag of ${newTitle}` : '',
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <div className='places' data-component-width={width} data-component-theme={theme}> 
      <div className={`places__inner ${baseClass || ''}`} >
        <Heading content={whereToHeading} level='h2' baseClass={`places__heading`} />
        <TextBlock baseClass={`places__content`} style='default' width={'full'}>
          <p>{whereToContent}</p>
        </TextBlock>
        <div className='places__input'>
          <label htmlFor={`item-${items[0].id}`} className='places__label'>
            Enter a state or country name:
          </label>
          <input
            type="text"
            className='places__input-field'
            value={items[0].title}
            onChange={(e) => {
              handleItemChange(items[0].id, e);
              setSelectedId(items[0].id); // Automatically set the selected ID when the input changes
            }}
          />
        </div>
        {selectedItem && selectedItem.flag ? (
          <TextBlock baseClass={`places__selected-item`} style='default' width='full'>
            <p>You picked <strong>{selectedItem.title}</strong>.</p>
            <img
              src={selectedItem.flag}
              alt={selectedItem.alt}
              className={`places__flag`}
            />
          </TextBlock>
        ) : (
          <TextBlock baseClass={`places__selected-item`} style='default' width='full'>
            Please enter a state or country name.
          </TextBlock>
        )}
        {children}
      </div>
    </div>
  );
}
