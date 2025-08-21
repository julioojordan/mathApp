import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CWidgetStatsB,
  CSpinner,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import services from '../../services'
import CIcon from '@coreui/icons-react'
import { cilXCircle, cilCheckCircle } from '@coreui/icons'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user_id = useSelector((state) => state.user?.user_id || 1)

  const [userInfo, setUserInfo] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingLessons, setLoadingLessons] = useState(true)
  const [error, setError] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await services.ProfileService.getProfileById(user_id)
        setUserInfo(data)
        setProgress(Math.round(Number(data.progress_percentage)))
        console.log(data)
        dispatch({
          type: 'setUser',
          payload: {
            name: data.name,
            exp: data.exp,
            current_streak: data.current_streak,
            best_streak: data.best_streak,
            user_progress: data.progress_percentage,
          },
        })
      } catch (err) {
        console.error('Error fetching user info:', err)
        setError(true)
      } finally {
        setTimeout(() => {
          setLoadingUser(false)
        }, 1000)
      }
    }

    const fetchLessons = async () => {
      try {
        const data = await services.LessonService.getAllLesson(user_id)
        setLessons(data)
      } catch (err) {
        console.error('Error fetching lessons:', err)
        setError(true)
      } finally {
        setTimeout(() => {
          setLoadingLessons(false)
        }, 500)
      }
    }

    fetchUser()
    fetchLessons()
  }, [user_id])

  if (error) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <CIcon icon={cilXCircle} size="xxl" className="text-danger mb-4" />
        <p className="fs-4 fw-bold text-danger">Fetching data error</p>
      </div>
    )
  }

  return (
    <CContainer fluid>
      <CRow className="mb-4 mt-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Welcome, {userInfo?.name || '...'}</CCardHeader>
            <CCardBody>
              {loadingUser ? (
                <div className="text-center py-4">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CRow className="align-items-center text-center">
                  <CCol xs={12} md={4}>
                    <h5>Current Streak</h5>
                    <p className="fs-4 fw-bold text-primary">{userInfo.current_streak ?? 0}</p>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <h5>Best Streak</h5>
                    <p className="fs-4 fw-bold text-success">{userInfo.best_streak ?? 0}</p>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <h5>Progress</h5>
                    <CChart
                      type="doughnut"
                      data={{
                        labels: ['Completed', 'Remaining'],
                        datasets: [
                          {
                            backgroundColor: ['#2eb85c', '#e55353'],
                            data: [progress, 100 - progress],
                          },
                        ],
                      }}
                      options={{
                        cutout: '70%',
                        plugins: {
                          legend: {
                            display: false,
                            position: 'bottom',
                          },
                          centerText: {
                            display: true,
                            text: `${progress}%`,
                          },
                        },
                        maintainAspectRatio: false,
                      }}
                      plugins={[
                        {
                          id: 'centerText',
                          beforeDraw: function (chart) {
                            const { display, text } = chart.config.options.plugins.centerText
                            if (!display) return

                            const ctx = chart.ctx
                            const width = chart.width
                            const height = chart.height

                            ctx.restore()
                            const fontSize = (height / 114).toFixed(2)
                            ctx.font = `bold ${fontSize}em Arial`
                            ctx.fillStyle = '#4f5d75'
                            ctx.textBaseline = 'middle'

                            const textX = Math.round((width - ctx.measureText(text).width) / 2)
                            const textY = height / 2

                            ctx.fillText(text, textX, textY)
                            ctx.save()
                          },
                        },
                      ]}
                      style={{ height: '150px' }}
                    />
                  </CCol>
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {loadingLessons ? (
        <div className="text-center py-4">
          <CSpinner color="info" />
        </div>
      ) : (
        <CRow>
          {lessons.map((lesson, idx) => {
            const colors = ['info', 'success', 'primary']
            const color = colors[idx % colors.length]
            const progressPercent = Math.round(lesson.lesson_progress * 100)

            return (
              <CCol xs={12} sm={6} md={4} lg={4} key={lesson.id} className="mb-4">
                <div
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <CWidgetStatsB
                    className="mb-1"
                    progress={{ color, value: progressPercent }}
                    text={
                      <>
                        Progress: {progressPercent}%
                        {lesson.completed && (
                          <div className="text-success mt-2 d-flex align-items-center justify-content-center gap-2">
                            <CIcon icon={cilCheckCircle} size="lg" className="me-1" />
                            <small className="fw-semibold">Completed</small>
                          </div>
                        )}
                      </>
                    }
                    title={lesson.title}
                    value={`${progressPercent}%`}
                  />
                </div>
              </CCol>
            )
          })}
        </CRow>
      )}
    </CContainer>
  )
}

export default Dashboard
