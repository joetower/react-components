import Checkbox from './Checkbox';

export function Checkboxes() {
  const CHECKBOX_ITEMS = [
      'Item number one',
      'Item number two',
      'Item number three',
      'Item number four',
  ];

  return (
      <>
      <div className='checkbox'>
        <ul className='checkbox__list'>
            {CHECKBOX_ITEMS.map((checkbox: string, index: number) => (
            <li key={index} className='checkbox__item'>
              <Checkbox text={checkbox} />
            </li>
            ))}
        </ul>
      </div>
      </>
  );
}

export default {
  title: 'Components/Forms/Checkboxes',
  component: Checkboxes,
};
