import React from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton
} from '@coreui/react'

const AchievementModal = ({
  visible,
  onClose,
  navigate,
  totalCorrect,
  problemsLength,
  expEarned,
  newTotalExp,
  currentStreak,
  bestStreak
}) => {
  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>🎉 Achievement Unlocked</CModalHeader>
      <CModalBody className="text-center">
        <p className="fs-5">
          Correct Answers: <strong>{totalCorrect}</strong> / {problemsLength}
        </p>
        <p className="fs-5">
          EXP Earned: <strong>{expEarned}</strong>
        </p>
        {newTotalExp > 0 && (
          <p className="fs-5">
            New Total EXP: <strong>{newTotalExp}</strong>
          </p>
        )}
        <p className="fs-5">
          Streak: <strong>{currentStreak}</strong> / Best: <strong>{bestStreak}</strong>
        </p>
      </CModalBody>
      <CModalFooter className="justify-content-center">
        <CButton color="primary" onClick={() => {
          onClose()
          navigate('/dashboard')
        }}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AchievementModal
