import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Perfil from "../pages/perfil/Perfil";
import Adopcion from "../pages/Adopcion";
import Encontrados from "../pages/Encontrados";
import Perdidos from "../pages/Perdidos";
import Paseadores from "../pages/paseador/Paseadores";
import Veterinarias from "../pages/veterinaria/Veterinarias";
import Cuidadores from "../pages/cuidador/Cuidadores";
import Fundaciones from "../pages/fundacion/Fundaciones";
import Ayuda from "../pages/Ayuda";
import PreguntasFrecuentes from "../pages/PreguntasFrecuentes";
import Registro from "../pages/auth/Registro";
import DetallePublicacionAdopcion from "../pages/DetallePublicacionAdopcion";
import DetallePublicacionGeneral from "../pages/DetallePublicacionGeneral";
import NuevaMascotaEncontrada from "../pages/NuevaMascotaEncontrada";
import NuevaMascotaPerdida from "../pages/NuevaMascotaPerdida";
import NuevaMascotaAdopcion from "../pages/NuevaMascotaAdopcion";

import ModificarMascota from "../pages/perfil/mascotas/ModificarMascota";
import ScrollToTop from "../components/ScrollToTop";
import AgregarMascota from "../pages/perfil/mascotas/AgregarMascota";
import ModificarPublicacion from "../pages/perfil/publicaciones/ModificarPublicacion";
import UsuarioQrVista from "../pages/UsuarioQrVista";

import PanelFormulariosAdopcion from "../pages/formulario/PanelFormulariosAdopcion";
import VerFormularioAdopcion from "../pages/formulario/VerFormularioAdopcion";
import SolicitudesServiciosAdmin from "../pages/solicitudes/SolicitudesServiciosAdmin";
import VerSolicitudVeterinaria from "../pages/solicitudes/VerSolicitudVeterinaria";
import VerSolicitudFundacion from "../pages/solicitudes/VerSolicitudFundacion";

import AgregarVeterinaria from "../pages/veterinaria/AgregarVeterinaria";
import DonacionFundacion from "../pages/fundacion/DonacionFundacion";
import AgregarFundacion from "../pages/fundacion/AgregarFundacion";

import PerfilCuidador from "../pages/cuidador/PerfilCuidador";
import PerfilPaseador from "../pages/paseador/PerfilPaseador";
import AgregarPaseador from "../pages/paseador/agregarPaseador/AgregarPaseador";
import AgregarCuidador from "../pages/cuidador/agregarCuidador/AgregarCuidador";
import ModificarPerfil from "../pages/perfil/ModificarPerfil";
import VacunacionMascota from "../pages/perfil/mascotas/vacunas/VacunacionMascota";
import ModificarPaseador from "../pages/perfil/servicios/modificar/ModificarPaseador";

import PanelDenuncias from "../pages/denuncias/PanelDenuncias";

export default function AppRouter() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perdidos" element={<Perdidos />} />
                <Route path="/encontrados" element={<Encontrados />} />
                <Route path="/adopcion" element={<Adopcion />} />
                <Route path="/paseadores" element={<Paseadores />} />
                <Route path="/veterinarias" element={<Veterinarias />} />
                <Route path="/cuidadores" element={<Cuidadores />} />
                <Route path="/fundaciones" element={<Fundaciones />} />
                <Route path="/ayuda" element={<Ayuda />} />
                <Route path="/faq" element={<PreguntasFrecuentes />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/datos-usuario/:id" element={<UsuarioQrVista />} />
                <Route path="/donacion-fundacion/:idFunda" element={<DonacionFundacion />} />

                <Route
                    path="/consultar-posteo-perdida/:id"
                    element={<DetallePublicacionGeneral tipo="Perdida" />}
                />
                <Route
                    path="/consultar-posteo-encontrada/:id"
                    element={<DetallePublicacionGeneral tipo="Encontrada" />}
                />
                <Route
                    path="/consultar-posteo-adopcion/:id"
                    element={<DetallePublicacionAdopcion />}
                />

                <Route
                    path="/perfil-cuidador/:id"
                    element={<PerfilCuidador />}
                />

                <Route
                    path="/perfil-paseador/:id"
                    element={<PerfilPaseador />}
                />

                <Route
                    path="/perfil"
                    element={
                        <PrivateRoute>
                            <Perfil />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/nueva-mascota-encontrada"
                    element={
                        <PrivateRoute>
                            <NuevaMascotaEncontrada />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/nueva-mascota-perdida"
                    element={
                        <PrivateRoute>
                            <NuevaMascotaPerdida />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/nueva-mascota-adopcion"
                    element={
                        <PrivateRoute>
                            <NuevaMascotaAdopcion />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/modificar-mascota/:mascotaId"
                    element={
                        <PrivateRoute>
                            <ModificarMascota />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/agregar-mascota"
                    element={
                        <PrivateRoute>
                            <AgregarMascota />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/modificar-publicacion/:publicacionId"
                    element={
                        <PrivateRoute>
                            <ModificarPublicacion />
                        </PrivateRoute>
                    }
                />

                 <Route
                    path="/formularios"
                    element={
                        <PrivateRoute>
                            <PanelFormulariosAdopcion />
                        </PrivateRoute>
                    }
                />


                 <Route
                    path="/ver-formulario/:id"
                    element={
                        <PrivateRoute>
                            <VerFormularioAdopcion />
                        </PrivateRoute>
                    }
                />

                 <Route
                    path="/solicitudes"
                    element={
                        <PrivateRoute>
                            <SolicitudesServiciosAdmin />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/ver-solicitud-veterinaria/:id"
                    element={
                        <PrivateRoute>
                            <VerSolicitudVeterinaria />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/ver-solicitud-fundacion/:id"
                    element={
                        <PrivateRoute>
                            <VerSolicitudFundacion />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/denuncias"
                    element={
                        <PrivateRoute>
                            <PanelDenuncias />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/agregar-veterinaria"
                    element={
                        <PrivateRoute>
                            <AgregarVeterinaria />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/agregar-fundacion"
                    element={
                        <PrivateRoute>
                            <AgregarFundacion />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/agregar-paseador"
                    element={
                        <PrivateRoute>
                            <AgregarPaseador />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/agregar-cuidador"
                    element={
                        <PrivateRoute>
                            <AgregarCuidador />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/modificar-perfil"
                    element={
                        <PrivateRoute>
                            <ModificarPerfil />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/vacunas-mascota/:mascotaId"
                    element={
                        <PrivateRoute>
                            <VacunacionMascota />
                        </PrivateRoute>
                    }
                />

                  <Route
                    path="/modificar-paseador/:paseadorId"
                    element={
                        <PrivateRoute>
                            <ModificarPaseador />
                        </PrivateRoute>
                    }
                />
                {/* Puedes agregar más rutas aquí */}
            </Routes>
        </>
    );
}
