import React from 'react' 
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Login.jsx'
import LandingPage from './Components/LandingPage.jsx'
import SignUp from './Components/SignUp.jsx'
import CaregiverHome from './Components/CaregiverHome.jsx'
import PatientManagement from './Components/PatientManagement.jsx'
import AddPatient from './Components/AddPatient.jsx'
import EditPatient from './Components/EditPatient.jsx'
import RoutineManagement from './Components/RoutineManagement.jsx'
import AdminHome from './Components/AdminHome.jsx'

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
        <Route path='/EditPatient/:id' element={<EditPatient />} />
        <Route path='/routineManagement' element={<RoutineManagement />} />
        <Route path='/adminHome' element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App