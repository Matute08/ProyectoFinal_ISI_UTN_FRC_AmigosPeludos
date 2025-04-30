import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import '../src/assets/scss/themes.scss';
import { AuthProvider } from './services/AuthContext';
import { ProtectedRoute } from './pages/autheticationInner/ProtectedRoute';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'leaflet/dist/leaflet.css'; 

// Importación de componentes
import Landing from './pages/landing/Index';
import Register from './pages/autheticationInner/register/Register';
import CompletarPerfil from './pages/autheticationInner/register/CompletarPerfil';
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
import QrUsuario from './pages/profile/qr/QrUsuario';
import ConsultAdoptForm from './pages/requests/ConsultAdoptForm';
import Paseadores from './pages/paseadores/Paseadores';
import AddPaseador from './pages/paseadores/AddPaseador';
import SettingsPaseador from './pages/profile/misServicios/settingsServices/SettingsPaseador';
import PublicProfilePaseador from './pages/publicProfile/publicProfilePaseador/PublicProfilePaseador';
import PublicProfileCuidador from './pages/publicProfile/publicProfileCuidador/PublicProfileCuidador';
import Veterinarias from './pages/veterinarias/Veterinarias';
import Cuidadores from './pages/cuidadores/Cuidadores';
import AddCuidador from './pages/cuidadores/AddCuidador';
import SettingsCuidador from './pages/profile/misServicios/settingsServices/SettingsCuidador';
import UserManual from './pages/userManual/UserManual';
import AddVeterinaria from './pages/veterinarias/registrarVeterinaria/AddVeterinaria';
import PerfilVeterinaria from './pages/veterinarias/perfilVeterinaria/PerfilVeterinaria';
import ViewAdoptForm from './pages/requests/pdf/ViewAdoptForm';
import Solicitudes from './pages/requests/solicitudes/Solicitudes';
import ViewSolicitudesVeterinarias from './pages/requests/pdf/ViewSolicitudesVeterinarias';
import ViewSolicitudesFundaciones from './pages/requests/pdf/ViewSolicitudesFundaciones';
import SettingsVeterinaria from './pages/profile/misServicios/settingsServices/SettingsVeterinaria';
import Fundaciones from './pages/fundaciones/Fundaciones';
import SettingsFundacion from './pages/profile/misServicios/settingsServices/SettingsFundacion';
import AddFundacion from './pages/fundaciones/AddFundaciones';
import DonacionFundacion from './pages/donaciones/DonacionFundacion';

function App() {
  const authRoutes = [
    { path: "/registrar", element: <Register /> },
    { path: "/iniciar-sesion", element: <Login /> },
    { path: "/modificar-perfil", element: <ProtectedRoute><UserProfileSetting /></ProtectedRoute> },
    { path: "/perfil/:mail", element: <ProtectedRoute><Profile /></ProtectedRoute> },
    { path: "/restablecer-contraseña", element: <PasswordReset /> },
    { path: "/completar-perfil/:mail", element: <ProtectedRoute><CompletarPerfil /></ProtectedRoute> },
  ];

  const petRoutes = [
    { path: "/agregar-mascota", element: <ProtectedRoute><AddPets /></ProtectedRoute> },
    { path: "/modificar-mascota/:mascotaId", element: <ProtectedRoute><SettingsPet /></ProtectedRoute> },
    { path: "/mascotas-perdidas", element: <LostPets /> },
    { path: "/publicacion-mascota-perdida", element: <ProtectedRoute><AddLostPets /></ProtectedRoute> },
    { path: "/consultar-posteo/:posteoId", element: <ProtectedRoute><ConsultPosts /></ProtectedRoute> },
    { path: "/modificar-posteo/:posteoId", element: <ProtectedRoute><SettingsLostPets /></ProtectedRoute> },
    { path: "/mascotas-encontradas", element: <FoundPets /> },
    { path: "/publicacion-mascota-encontrada", element: <ProtectedRoute><AddFoundPets /></ProtectedRoute> },
    { path: "/mascotas-adopcion", element: <AdoptPets /> },
    { path: "/publicacion-mascota-adopcion", element: <ProtectedRoute><AddAdoptPets /></ProtectedRoute> },
    { path: "/consultar-posteo-adopcion/:posteoId", element: <ProtectedRoute><ConsultAdoptPets /></ProtectedRoute> },
    { path: "/modificar-posteo-adopcion/:posteoId", element: <ProtectedRoute><SettingsAdoptPets /></ProtectedRoute> },
  ];

  const serviceRoutes = [
    { path: "/paseadores", element: <Paseadores /> },
    { path: "/agregar-paseador", element: <ProtectedRoute><AddPaseador /></ProtectedRoute> },
    { path: "/modificar-paseador/:paseadorId", element: <ProtectedRoute><SettingsPaseador /></ProtectedRoute> },
    { path: "/perfilPublicoPaseador/:correoElectronico/:id", element: <ProtectedRoute><PublicProfilePaseador /></ProtectedRoute> },
    { path: "/perfilPublicoCuidador/:correoElectronico/:id", element: <ProtectedRoute><PublicProfileCuidador /></ProtectedRoute> },
    { path: "/veterinarias", element: <Veterinarias /> },
    { path: "/agregar-veterinaria", element: <ProtectedRoute><AddVeterinaria /></ProtectedRoute> },
    { path: "/veterinarias/perfil-veterinaria/:idVete", element: <ProtectedRoute><PerfilVeterinaria /></ProtectedRoute> },
    { path: "/modificar-veterinaria/:veterinariaId", element: <ProtectedRoute><SettingsVeterinaria /></ProtectedRoute> },
    { path: "/cuidadores", element: <Cuidadores /> },
    { path: "/agregar-cuidador", element: <ProtectedRoute><AddCuidador /></ProtectedRoute> },
    { path: "/modificar-cuidador/:cuidadorId", element: <ProtectedRoute><SettingsCuidador /></ProtectedRoute> },
    { path: "/fundaciones", element: <Fundaciones /> },
    { path: "/agregar-fundacion", element: <ProtectedRoute><AddFundacion /></ProtectedRoute> },
    { path: "/modificar-fundacion/:fundacionId", element: <ProtectedRoute><SettingsFundacion /></ProtectedRoute> },
    { path: "/fundaciones/donar-fundacion/:idFunda", element: <ProtectedRoute><DonacionFundacion /></ProtectedRoute> },
  ];

  const otherRoutes = [
    { path: "/formularios", element: <ConsultAdoptForm /> },
    { path: "/solicitudes", element: <ProtectedRoute><Solicitudes /></ProtectedRoute> },
    { path: "/manualusuario", element: <UserManual /> },
    { path: "/preguntas-frecuentes", element: <Questions /> },
    { path: "/ver-formulario/:id", element: <ViewAdoptForm /> },
    { path: "/ver-formulario-solicitud-veterinaria/:id", element: <ViewSolicitudesVeterinarias /> },
    { path: "/ver-formulario-solicitud-fundacion/:id", element: <ViewSolicitudesFundaciones /> },
    { path: "/datos-usuario/:id", element: <QrUsuario /> },
  ];

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          {authRoutes.map((route, index) => <Route key={index} {...route} />)}
          {petRoutes.map((route, index) => <Route key={index} {...route} />)}
          {serviceRoutes.map((route, index) => <Route key={index} {...route} />)}
          {otherRoutes.map((route, index) => <Route key={index} {...route} />)}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;