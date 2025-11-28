-- ============================================
-- University Homework Manager - Database Schema
-- ============================================

-- Включаем расширение для генерации UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Таблица: homework
-- Хранит все домашние задания
-- ============================================
CREATE TABLE IF NOT EXISTS homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  task TEXT NOT NULL,
  homework_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Комментарии к полям
COMMENT ON TABLE homework IS 'Таблица домашних заданий';
COMMENT ON COLUMN homework.id IS 'Уникальный идентификатор задания';
COMMENT ON COLUMN homework.subject IS 'Название предмета';
COMMENT ON COLUMN homework.task IS 'Текст/описание задания';
COMMENT ON COLUMN homework.homework_date IS 'Дата сдачи задания';
COMMENT ON COLUMN homework.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN homework.created_by IS 'ID пользователя, создавшего запись';

-- ============================================
-- Индексы
-- ============================================

-- Индекс для быстрого поиска по дате
CREATE INDEX IF NOT EXISTS idx_homework_date ON homework(homework_date);

-- Индекс для поиска по дате создания
CREATE INDEX IF NOT EXISTS idx_homework_created_at ON homework(created_at);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Включаем RLS для таблицы
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики (если есть)
DROP POLICY IF EXISTS "Публичное чтение" ON homework;
DROP POLICY IF EXISTS "Только админ может добавлять" ON homework;
DROP POLICY IF EXISTS "Только админ может удалять" ON homework;
DROP POLICY IF EXISTS "Только админ может редактировать" ON homework;

-- Политика: все могут читать (анонимные и авторизованные)
CREATE POLICY "Публичное чтение" ON homework
FOR SELECT 
TO anon, authenticated
USING (true);

-- Политика: только авторизованные могут добавлять
CREATE POLICY "Только админ может добавлять" ON homework
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Политика: только авторизованные могут удалять
CREATE POLICY "Только админ может удалять" ON homework
FOR DELETE 
TO authenticated
USING (true);

-- Политика: только авторизованные могут редактировать
CREATE POLICY "Только админ может редактировать" ON homework
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- Тестовые данные (опционально)
-- ============================================

-- Раскомментируйте для добавления тестовых данных:

/*
INSERT INTO homework (subject, task, homework_date) VALUES
('Математика', 'Решить задачи 1-15 из раздела "Интегралы"', '2024-12-20'),
('Физика', 'Подготовить лабораторную работу №5', '2024-12-21'),
('Программирование', 'Написать программу сортировки массива', '2024-12-22'),
('История', 'Подготовить доклад о Второй мировой войне', '2024-12-23'),
('Английский язык', 'Выучить 50 новых слов, написать эссе', '2024-12-24');
*/

-- ============================================
-- Полезные запросы
-- ============================================

-- Получить все ДЗ на определённую дату:
-- SELECT * FROM homework WHERE homework_date = '2024-12-20' ORDER BY created_at;

-- Получить все даты с ДЗ за месяц:
-- SELECT DISTINCT homework_date FROM homework 
-- WHERE homework_date >= '2024-12-01' AND homework_date <= '2024-12-31';

-- Получить количество ДЗ по предметам:
-- SELECT subject, COUNT(*) as count FROM homework GROUP BY subject ORDER BY count DESC;

-- Удалить все ДЗ старше месяца:
-- DELETE FROM homework WHERE homework_date < NOW() - INTERVAL '1 month';

