//import logo from './logo.svg';
import React from 'react';
import './App.css';
import '../src/assets/scss/themes.scss';
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/AutheticationInner/Register/Register';
import Login from "./pages/AutheticationInner/Login/Login"
import { AuthProvider } from './pages/AutheticationInner/authContext';
import { ProtectedRoute } from './pages/AutheticationInner/ProtectedRoute';
import UserProfileSetting from './pages/Profile/Settings';
import Profile from './pages/Profile/Profile';
import PasswordReset from './pages/AutheticationInner/PasswordReset/passwordReset';
function App() {
  return (
    <>
      <BrowserRouter>

        <AuthProvider>
          <Routes>

            <Route path='/' element={<Landing/>}/>
            <Route path="/registrar" element={<Register />}/>
            <Route path="/iniciar-sesion" element={<Login />}/>
            <Route path="/modificar-perfil" element={<UserProfileSetting />}/>
            <Route path="/perfil" element={<Profile />}/>
            <Route path='/restablecer-contraseña' element={<PasswordReset></PasswordReset>}></Route>
            


          </Routes>
        </AuthProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
