# 📚 University Homework Manager

Веб-приложение для управления домашними заданиями университетской группы.

## 🚀 Возможности

- 📅 Удобный календарь с выбором года, месяца и дня
- 📝 Просмотр домашних заданий для студентов
- ⏰ Дедлайны лабораторных работ с обратным отсчётом и прогресс-барами
- ⚠️ Предупреждения о скорых дедлайнах (≤5 дней)
- 🔐 Панель администратора для управления заданиями и дедлайнами
- 🌓 Светлая и тёмная темы
- 📱 Адаптивный дизайн (Desktop, Tablet, Mobile)
- ⚡ Быстрая загрузка и плавные анимации

## 🛠 Технологии

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 (HashRouter)
- **Backend**: Supabase (Auth + PostgreSQL)
- **Icons**: Material Icons
- **Deploy**: GitHub Pages

## 📦 Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/university-timetable.git
cd university-timetable
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Скопируйте `Project URL` и `anon public` ключ
3. Создайте файл `.env.local`:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Создание таблицы в Supabase

Выполните следующий SQL в SQL Editor вашего проекта Supabase:

```sql
-- Включаем расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создаём таблицу домашних заданий
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  task TEXT NOT NULL,
  homework_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Создаём индекс для быстрого поиска по дате
CREATE INDEX idx_homework_date ON homework(homework_date);

-- Включаем Row Level Security
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Политика: все могут читать
CREATE POLICY "Публичное чтение" ON homework
FOR SELECT TO anon, authenticated
USING (true);

-- Политика: только авторизованные могут добавлять
CREATE POLICY "Только админ может добавлять" ON homework
FOR INSERT TO authenticated
WITH CHECK (true);

-- Политика: только авторизованные могут удалять
CREATE POLICY "Только админ может удалять" ON homework
FOR DELETE TO authenticated
USING (true);

-- Политика: только авторизованные могут редактировать
CREATE POLICY "Только админ может редактировать" ON homework
FOR UPDATE TO authenticated
USING (true);

-- Создаём таблицу дедлайнов
CREATE TABLE deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  lab_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deadlines_end_date ON deadlines(end_date);

ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Публичное чтение дедлайнов" ON deadlines
FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Только админ может добавлять дедлайны" ON deadlines
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Только админ может удалять дедлайны" ON deadlines
FOR DELETE TO authenticated USING (true);

CREATE POLICY "Только админ может редактировать дедлайны" ON deadlines
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

### 5. Создание администратора

В Supabase Dashboard:
1. Перейдите в `Authentication` → `Users`
2. Нажмите `Add user` → `Create new user`
3. Введите email и пароль для администратора

## 🖥 Запуск

### Режим разработки

```bash
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173)

### Сборка

```bash
npm run build
```

### Предпросмотр сборки

```bash
npm run preview
```

## 🌐 Деплой на GitHub Pages

### 1. Настройка репозитория

Убедитесь, что в `vite.config.js` указано правильное имя репозитория:

```js
export default {
  base: '/university-timetable/',
  // ...
}
```

### 2. Добавление секретов

В настройках репозитория (Settings → Secrets → Actions) добавьте:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Деплой

```bash
npm run deploy
```

Или настройте GitHub Actions для автоматического деплоя.

## 📁 Структура проекта

```
src/
├── components/
│   ├── Calendar.jsx           # Компонент календаря
│   ├── HomeworkCard.jsx       # Карточка домашнего задания
│   ├── HomeworkList.jsx       # Список домашних заданий
│   ├── AddHomeworkModal.jsx   # Модальное окно добавления
│   ├── ThemeToggle.jsx        # Переключатель темы
│   ├── YearMonthSelector.jsx  # Селектор года/месяца
│   ├── LoginForm.jsx          # Форма входа
│   └── Toast.jsx              # Уведомления
├── pages/
│   ├── HomePage.jsx           # Публичная страница
│   ├── AdminPage.jsx          # Панель администратора
│   ├── DeadlinesPage.jsx      # Страница дедлайнов
│   └── AdminDeadlinesPage.jsx # Управление дедлайнами
├── lib/
│   ├── supabaseClient.js      # Клиент Supabase
│   ├── auth.js                # Функции авторизации
│   ├── homework.js            # CRUD операции с ДЗ
│   └── deadlines.js           # CRUD операции с дедлайнами
├── contexts/
│   └── ThemeContext.jsx       # Контекст темы
├── App.jsx                    # Главный компонент
├── main.jsx                   # Точка входа
└── index.css                  # Стили Tailwind
```

## 🔗 API Supabase

### Получение ДЗ по дате

```javascript
import { getHomeworkByDate } from './lib/homework'

const { data, error } = await getHomeworkByDate('2024-12-25')
```

### Добавление ДЗ

```javascript
import { addHomework } from './lib/homework'

const { data, error } = await addHomework({
  subject: 'Математика',
  task: 'Решить задачи 1-10 на стр. 42',
  homework_date: '2024-12-25'
})
```

### Обновление ДЗ

```javascript
import { updateHomework } from './lib/homework'

const { data, error } = await updateHomework('uuid-id', {
  subject: 'Физика',
  task: 'Новое описание'
})
```

### Удаление ДЗ

```javascript
import { deleteHomework } from './lib/homework'

const { error } = await deleteHomework('uuid-id')
```

## 🎨 Цветовая палитра

| Название | Светлая тема | Тёмная тема |
|----------|-------------|-------------|
| Background | `#F3F1FF` | `#0F0A2A` |
| Surface | `#FFFFFF` | `#1A1042` |
| Accent | `#6D59E8` | `#6D59E8` |
| Text Primary | `#1A0C5A` | `#FFFFFF` |
| Text Secondary | `#6B7280` | `#9CA3AF` |

## 📝 Лицензия

MIT

## 👤 Автор

Создано с ❤️ для университетской группы
