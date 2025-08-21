const initialState = {
  user_id: 1,
  name: '',
  exp: 0,
  current_streak: 0,
  best_streak: 0,
  progress: 0,
}

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'setUser':
      return { ...state, ...payload }
    default:
      return state
  }
}

export default userReducer
