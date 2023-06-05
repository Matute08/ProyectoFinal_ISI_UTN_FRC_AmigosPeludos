//import logo from './logo.svg';
import React from 'react';
import './App.css';
import '../src/assets/scss/themes.scss';
import Landing from './pages/landing/Index';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/autheticationInner/Register/Register';
import Login from "./pages/autheticationInner/Login/Login"
import { AuthProvider } from './services/AuthContext';
import { ProtectedRoute } from './pages/autheticationInner/ProtectedRoute';
import UserProfileSetting from './pages/profile/Settings';
import Profile from './pages/profile/UserProfile';
import PasswordReset from './pages/autheticationInner/PasswordReset/PasswordReset';
function App() {
  return (
    <>
      <BrowserRouter>

        <AuthProvider>
          <Routes>

            <Route path='/' element={<Landing/>}/>
            <Route path="/registrar" element={<Register />}/>
            <Route path="/iniciar-sesion" element={<Login />}/>
            <Route path="/modificar-perfil" element={<ProtectedRoute><UserProfileSetting /></ProtectedRoute>}/>
            <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path="/crear-mascota" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path='/restablecer-contraseña' element={<PasswordReset></PasswordReset>}></Route>
            


          </Routes>
        </AuthProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
