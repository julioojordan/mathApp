import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CWidgetStatsB,
} from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import { useNavigate } from 'react-router-dom'
import services from "../../services";

const Dashboard = () => {
  const navigate = useNavigate()
  const userInfo = {
    name: 'Julio Adyuta',
    currentStreak: 5,
    bestStreak: 12,
    progressPercentage: 65,
  }

  const lessons = [
    { name: 'Basic Math', progress: 80 },
    { name: 'Algebra I', progress: 45 },
    { name: 'Geometry', progress: 60 },
  ]

  return (
    <CContainer fluid>
      <CRow className="mb-4 mt-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Welcome, {userInfo.name}</CCardHeader>
            <CCardBody>
              <CRow className="align-items-center text-center">
                <CCol xs={12} md={4}>
                  <h5>Current Streak</h5>
                  <p className="fs-4 fw-bold text-primary">{userInfo.currentStreak} days</p>
                </CCol>
                <CCol xs={12} md={4}>
                  <h5>Best Streak</h5>
                  <p className="fs-4 fw-bold text-success">{userInfo.bestStreak} days</p>
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
                          data: [userInfo.progressPercentage, 100 - userInfo.progressPercentage],
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
                          text: `${userInfo.progressPercentage}%`,
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {lessons.map((lesson, idx) => {
          const colors = ['info', 'success', 'primary']
          const color = colors[idx % colors.length]

          return (
            <CCol xs={12} sm={6} md={4} lg={4} key={idx} className="mb-4">
              <div onClick={() => navigate('/lessons')} style={{ cursor: 'pointer' }}>
                <CWidgetStatsB
                  className="mb-3"
                  progress={{ color, value: lesson.progress }}
                  text={`Progress: ${lesson.progress}%`}
                  title={lesson.name}
                  value={`${lesson.progress}%`}
                />
              </div>
            </CCol>
          )
        })}
      </CRow>
    </CContainer>
  )
}

export default Dashboard
