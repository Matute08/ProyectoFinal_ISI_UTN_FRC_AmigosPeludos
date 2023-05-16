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

function App() {
  return (
    <>
      <BrowserRouter>

        <AuthProvider>
          <Routes>

            <Route path='/' element={<Landing/>}/>
            <Route path="/registrar" element={<Register />}/>
            <Route path="/iniciar-sesion" element={<Login />}/>


          </Routes>
        </AuthProvider>

      </BrowserRouter>
    </>
  );
}

export default App;
