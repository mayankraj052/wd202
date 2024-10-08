const { todoList } = require('../todo');

global.today = new Date().toISOString().split('T')[0]; // Defining `today` globally
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
  .toISOString()
  .split('T')[0];
const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
  .toISOString()
  .split('T')[0];

describe('Todo List Test Suite', () => {
  let todos;

  beforeEach(() => {
    todos = todoList();
    todos.add({
      title: 'Submit assignment',
      dueDate: yesterday,
      completed: false,
    });
    todos.add({
      title: 'Pay rent',
      dueDate: today,
      completed: true,
    });
    todos.add({
      title: 'Service Vehicle',
      dueDate: today,
      completed: false,
    });
    todos.add({
      title: 'File taxes',
      dueDate: tomorrow,
      completed: false,
    });
    todos.add({
      title: 'Pay electric bill',
      dueDate: tomorrow,
      completed: false,
    });
  });

  test('Should add new todo', () => {
    expect(todos.all.length).toBe(5);
  });

  test('Should mark a todo as complete', () => {
    todos.markAsComplete(2);
    expect(todos.all[2].completed).toBe(true);
  });

  test('Should return overdue todos', () => {
    const overdueTodos = todos.overdue();
    expect(overdueTodos.length).toBe(1);
    expect(overdueTodos[0].title).toBe('Submit assignment');
  });

  test('Should return todos due today', () => {
    const dueTodayTodos = todos.dueToday();
    expect(dueTodayTodos.length).toBe(2);
  });

  test('Should return todos due later', () => {
    const dueLaterTodos = todos.dueLater();
    expect(dueLaterTodos.length).toBe(2);
  });

  test('Should display todos correctly', () => {
    const formattedList = todos.toDisplayableList(todos.all);
    expect(formattedList).toContain('[x] Pay rent');
    expect(formattedList).toContain('[ ] Service Vehicle');
    expect(formattedList).toContain('[ ] File taxes');
  });
});
