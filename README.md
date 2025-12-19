# Anne Dashboard 🌸

Anneler için çocuksu ve eğlenceli haftalık planlayıcı dashboard'u.

## Özellikler

✨ **7 Günlük Haftalık Görünüm** - Her gün için renkli sticky note tarzı kartlar  
📝 **Notlar** - Genel notlarınızı çizgili defter görünümünde tutun  
⏰ **Hatırlatıcılar** - Günler için otomatik hatırlatıcılar oluşturun  
🔐 **Kullanıcı Girişi** - Her kullanıcı kendi verilerini görür  
💾 **Otomatik Kaydetme** - Notlarınız otomatik olarak kaydedilir

## Kurulum

### 1. Node.js Kurulumu

Eğer Node.js yüklü değilse:
1. [nodejs.org](https://nodejs.org) adresine gidin
2. LTS versiyonunu indirin ve kurun
3. Terminali yeniden başlatın

### 2. Bağımlılıkları Yükleyin

```bash
cd mom-dashboard
npm install
```

### 3. Supabase Yapılandırması

#### Supabase SQL Kodları

Supabase Dashboard'unuzda SQL Editor'e gidin ve şu kodları çalıştırın:

```sql
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
```

#### Environment Variables

1. Supabase Dashboard'da Project Settings > API'ye gidin
2. `.env.local.example` dosyasını `.env.local` olarak kopyalayın
3. Şu değerleri doldurun:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Projeyi Çalıştırın

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## GitHub'a Push

```bash
# Git repository'yi başlat
git init

# Uzak repository'yi ekle (GitHub linkini kullan)
git remote add origin YOUR_GITHUB_REPO_URL

# Dosyaları ekle
git add .

# Commit
git commit -m "Initial commit: Mom Dashboard"

# GitHub'a push
git push -u origin main
```

## Vercel Deployment

1. [vercel.com](https://vercel.com) adresine gidin
2. "Add New Project" tıklayın
3. GitHub repo'nuzu seçin
4. Environment Variables ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy'a tıklayın

## Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Veritabanı**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Custom CSS (No Tailwind)
- **Deployment**: Vercel

## Kullanım

1. **Kayıt Ol**: Email ve şifre ile kayıt olun
2. **Giriş Yap**: Hesabınıza giriş yapın
3. **Not Ekle**: Her gün için notlarınızı yazın (otomatik kaydedilir)
4. **Hatırlatıcı Oluştur**: Belirli günler için hatırlatıcılar ayarlayın
5. **Genel Notlar**: Çizgili deftere genel notlarınızı ekleyin

Keyifli kullanımlar! 💖
