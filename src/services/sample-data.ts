import { ProjectService } from '@/features/projects/service';
import { TaskService } from '@/features/tasks/service';
import { HabitService } from '@/features/habits/service';
import { NoteService } from '@/features/notes/service';

export function seedSampleData(): void {
  try {
    const todayStr = new Date().toISOString().split('T')[0] ?? '2025-06-01';

    // 1. Create Sample Project
    const project = ProjectService.create({ name: 'Getting Started' });

    // 2. Create Sample Tasks
    TaskService.create({
      title: "Try Quick Add by typing 'Call Rahim tomorrow !high'",
      projectId: project.id,
      priority: 'high',
      dueLocalDate: todayStr,
      status: 'todo',
    });

    TaskService.create({
      title: 'Explore the Focus timer for deep work sessions',
      projectId: project.id,
      priority: 'medium',
      dueLocalDate: todayStr,
      status: 'todo',
    });

    // 3. Create Sample Habit
    HabitService.create({
      name: 'Daily Morning Reflection',
      scheduleType: 'daily',
      startDate: todayStr,
    });

    // 4. Create Sample Note
    NoteService.create({
      title: 'Welcome to LifeOS',
      body: 'LifeOS is your calm, local-first personal productivity system.\n\nKey Highlights:\n- 100% Offline & Private\n- Instant Quick Add\n- Integrated Tasks, Calendar, Habits & Notes',
      isPinned: true,
    });
  } catch {
    // ignore if already seeded or error occurs
  }
}
