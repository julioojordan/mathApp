import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const QuizPage = React.lazy(() => import('./views/pages/QuizPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/lessons', name: 'Quiz Page', element: QuizPage },
]

export default routes
