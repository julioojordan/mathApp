import React, { useState, useEffect, useMemo } from 'react'
import { CButton, CCol, CContainer, CFormTextarea, CProgress, CRow, CImage } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import services from '../../services'
import CIcon from '@coreui/icons-react'
import { cilXCircle } from '@coreui/icons'
import { AchievementModal, ErrorModal, FeedbackAlert } from '../../components'

const QuizPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id: lessonIdParam } = useParams()
  const lessonId = Number(lessonIdParam)
  const { user_id, exp, current_streak, best_streak } = useSelector((state) => state.user)

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [textInput, setTextInput] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [checked, setChecked] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [totalCorrect, setTotalCorrect] = useState(0)
  const [expEarned, setExpEarned] = useState(0)
  const [newTotalExp, setNewTotalExp] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [isAlreadySubmit, setIsAlreadySubmit] = useState(false)
  const [progress, setProgress] = useState(0)
  const [attemptId, setAttemptId] = useState('')

  const [checking, setChecking] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState(false)

  useEffect(() => {
    async function fetchLesson() {
      try {
        setLoading(true)
        const data = await services.LessonService.getLessonById(lessonId, user_id)
        setLesson(data)
        const initialAnswers =
          data?.problems?.map((p) => ({
            problem_id: p.id,
            value: '',
          })) || []

        setAnswers(initialAnswers)
      } catch (err) {
        console.log(err)
        if (err.name === 'AbortError') return
        setError(err?.message || 'Failed to load lesson')
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 500)
      }
    }

    fetchLesson()
  }, [lessonId])

  const problems = useMemo(() => lesson?.problems || [], [lesson])
  const currentProblem = problems[currentIndex]
  const progressBar = ((currentIndex + 1) / problems.length) * 100

  const handleOptionSelect = (optionId) => {
    if (checked) return
    const newAnswers = [...answers]
    newAnswers[currentIndex] = {
      problem_id: currentProblem.id,
      option_id: optionId,
    }
    setAnswers(newAnswers)
  }

  const handleTextChange = (e) => {
    if (checked) return
    const val = e.target.value
    setTextInput(val)

    const newAnswers = [...answers]
    newAnswers[currentIndex] = {
      problem_id: currentProblem.id,
      value: val,
    }
    setAnswers(newAnswers)
  }

  const handleCheck = async () => {
    if (!currentProblem) return
    setChecking(true)

    try {
      const currentAnswer = answers[currentIndex]
      const isText = currentProblem.type === 'text'

      const body = {
        user_id,
        problem_id: currentProblem.id,
        ...(isText
          ? { value: String(currentAnswer?.value ?? '').trim() }
          : { option_id: Number(currentAnswer?.option_id) }),
      }
      const resp = await services.LessonService.checkLesson(lessonId, body)

      const correct = !!resp?.is_correct
      setAttemptId(resp.attempt_id)
      setIsCorrect(correct)
      setShowFeedback(true)
      setChecked(true)
    } catch (err) {
      console.error('checkLesson error:', err)
      setActionError(true)
    } finally {
      setChecking(false)
    }
  }

  const handleNext = () => {
    setShowFeedback(false)
    setChecked(false)
    setTextInput('')
    setCurrentIndex((prev) => prev + 1)
  }

  const handleFinalSubmit = async () => {
    setSubmitting(true)
    try {
      const body = {
        attempt_id: attemptId,
        answers: answers,
      }

      const params = {
        exp,
        current_streak,
        best_streak,
        user_id,
      }

      const {
        correct_count,
        earned_exp,
        new_total_xp,
        streak,
        lesson_progress,
        is_already_submit,
      } = await services.LessonService.submit(lessonId, body, params)

      setTotalCorrect(correct_count)
      setExpEarned(earned_exp)
      setNewTotalExp(new_total_xp)
      setCurrentStreak(streak.current)
      setBestStreak(streak.best)
      setProgress(lesson_progress)
      setIsAlreadySubmit(is_already_submit)

      if (!is_already_submit) {
        dispatch({
          type: 'setUser',
          payload: {
            exp: new_total_xp,
            current_streak: streak.current,
            best_streak: streak.best,
          },
        })
      }

      setShowModal(true)
    } catch (e) {
      console.error(e)
      setActionError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || checking) {
    const message = checking ? 'Checking your answer...' : 'Fetching lesson...'

    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <div
          className="spinner-border text-primary mb-4"
          role="status"
          style={{ width: '4rem', height: '4rem' }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="fs-4 fw-bold text-primary">{message}</p>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <div
          className="spinner-border text-success mb-4"
          role="status"
          style={{ width: '4rem', height: '4rem' }}
        >
          <span className="visually-hidden">Submitting...</span>
        </div>
        <p className="fs-4 fw-bold text-success">Submitting your result...</p>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <CIcon icon={cilXCircle} size="xxl" className="text-danger mb-4" />
        <p className="fs-4 fw-bold text-danger">Fetching data error</p>
        <p>{error || 'Lesson not found'}</p>
      </div>
    )
  }

  const displayQuestion = currentProblem?.meta?.text || '—'
  const displayImage = currentProblem?.meta?.image
  const isMultiple = currentProblem?.type === 'multiple'
  const isText = currentProblem?.type === 'text'

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-column position-relative">
      <CContainer className="pt-4 pb-5 flex-grow-1 mb-5">
        <CProgress animated color="info" value={progressBar} className="mb-4" />
        <h4 className="fw-bold text-primary mb-2">{lesson?.title}</h4>
        <h3 className="fw-bold mb-3">{displayQuestion}</h3>

        {displayImage && (
          <div className="mb-3 text-center">
            <CImage
              src={displayImage}
              alt={currentProblem?.meta?.alt || 'question image'}
              fluid
              style={{ maxWidth: '50%', height: '50%', borderRadius: '12px' }}
            />
          </div>
        )}

        {isMultiple ? (
          <CRow>
            {currentProblem?.options?.map((opt) => {
              const isSelected = answers[currentIndex]?.option_id === opt.id
              const disabledStyle = checked
                ? { pointerEvents: 'none', cursor: 'not-allowed', opacity: isSelected ? 1 : 0.8 }
                : { cursor: 'pointer' }
              return (
                <CCol xs={12} sm={6} className="mb-4" key={opt.id}>
                  <div
                    role="button"
                    aria-disabled={checked}
                    onClick={() => handleOptionSelect(opt.id)}
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
                    {opt.label}
                  </div>
                </CCol>
              )
            })}
          </CRow>
        ) : isText ? (
          <CFormTextarea
            rows={5}
            className="mb-3"
            placeholder="Type your answer here..."
            value={textInput}
            onChange={handleTextChange}
            disabled={checked}
            readOnly={checked}
          />
        ) : (
          <div className="text-muted">Unsupported problem type</div>
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
            disabled={
              isMultiple
                ? !answers[currentIndex]
                : isText
                  ? !String(answers[currentIndex] || '').trim() 
                  : true
            }
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

      <AchievementModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        navigate={navigate}
        totalCorrect={totalCorrect}
        problemsLength={problems.length}
        isAlreadySubmit={isAlreadySubmit}
        expEarned={expEarned}
        newTotalExp={newTotalExp}
        currentStreak={currentStreak}
        bestStreak={bestStreak}
      />

      <ErrorModal visible={actionError} onClose={() => setActionError(false)} navigate={navigate} />
    </div>
  )
}

export default QuizPage
