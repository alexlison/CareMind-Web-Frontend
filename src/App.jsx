import React from 'react' 
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Login.jsx'
import LandingPage from './Components/LandingPage.jsx'
import SignUp from './Components/SignUp.jsx'
import CaregiverHome from './Components/CaregiverHome.jsx'
import PatientManagement from './Components/PatientManagement.jsx'
import AddPatient from './Components/AddPatient.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/caregiverHome' element={<CaregiverHome />} />
        <Route path='/patientManagement' element={<PatientManagement />} />
        <Route path='/addPatient' element={<AddPatient />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App