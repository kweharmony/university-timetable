import { supabase } from './supabaseClient'

/**
 * Получение домашних заданий по дате
 * @param {string} date - Дата в формате YYYY-MM-DD
 * @returns {Promise<{data: array, error: object}>}
 */
export async function getHomeworkByDate(date) {
  try {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .eq('homework_date', date)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Ошибка загрузки ДЗ:', error.message)
    return { data: [], error }
  }
}

/**
 * Получение всех дат с домашними заданиями за месяц
 * @param {number} year - Год
 * @param {number} month - Месяц (1-12)
 * @returns {Promise<{data: array, error: object}>}
 */
export async function getHomeworkDatesForMonth(year, month) {
  try {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`
    
    const { data, error } = await supabase
      .from('homework')
      .select('homework_date')
      .gte('homework_date', startDate)
      .lte('homework_date', endDate)
    
    if (error) throw error
    
    // Извлекаем уникальные даты
    const dates = [...new Set(data?.map(item => item.homework_date) || [])]
    
    return { data: dates, error: null }
  } catch (error) {
    console.error('Ошибка загрузки дат ДЗ:', error.message)
    return { data: [], error }
  }
}

/**
 * Добавление нового домашнего задания
 * @param {object} homework - Данные ДЗ
 * @param {string} homework.subject - Название предмета
 * @param {string} homework.task - Текст задания
 * @param {string} homework.homework_date - Дата в формате YYYY-MM-DD
 * @returns {Promise<{data: object, error: object}>}
 */
export async function addHomework({ subject, task, homework_date }) {
  try {
    const { data, error } = await supabase
      .from('homework')
      .insert([{ subject, task, homework_date }])
      .select()
      .single()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Ошибка добавления ДЗ:', error.message)
    return { data: null, error }
  }
}

/**
 * Обновление домашнего задания
 * @param {string} id - ID домашнего задания
 * @param {object} updates - Обновляемые поля
 * @returns {Promise<{data: object, error: object}>}
 */
export async function updateHomework(id, updates) {
  try {
    const { data, error } = await supabase
      .from('homework')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Ошибка обновления ДЗ:', error.message)
    return { data: null, error }
  }
}

/**
 * Удаление домашнего задания
 * @param {string} id - ID домашнего задания
 * @returns {Promise<{error: object}>}
 */
export async function deleteHomework(id) {
  try {
    const { error } = await supabase
      .from('homework')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return { error: null }
  } catch (error) {
    console.error('Ошибка удаления ДЗ:', error.message)
    return { error }
  }
}

