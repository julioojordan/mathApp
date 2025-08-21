import api from './Api'

const getAllLesson = async (user_id) => {
  const url = `/api/lessons?user_id=${user_id}`
  try {
    const response = await api.get(url)
    return Promise.resolve(response.data.response)
  } catch (error) {
    console.error('Error:', error)
    return Promise.reject(error)
  }
}

const getLessonById = async (lesson_id, user_id) => {
  const url = `/api/lesson/${lesson_id}?user_id=${user_id}`
  try {
    const response = await api.get(url)
    console.log(response.data)
    return Promise.resolve(response.data.response)
  } catch (error) {
    console.error('Error:', error)
    return Promise.reject(error)
  }
}

const checkLesson = async (lesson_id, body) => {
  const url = `/api/lesson/${lesson_id}/check`
  try {
    const response = await api.post(url, body)
    console.log(response.data)
    return Promise.resolve(response.data)
  } catch (error) {
    console.error('Error:', error)
    return Promise.reject(error)
  }
}

const submit = async (lesson_id, body, params) => {
  const query = new URLSearchParams(params).toString()
  const url = `/api/lessons/${lesson_id}/submit?${query}`

  try {
    const response = await api.post(url, body)
    console.log(response.data)
    return Promise.resolve(response.data.response)
  } catch (error) {
    console.error('Error:', error)
    return Promise.reject(error)
  }
}

export default {
  getAllLesson,
  getLessonById,
  checkLesson,
  submit,
}
