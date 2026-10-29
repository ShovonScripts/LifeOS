import { parseQuickAdd } from '../../src/domain/parser';

describe('Quick Add Parser', () => {
  const refDate = new Date('2025-06-01T10:00:00Z');

  test('parses title, priority, and label', () => {
    const result = parseQuickAdd('Finish report !high #work', refDate);
    expect(result.title).toBe('Finish report');
    expect(result.priority).toBe('high');
    expect(result.labels).toEqual(['work']);
  });

  test('parses tomorrow date and time', () => {
    const result = parseQuickAdd('Doctor appointment tomorrow 3pm !med', refDate);
    expect(result.title).toBe('Doctor appointment');
    expect(result.priority).toBe('medium');
    expect(result.dueLocalDate).toBe('2025-06-02');
    expect(result.dueTime).toBe('15:00');
  });

  test('parses today and Bangla keywords', () => {
    const result = parseQuickAdd('রিপোর্ট জমা দিন আজ !urgent #office', refDate);
    expect(result.title).toBe('রিপোর্ট জমা দিন');
    expect(result.priority).toBe('high');
    expect(result.labels).toEqual(['office']);
    expect(result.dueLocalDate).toBe('2025-06-01');
  });

  test('handles plain text without metadata', () => {
    const result = parseQuickAdd('Buy groceries', refDate);
    expect(result.title).toBe('Buy groceries');
    expect(result.priority).toBe('none');
    expect(result.labels).toEqual([]);
    expect(result.dueLocalDate).toBeUndefined();
  });
});
