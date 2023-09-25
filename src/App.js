import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import '../src/assets/scss/themes.scss';
import { AuthProvider } from './services/AuthContext';
import { ProtectedRoute } from './pages/autheticationInner/ProtectedRoute';

// Importa tus componentes aquí

import Landing from './pages/landing/Index';
import Register from './pages/autheticationInner/register/Register';
import Login from "./pages/autheticationInner/login/Login";
import UserProfileSetting from './pages/profile/Settings';
import Profile from './pages/profile/UserProfile';
import PasswordReset from './pages/autheticationInner/passwordReset/PasswordReset';
import AddPets from './pages/profile/pet/addPet/AddPets';
import SettingsPet from './pages/profile/pet/settingsPet/SettingsPet';
import LostPets from './pages/petSearch/lostPets/LostPets';
import AddLostPets from './pages/petSearch/lostPets/AddLostPets';
import ConsultPosts from './pages/petSearch/ConsultPosts';
import SettingsLostPets from './pages/petSearch/SettingsLostPets';
import FoundPets from './pages/petSearch/foundPets/FoundPets';
import AddFoundPets from './pages/petSearch/foundPets/AddFoundPets';
import AdoptPets from './pages/petSearch/adoptPets/AdoptPets';
import AddAdoptPets from './pages/petSearch/adoptPets/AddAdoptPets';
import ConsultAdoptPets from './pages/petSearch/adoptPets/ConsultAdoptPets';
import SettingsAdoptPets from './pages/petSearch/adoptPets/SettingsAdoptPets';
import Questions from './pages/frequentQuestions/Questions';
import GenerateQr from './pages/profile/qr/GenerateQr';
import ConsultAdoptForm from './pages/requests/ConsultAdoptForm';
import Paseadores from './pages/paseadores/Paseadores';
import AddPaseador from './pages/paseadores/AddPaseador';
import PublicProfilePaseador from './pages/publicProfile/publicProfilePaseador/PublicProfilePaseador';
import Veterinarias from './pages/veterinarias/Veterinarias';
import Cuidadores from './pages/cuidadores/Cuidadores';
import AddCuidador from './pages/cuidadores/AddCuidador';
import UserManual from './pages/userManual/UserManual';
import AddVeterinaria from './pages/veterinarias/registrarVeterinaria/AddVeterinaria';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Landing />} />

          {/* Autenticación */}
          <Route path="/registrar" element={<Register />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/modificar-perfil" element={<ProtectedRoute><UserProfileSetting /></ProtectedRoute>} />
          <Route path="/perfil/:mail" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/restablecer-contraseña' element={<PasswordReset />} />

          {/* Mascotas */}
          <Route path="/agregar-mascota" element={<ProtectedRoute><AddPets /></ProtectedRoute>} />
          <Route path="/modificar-mascota/:mascotaId" element={<ProtectedRoute><SettingsPet /></ProtectedRoute>} />

          {/* Mascotas perdidas */}
          <Route path='/mascotas-perdidas' element={<LostPets />} />
          <Route path='/publicacion-mascota-perdida' element={<ProtectedRoute><AddLostPets /></ProtectedRoute>} />
          <Route path="/consultar-posteo/:posteoId" element={<ProtectedRoute><ConsultPosts /></ProtectedRoute>} />
          <Route path="/modificar-posteo/:posteoId" element={<ProtectedRoute><SettingsLostPets /></ProtectedRoute>} />

          {/* Mascotas encontradas */}
          <Route path='/mascotas-encontradas' element={<FoundPets />} />
          <Route path='/publicacion-mascota-encontrada' element={<ProtectedRoute><AddFoundPets /></ProtectedRoute>} />

          {/* Mascotas en adopcion */}
          <Route path='/mascotas-adopcion' element={<AdoptPets />} />
          <Route path='/publicacion-mascota-adopcion' element={<ProtectedRoute><AddAdoptPets /></ProtectedRoute>} />
          <Route path="/consultar-posteo-adopcion/:posteoId" element={<ProtectedRoute><ConsultAdoptPets /></ProtectedRoute>} />
          <Route path="/modificar-posteo-adopcion/:posteoId" element={<ProtectedRoute><SettingsAdoptPets /></ProtectedRoute>} />

          <Route path='/preguntas-frecuentes' element={<Questions />} />
          <Route path='/formularios' element={<ConsultAdoptForm />} />

          {/* Paseadores */}
          <Route path='/paseadores' element={<Paseadores />} />
          <Route path="/agregar-paseador" element={<ProtectedRoute><AddPaseador /></ProtectedRoute>} />

          {/* Perfil público */}
          <Route path="/perfilPublico/:correoElectronico/:id" element={<ProtectedRoute><PublicProfilePaseador /></ProtectedRoute>} />

          {/* Veterinarias */}
          <Route path='/veterinarias' element={<Veterinarias />} />
          <Route path="/agregar-veterinaria" element={<ProtectedRoute><AddVeterinaria /></ProtectedRoute>} />


          {/* Cuidadores */}
          <Route path='/cuidadores' element={<Cuidadores />} />
          <Route path="/agregar-cuidador" element={<ProtectedRoute><AddCuidador /></ProtectedRoute>} />

          {/* Manual de usuario */}
          <Route path='/manualusuario' element={<UserManual />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
