import Todo from './ToDo';

export function ToDo() {
  const DUMMY_TODOS = [
      'Learn React',
      'Practice React',
      'Profit!'
  ];

  return (
      <>
      <div className='todo'>
        <ul className='todo__list'>
            {DUMMY_TODOS.map((todo: string, index: number) => (
            <li key={index} className='todo__item'>
              <Todo text={todo} />
            </li>
            ))}
        </ul>
      </div>
      </>
  );
}

export default {
  title: 'Components/Z-In-Progress/ToDo',
  component: ToDo,
};
