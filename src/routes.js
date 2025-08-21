import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const QuizPage = React.lazy(() => import('./views/pages/QuizPage'))
const testQuizPage = React.lazy(() => import('./views/pages/testQuizPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/lessons/:id', name: 'Quiz Page', element: QuizPage },
  { path: '/lessonsTest', name: 'Quiz Page', element: testQuizPage },
]

export default routes
