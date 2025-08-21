import React from 'react'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilXCircle } from '@coreui/icons'

const ErrorModal = ({ visible, onClose, navigate }) => {
  return (
    <CModal visible={visible} alignment="center" onClose={onClose}>
      <CModalBody className="text-center">
        <CIcon icon={cilXCircle} size="xxl" className="text-danger mb-4" />
        <p className="fs-4 fw-bold text-danger">Oops, Something Happened</p>
      </CModalBody>
      <CModalFooter className="justify-content-center">
        <CButton color="info" className="px-4" onClick={() => {
          onClose()
          navigate('/dashboard')
        }}>
          Back to Dashboard
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ErrorModal
