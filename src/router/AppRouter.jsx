import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
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
import ResetPassword from "../pages/auth/ResetPassword";
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
import ModificarCuidador from "../pages/perfil/servicios/modificar/ModificarCuidador";

import PanelDenuncias from "../pages/denuncias/PanelDenuncias";
import ComparacionesMascotaPage from "../pages/ComparacionesMascotaPage";
import NotFound from "../pages/NotFound";

import Stats from "../pages/stats/Stats";
import GestionPublicidades from "../pages/admin/GestionPublicidades";
import PreciosPublicidad from "../components/PreciosPublicidad";
import RegistroAds from "../pages/ads/RegistroAds";
import UserStats from "../pages/stats/UserStats";

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
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/datos-usuario/:id" element={<UsuarioQrVista />} />
                <Route path="/donacion-fundacion/:idFunda" element={<DonacionFundacion />} />

                <Route
                    path="/consultar-posteo-perdida/:id"
                    element={
                        <PrivateRoute>
                            <DetallePublicacionGeneral tipo="Perdida" />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/consultar-posteo-encontrada/:id"
                    element={
                        <PrivateRoute>
                            <DetallePublicacionGeneral tipo="Encontrada" />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/consultar-posteo-adopcion/:id"
                    element={
                        <PrivateRoute>
                            <DetallePublicacionAdopcion />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/perfil-cuidador/:id"
                    element={
                        <PrivateRoute>
                            <PerfilCuidador />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/perfil-paseador/:id"
                    element={
                        <PrivateRoute>
                            <PerfilPaseador />
                        </PrivateRoute>
                    }
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
                        <AdminRoute>
                            <SolicitudesServiciosAdmin />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/ver-solicitud-veterinaria/:id"
                    element={
                        <AdminRoute>
                            <VerSolicitudVeterinaria />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/ver-solicitud-fundacion/:id"
                    element={
                        <AdminRoute>
                            <VerSolicitudFundacion />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/denuncias"
                    element={
                        <AdminRoute>
                            <PanelDenuncias />
                        </AdminRoute>
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
                <Route
                    path="/modificar-cuidador/:cuidadorId"
                    element={
                        <PrivateRoute>
                            <ModificarCuidador />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/comparaciones/:id"
                    element={<ComparacionesMascotaPage />}
                />

               <Route
                path="/stats"
                element={
                    <PrivateRoute>
                    <Stats />
                    </PrivateRoute>
                }
/>

                <Route
                    path="/gestion-publicidades"
                    element={
                        <AdminRoute>
                            <GestionPublicidades />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/precios-publicidad"
                    element={<PreciosPublicidad />}
                />

                <Route
                    path="/ads/registro"
                    element={
                        <PrivateRoute>
                            <RegistroAds />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/mis-estadisticas"
                    element={
                        <PrivateRoute>
                            <UserStats />
                        </PrivateRoute>
                    }
                />

                {/* Puedes agregar más rutas aquí */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
