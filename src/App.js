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

//perfil
import UserProfileSetting from './pages/profile/Settings';
import Profile from './pages/profile/UserProfile';
import PasswordReset from './pages/autheticationInner/passwordReset/PasswordReset';

//mascotas usuario
import AddPets from './pages/profile/pet/addPet/AddPets';
import SettingsPet from './pages/profile/pet/settingsPet/SettingsPet';

//mascota perdida
import LostPets from './pages/petSearch/lostPets/LostPets';
import AddLostPets from './pages/petSearch/lostPets/AddLostPets';
import ConsultPosts from './pages/petSearch/ConsultPosts';
import SettingsLostPets from './pages/petSearch/SettingsLostPets';

//mascotas encontradas
import FoundPets from './pages/petSearch/foundPets/FoundPets';
import AddFoundPets from './pages/petSearch/foundPets/AddFoundPets';

//mascotas en adopcion
import AdoptPets from './pages/petSearch/adoptPets/AdoptPets';
import AddAdoptPets from './pages/petSearch/adoptPets/AddAdoptPets';
import ConsultAdoptPets from './pages/petSearch/adoptPets/ConsultAdoptPets';
import SettingsAdoptPets from './pages/petSearch/adoptPets/SettingsAdoptPets';

//preguntas frecuentes
import Questions from './pages/frequentQuestions/Questions';

//qr
import GenerateQr from './pages/profile/qr/GenerateQr';

//consultar formularios
import ConsultAdoptForm from './pages/formAdopt/ConsultAdoptForm';

//PASEADORES
import Paseadores from './pages/paseadores/Paseadores';
import AddPaseador from './pages/paseadores/AddPaseador';


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
            <Route path='/publicacion-mascota-perdida' element={<ProtectedRoute><AddLostPets /></ProtectedRoute>}></Route>
            <Route path="/consultar-posteo/:posteoId" element={<ProtectedRoute><ConsultPosts /></ProtectedRoute>}></Route>
            <Route path="/modificar-posteo/:posteoId" element={<ProtectedRoute><SettingsLostPets /></ProtectedRoute>}></Route>
            
            <Route path='/mascotas-encontradas' element={<FoundPets></FoundPets>}></Route>
            <Route path='/publicacion-mascota-encontrada' element={<ProtectedRoute><AddFoundPets></AddFoundPets></ProtectedRoute>}></Route>
           
            <Route path='/mascotas-adopcion' element={<AdoptPets></AdoptPets>}></Route>
            <Route path='/publicacion-mascota-adopcion' element={<ProtectedRoute><AddAdoptPets></AddAdoptPets></ProtectedRoute>}></Route>
            <Route path="/consultar-posteo-adopcion/:posteoId" element={<ProtectedRoute><ConsultAdoptPets /></ProtectedRoute>}></Route>
            <Route path="/modificar-posteo-adopcion/:posteoId" element={<ProtectedRoute><SettingsAdoptPets /></ProtectedRoute>}></Route>

            <Route path='/preguntas-frecuentes' element={<Questions></Questions>}></Route>

            <Route path='/formularios' element={<ConsultAdoptForm></ConsultAdoptForm>}></Route>

            <Route path='/paseadores' element={<Paseadores></Paseadores>}></Route>
            <Route path="/agregar-paseador" element={<ProtectedRoute><AddPaseador /></ProtectedRoute>}></Route>



            




            
            
            

            


          </Routes>
        </AuthProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
