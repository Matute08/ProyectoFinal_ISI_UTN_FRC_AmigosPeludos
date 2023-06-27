//import logo from './logo.svg';
import React from 'react';
import './App.css';
import '../src/assets/scss/themes.scss';
import Landing from './pages/Landing/Index';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/AutheticationInner/Register/Register';
import Login from "./pages/AutheticationInner/Login/Login"
import { AuthProvider } from './services/AuthContext';
import { ProtectedRoute } from './pages/AutheticationInner/ProtectedRoute';
//perfil
import UserProfileSetting from './pages/Profile/Settings';
import Profile from './pages/Profile/UserProfile';
import PasswordReset from './pages/AutheticationInner/PasswordReset/passwordReset';
//mascotas usuario
import AddPets from './pages/Profile/pet/addPet/AddPets';
import SettingsPet from './pages/Profile/pet/settingsPet/SettingsPet';
//mascota perdida
import LostPets from './pages/petSearch/LostPets';
import AddLostPets from './pages/petSearch/AddLostPets';
import ConsultPosts from './pages/petSearch/ConsultPosts';
import SettingsLostPets from './pages/petSearch/SettingsLostPets';
function App() {
  return (
    <>
      <BrowserRouter>

        <AuthProvider>
          <Routes>

            {/* SI EL COMPONENTE ESTA DENTRO DE PROTECTED ROUTE, NO SE MOSTRARA EL CONTENIDO A MENOS DE QUE ESTE LOGUEADO */}
            <Route path='/' element={<Landing/>}/>
            <Route path="/registrar" element={<Register />}/>
            <Route path="/iniciar-sesion" element={<Login />}/>
            <Route path="/modificar-perfil" element={<ProtectedRoute><UserProfileSetting /></ProtectedRoute>}/>
            <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path="/agregar-mascota" element={<ProtectedRoute><AddPets /></ProtectedRoute>}/>
            <Route path="/modificar-mascota/:mascotaId" element={<ProtectedRoute><SettingsPet /></ProtectedRoute>}/>
            <Route path='/restablecer-contraseña' element={<PasswordReset></PasswordReset>}></Route>
            <Route path='/mascotas-perdidas' element={<LostPets></LostPets>}></Route>
            <Route path='/registrar-mascota-perdida' element={<ProtectedRoute><AddLostPets /></ProtectedRoute>}></Route>
            <Route path="/consultar-posteo/:posteoId" element={<ProtectedRoute><ConsultPosts /></ProtectedRoute>}></Route>
            <Route path="/modificar-posteo/:posteoId" element={<ProtectedRoute><SettingsLostPets /></ProtectedRoute>}></Route>


          </Routes>
        </AuthProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
