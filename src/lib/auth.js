import { supabase } from './supabaseClient'

/**
 * Вход пользователя по email и паролю
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<{data: object, error: object}>}
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Ошибка входа:', error.message)
    return { data: null, error }
  }
}

/**
 * Выход пользователя
 * @returns {Promise<{error: object}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) throw error
    
    return { error: null }
  } catch (error) {
    console.error('Ошибка выхода:', error.message)
    return { error }
  }
}

/**
 * Получение текущей сессии
 * @returns {Promise<{session: object, error: object}>}
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    return { session, error: null }
  } catch (error) {
    console.error('Ошибка получения сессии:', error.message)
    return { session: null, error }
  }
}

/**
 * Получение текущего пользователя
 * @returns {Promise<{user: object, error: object}>}
 */
export async function getUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    
    return { user, error: null }
  } catch (error) {
    console.error('Ошибка получения пользователя:', error.message)
    return { user: null, error }
  }
}

/**
 * Подписка на изменения состояния авторизации
 * @param {function} callback - Функция обратного вызова
 * @returns {function} - Функция для отписки
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  
  return () => subscription.unsubscribe()
}

