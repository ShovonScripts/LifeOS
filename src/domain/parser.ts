export type ParsedTask = {
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'none';
  labels: string[];
  dueLocalDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
};

/**
 * Parses a natural language quick-add string into structured task attributes.
 * Examples:
 * "Meeting with team tomorrow 3pm !high #work"
 * "Buy milk !med"
 */
export function parseQuickAdd(input: string, referenceDate: Date = new Date()): ParsedTask {
  let text = input.trim();
  let priority: ParsedTask['priority'] = 'none';
  const labels: string[] = [];
  let dueLocalDate: string | undefined;
  let dueTime: string | undefined;

  // 1. Extract Priority: !high, !med, !low, !urgent, !p1, !p2, !p3
  const priorityRegex = /!(high|med|medium|low|urgent|p1|p2|p3)/i;
  const priorityMatch = text.match(priorityRegex);
  if (priorityMatch && priorityMatch[1]) {
    const p = priorityMatch[1].toLowerCase();
    if (p === 'high' || p === 'p1' || p === 'urgent') priority = 'high';
    else if (p === 'med' || p === 'medium' || p === 'p2') priority = 'medium';
    else if (p === 'low' || p === 'p3') priority = 'low';
    text = text.replace(priorityRegex, '').trim();
  }

  // 2. Extract Labels: #tag
  const labelRegex = /#([a-zA-Z0-9_\u0980-\u09FF-]+)/g;
  let labelMatch: RegExpExecArray | null;
  while ((labelMatch = labelRegex.exec(text)) !== null) {
    if (labelMatch[1]) {
      labels.push(labelMatch[1]);
    }
  }
  text = text.replace(labelRegex, '').trim();

  // 3. Extract Date & Time tokens
  const lowerText = text.toLowerCase();

  // Time regex: e.g., 3pm, 3:30pm, 15:00
  const timeRegex = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i;
  const timeMatch = text.match(timeRegex);
  if (timeMatch && timeMatch[1]) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : undefined;

    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;

    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      dueTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      text = text.replace(timeMatch[0], '').trim();
    }
  }

  // Date keywords
  const targetDate = new Date(referenceDate);
  if (/\btomorrow\b/i.test(lowerText) || text.includes('আগামীকাল')) {
    targetDate.setDate(targetDate.getDate() + 1);
    dueLocalDate = formatDateString(targetDate);
    text = text
      .replace(/\btomorrow\b/gi, '')
      .replace('আগামীকাল', '')
      .trim();
  } else if (/\btoday\b/i.test(lowerText) || text.includes('আজ')) {
    dueLocalDate = formatDateString(targetDate);
    text = text
      .replace(/\btoday\b/gi, '')
      .replace('আজ', '')
      .trim();
  } else if (/\bnext week\b/i.test(lowerText)) {
    targetDate.setDate(targetDate.getDate() + 7);
    dueLocalDate = formatDateString(targetDate);
    text = text.replace(/\bnext week\b/gi, '').trim();
  }

  // Clean up extra spaces
  const title = text.replace(/\s+/g, ' ').trim();

  return {
    title: title || input.trim(),
    priority,
    labels,
    dueLocalDate,
    dueTime,
  };
}

function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
