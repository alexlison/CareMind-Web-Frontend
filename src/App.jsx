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
import AddRoutine from './Components/AddRoutine.jsx'
import AddMedicine from './Components/AddMedicine.jsx'
import UpdateRoutine from './Components/UpdateRoutine.jsx'
import UpdateMedicine from './Components/UpdateMedicine.jsx'
import AddRelation from './Components/AddRelation.jsx'
import EditRelation from './Components/EditRelation.jsx'
import RelationManagement from './Components/RelationManagement.jsx'
import NotificationManagement from './Components/NotificationManagement.jsx'
import MonitoringManagement from './Components/MonitoringManagement.jsx'
import CaregiverDashboard from './Components/CaregiverDashboard.jsx'
import EditCaregiver from './Components/EditCaregiver.jsx'
import AdminDashboard from './Components/AdminDashboard.jsx'
import AdminViewAllCaregivers from './Components/AdminViewallCaregivers.jsx'
import AdminViewAllPatients from './Components/AdminViewallPatients.jsx'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        {/* Caregiver Routes */}
        <Route path='/caregiverHome' element={<CaregiverHome />} />
        <Route path='/caregiverDashboard' element={<CaregiverDashboard />} />
        <Route path='/editCaregiver' element={<EditCaregiver />} />
        <Route path='/patientManagement' element={<PatientManagement />} />
        <Route path='/addPatient' element={<AddPatient />} />
        <Route path='/EditPatient/:id' element={<EditPatient />} />
        <Route path='/routineManagement' element={<RoutineManagement />} />
        <Route path='/addRoutine' element={<AddRoutine />} />
        <Route path='/editRoutine/:id' element={<UpdateRoutine />} />
        <Route path='/addMedicine' element={<AddMedicine />} />
        <Route path='/editMedicine/:id' element={<UpdateMedicine />} />
        <Route path='/relationManagment' element={<RelationManagement />} />
        <Route path='/addRelation' element={<AddRelation />} />
        <Route path='/editRelation/:id' element={<EditRelation />} />
        <Route path='/monitoring' element={<MonitoringManagement />} />
        <Route path="/notifications" element={<NotificationManagement />} />
        {/* Admin Routes */}
        <Route path='/adminHome' element={<AdminHome />} />
        <Route path='/adminDashboard' element={<AdminDashboard />} />
        <Route path='/admin/caregiversAll' element={<AdminViewAllCaregivers />} />
        <Route path='/admin/patientsAll' element={<AdminViewAllPatients />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App