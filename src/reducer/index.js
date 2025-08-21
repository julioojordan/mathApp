import { legacy_createStore as createStore, combineReducers } from 'redux'
import uiReducer from './uiReducer'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  ui: uiReducer,
  user: userReducer,
})

const store = createStore(rootReducer)
export default store
