import React from 'react'
import { CAlert } from '@coreui/react'

const successMessages = [
  'Great job! Keep up the good work 🚀',
  "Awesome! You're on the right track 💯",
  'Excellent, keep going strong! 🔥',
]

const errorMessages = [
  "Don't give up, try again! 💪",
  "Stay motivated, one mistake isn't the end 🌱",
  "It's okay to be wrong, learn and move forward 😉",
]

const FeedbackAlert = ({ visible, isCorrect }) => {
  if (!visible) return null

  const messages = isCorrect ? successMessages : errorMessages
  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  return (
    <CAlert color={isCorrect ? 'success' : 'danger'} className="text-center w-100 mb-0">
      {randomMessage}
    </CAlert>
  )
}

export default FeedbackAlert
