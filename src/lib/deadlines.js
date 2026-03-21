import { supabase } from './supabaseClient'

// Получить все дедлайны
export async function getDeadlines() {
  try {
    const { data, error } = await supabase
      .from('deadlines')
      .select('*')
      .order('end_date', { ascending: true })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching deadlines:', error)
    return { data: [], error }
  }
}

// Обновить дедлайн
export async function updateDeadline(id, updates) {
  try {
    const { data, error } = await supabase
      .from('deadlines')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error updating deadline:', error)
    return { data: null, error }
  }
}

// Добавить дедлайн
export async function addDeadline(deadline) {
  try {
    const { data, error } = await supabase
      .from('deadlines')
      .insert(deadline)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error adding deadline:', error)
    return { data: null, error }
  }
}

// Удалить дедлайн
export async function deleteDeadline(id) {
  try {
    const { error } = await supabase
      .from('deadlines')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting deadline:', error)
    return { error }
  }
}

// Начальные данные дедлайнов (для первоначального заполнения)
export const INITIAL_DEADLINES = [
  // ИТиП
  { subject: 'ИТиП', lab_number: 2, start_date: '2026-03-23', end_date: '2026-04-06' },
  { subject: 'ИТиП', lab_number: 3, start_date: '2026-04-06', end_date: '2026-04-20' },
  { subject: 'ИТиП', lab_number: 4, start_date: '2026-04-20', end_date: '2026-05-04' },
  { subject: 'ИТиП', lab_number: 5, start_date: '2026-05-04', end_date: '2026-05-18' },
  // СиАОД
  { subject: 'СиАОД', lab_number: 3, start_date: '2026-03-23', end_date: '2026-04-06' },
  { subject: 'СиАОД', lab_number: 4, start_date: '2026-04-06', end_date: '2026-04-20' },
  { subject: 'СиАОД', lab_number: 5, start_date: '2026-04-20', end_date: '2026-05-04' },
  { subject: 'СиАОД', lab_number: 6, start_date: '2026-05-04', end_date: '2026-05-18' },
  { subject: 'СиАОД', lab_number: 7, start_date: '2026-05-18', end_date: '2026-06-01' },
  { subject: 'СиАОД', lab_number: 8, start_date: '2026-06-01', end_date: '2026-06-08' },
  // DevOps
  { subject: 'DevOps', lab_number: 3, start_date: '2026-03-12', end_date: '2026-03-26' },
  { subject: 'DevOps', lab_number: 4, start_date: '2026-03-16', end_date: '2026-03-30' },
  { subject: 'DevOps', lab_number: 5, start_date: '2026-03-26', end_date: '2026-04-09' },
  { subject: 'DevOps', lab_number: 6, start_date: '2026-04-30', end_date: '2026-05-13' },
]
