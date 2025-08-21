import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CFormTextarea,
  CProgress,
  CRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import FeedbackAlert from '../../components/alerts/FeedbackAlert'
import { useNavigate } from 'react-router-dom'

const QuizPage = () => {
  const navigate = useNavigate()
  const problems = [
    {
      type: 'multiple_choice',
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      answer: 'Paris',
    },
    {
      type: 'text',
      question: 'Translate to English: "Selamat pagi"',
      answer: 'Good morning',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [textInput, setTextInput] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [resultSummary, setResultSummary] = useState({
    totalCorrect: 0,
    expEarned: 0,
    newTotalExp: 0,
    currentStreak: 0,
    bestStreak: 0,
  })

  const currentProblem = problems[currentIndex]
  const progress = ((currentIndex + 1) / problems.length) * 100

  const handleOptionSelect = (option) => {
    if (checked) return
    const newAnswers = [...answers]
    newAnswers[currentIndex] = option
    setAnswers(newAnswers)
  }

  const handleTextChange = (e) => {
    if (checked) return
    setTextInput(e.target.value)
    const newAnswers = [...answers]
    newAnswers[currentIndex] = e.target.value
    setAnswers(newAnswers)
  }

  const handleCheck = () => {
    const userAnswer = answers[currentIndex]
    const correctAnswer = currentProblem.answer
    const correct = userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

    setIsCorrect(correct)
    setShowFeedback(true)
    setChecked(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    setChecked(false)
    setTextInput('')
    setCurrentIndex((prev) => prev + 1)
  }

  const handleFinalSubmit = () => {
    const totalCorrect = problems.filter((p, i) => {
      const userAnswer = answers[i]
      return userAnswer?.toLowerCase().trim() === p.answer.toLowerCase().trim()
    }).length

    const expEarned = totalCorrect * 10 // dummy logic
    const newTotalExp = 100 + expEarned // dummy total

    setResultSummary({
      totalCorrect,
      expEarned,
      newTotalExp,
      currentStreak: 5,
      bestStreak: 12,
    })

    setShowModal(true)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column position-relative">
      <CContainer className="pt-4 pb-5 flex-grow-1">
        <CProgress animated color="info" value={progress} className="mb-4" />
        <h3 className="fw-bold text-primary mb-5">{currentProblem.question}</h3>

        {currentProblem.type === 'multiple_choice' ? (
          <CRow>
            {currentProblem.options.map((opt, i) => {
              const isSelected = answers[currentIndex] === opt
              const disabledStyle = checked
                ? { pointerEvents: 'none', cursor: 'not-allowed', opacity: isSelected ? 1 : 0.8 }
                : { cursor: 'pointer' }
              return (
                <CCol xs={12} sm={6} className="mb-4" key={i}>
                  <div
                    role="button"
                    aria-disabled={checked}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-4 border rounded shadow-sm text-center fw-semibold option-box ${
                      isSelected ? 'border-3 border-success bg-success text-white' : 'border-3'
                    }`}
                    style={{
                      height: '100px',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: '0.3s',
                      ...disabledStyle,
                    }}
                    onMouseEnter={(e) => !checked && e.currentTarget.classList.add('shadow')}
                    onMouseLeave={(e) => !checked && e.currentTarget.classList.remove('shadow')}
                  >
                    {opt}
                  </div>
                </CCol>
              )
            })}
          </CRow>
        ) : (
          <CFormTextarea
            rows={5}
            className="mb-3"
            placeholder="Type your answer here..."
            value={textInput}
            onChange={handleTextChange}
            disabled={checked}
            readOnly={checked}
          />
        )}
      </CContainer>

      <div className="position-fixed w-100 px-4" style={{ bottom: '110px' }}>
        <FeedbackAlert visible={showFeedback} isCorrect={isCorrect} />
      </div>

      <div className="bg-body border-top py-3 px-4 position-fixed bottom-0 w-100 text-center shadow-md">
        {!checked ? (
          <CButton
            color="info"
            onClick={handleCheck}
            className="px-5 py-2 fs-4 w-50"
            disabled={!answers[currentIndex]}
          >
            Check
          </CButton>
        ) : currentIndex < problems.length - 1 ? (
          <CButton color="primary" onClick={handleNext} className="px-5 py-2 fs-4 w-50">
            Continue
          </CButton>
        ) : (
          <CButton color="success" onClick={handleFinalSubmit} className="px-5 py-2 fs-4 w-50">
            Submit
          </CButton>
        )}
      </div>

      {/* Achievement Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} alignment="center">
        <CModalHeader>🎉 Achievement Unlocked</CModalHeader>
        <CModalBody className="text-center">
          <p className="fs-5">
            Correct Answers: <strong>{resultSummary.totalCorrect}</strong>
          </p>
          <p className="fs-5">
            EXP Earned: <strong>{resultSummary.expEarned}</strong>
          </p>
          <p className="fs-5">
            New Total EXP: <strong>{resultSummary.newTotalExp}</strong>
          </p>
          <p className="fs-5">
            Streak: <strong>{resultSummary.currentStreak}</strong> / Best:{' '}
            <strong>{resultSummary.bestStreak}</strong>
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              setShowModal(false)
              navigate('/dashboard')
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default QuizPage
