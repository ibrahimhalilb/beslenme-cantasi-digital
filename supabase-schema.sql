-- Daily Plans Table
create table daily_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  day_of_week text not null,
  week_start_date date not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- General Notes Table
create table general_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  content text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Reminders Table
create table reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  target_day text not null,
  reminder_time time not null,
  message text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS)
alter table daily_plans enable row level security;
alter table general_notes enable row level security;
alter table reminders enable row level security;

-- Policies for daily_plans
create policy "Users can view their own daily plans"
  on daily_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own daily plans"
  on daily_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own daily plans"
  on daily_plans for update
  using (auth.uid() = user_id);

-- Policies for general_notes
create policy "Users can view their own notes"
  on general_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on general_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on general_notes for delete
  using (auth.uid() = user_id);

-- Policies for reminders
create policy "Users can view their own reminders"
  on reminders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reminders"
  on reminders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reminders"
  on reminders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reminders"
  on reminders for delete
  using (auth.uid() = user_id);

-- Tasks Table (for /tasks page)
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  category text not null,
  priority text not null,
  due_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Notes Table (for /notes page - with colors and rich content)
create table notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  content text,
  color text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS for tasks
alter table tasks enable row level security;

create policy "Users can view their own tasks"
  on tasks for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on tasks for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete using (auth.uid() = user_id);

-- RLS for notes
alter table notes enable row level security;

create policy "Users can view their own notes"
  on notes for select using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on notes for insert with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on notes for update using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on notes for delete using (auth.uid() = user_id);

-- User Profiles Table (for student name and preferences)
create table user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  student_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS for user_profiles
alter table user_profiles enable row level security;

create policy "Users can view their own profile"
  on user_profiles for select using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on user_profiles for insert with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on user_profiles for update using (auth.uid() = user_id);


