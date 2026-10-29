CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`location` text,
	`starts_at` text NOT NULL,
	`ends_at` text NOT NULL,
	`is_all_day` integer DEFAULT false NOT NULL,
	`timezone` text NOT NULL,
	`recurrence_rule` text,
	`series_id` text,
	`color` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_starts` ON `events` (`starts_at`);--> statement-breakpoint
CREATE TABLE `focus_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text,
	`started_at` text NOT NULL,
	`ended_at` text,
	`planned_seconds` integer NOT NULL,
	`actual_seconds` integer,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_focus_started` ON `focus_sessions` (`started_at`);--> statement-breakpoint
CREATE TABLE `goal_milestones` (
	`id` text PRIMARY KEY NOT NULL,
	`goal_id` text NOT NULL,
	`title` text NOT NULL,
	`is_done` integer DEFAULT false NOT NULL,
	`due_date` text,
	`completed_at` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL,
	FOREIGN KEY (`goal_id`) REFERENCES `goals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_goal_milestones_goal` ON `goal_milestones` (`goal_id`) WHERE "goal_milestones"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `goal_tasks` (
	`goal_id` text NOT NULL,
	`task_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`goal_id`, `task_id`),
	FOREIGN KEY (`goal_id`) REFERENCES `goals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text DEFAULT 'numeric' NOT NULL,
	`target_value` real,
	`current_value` real DEFAULT 0 NOT NULL,
	`unit` text,
	`status` text DEFAULT 'active' NOT NULL,
	`start_date` text,
	`target_date` text,
	`completed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `habit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`habit_id` text NOT NULL,
	`local_date` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`note` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL,
	FOREIGN KEY (`habit_id`) REFERENCES `habits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_habit_logs_unique` ON `habit_logs` (`habit_id`,`local_date`);--> statement-breakpoint
CREATE INDEX `idx_habit_logs_date` ON `habit_logs` (`local_date`);--> statement-breakpoint
CREATE TABLE `habits` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text,
	`color` text,
	`schedule_type` text DEFAULT 'daily' NOT NULL,
	`weekdays` text,
	`target_per_week` integer,
	`target_per_day` integer DEFAULT 1 NOT NULL,
	`unit` text,
	`start_date` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `labels` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#7657E8' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task_labels` (
	`task_id` text NOT NULL,
	`label_id` text NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`task_id`, `label_id`),
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`label_id`) REFERENCES `labels`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`is_pinned` integer DEFAULT false NOT NULL,
	`task_id` text,
	`goal_id` text,
	`project_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`goal_id`) REFERENCES `goals`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_notes_pinned` ON `notes` (`is_pinned`) WHERE "notes"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#7657E8' NOT NULL,
	`icon` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`archived_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`trigger_at` text NOT NULL,
	`notification_id` text,
	`channel` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reminders_trigger` ON `reminders` (`trigger_at`);--> statement-breakpoint
CREATE INDEX `idx_reminders_entity` ON `reminders` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `app_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subtasks` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`title` text NOT NULL,
	`is_done` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_subtasks_task` ON `subtasks` (`task_id`) WHERE "subtasks"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text,
	`title` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'todo' NOT NULL,
	`priority` text DEFAULT 'none' NOT NULL,
	`due_at` text,
	`due_local_date` text,
	`is_all_day` integer DEFAULT false NOT NULL,
	`remind_at` text,
	`completed_at` text,
	`recurrence_rule` text,
	`recurrence_timezone` text,
	`series_id` text,
	`source` text DEFAULT 'user' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`rev` integer DEFAULT 0 NOT NULL,
	`device_id` text NOT NULL,
	`sync_status` text DEFAULT 'local' NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_tasks_status` ON `tasks` (`status`) WHERE "tasks"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX `idx_tasks_due` ON `tasks` (`due_at`) WHERE "tasks"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX `idx_tasks_due_local` ON `tasks` (`due_local_date`) WHERE "tasks"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX `idx_tasks_project` ON `tasks` (`project_id`) WHERE "tasks"."deleted_at" is null;--> statement-breakpoint
CREATE INDEX `idx_tasks_series` ON `tasks` (`series_id`);