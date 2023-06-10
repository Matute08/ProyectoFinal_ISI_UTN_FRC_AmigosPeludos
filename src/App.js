//import logo from './logo.svg';
import React from 'react';
import './App.css';
import '../src/assets/scss/themes.scss';
import Landing from './pages/landing/Index';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/autheticationInner/register/Register';
import Login from "./pages/autheticationInner/login/Login"
import { AuthProvider } from './services/AuthContext';
import { ProtectedRoute } from './pages/autheticationInner/ProtectedRoute';
import UserProfileSetting from './pages/profile/Settings';
import Profile from './pages/profile/UserProfile';
import PasswordReset from './pages/autheticationInner/passwordReset/PasswordReset';
import AddPets from './pages/profile/pet/addPet/AddPets';
import SettingsPet from './pages/profile/pet/settingsPet/SettingsPet';
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
            <Route path="/agregar-mascota" element={<ProtectedRoute><AddPets /></ProtectedRoute>}/>
            <Route path="/modificar-mascota/:mascotaId" element={<ProtectedRoute><SettingsPet /></ProtectedRoute>}/>
            <Route path='/restablecer-contraseña' element={<PasswordReset></PasswordReset>}></Route>
            


          </Routes>
        </AuthProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
