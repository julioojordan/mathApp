const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const uiReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'setUI':
      return { ...state, ...payload }
    default:
      return state
  }
}

export default uiReducer
