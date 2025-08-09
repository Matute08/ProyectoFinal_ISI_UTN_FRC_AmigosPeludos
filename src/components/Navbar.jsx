import React, { useState, useEffect } from "react";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Button,
    Avatar,
    Badge,
    useTheme,
    useMediaQuery,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    ExpandMore,
    Logout,
    Person,
    QuestionAnswer,
    Pets,
    Home,
    ReportProblem,
    Favorite,
    DirectionsWalk,
    People,
    LocalHospital,
    VolunteerActivism,
    HelpOutline,
    SupportAgent,
    Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUserMail } from "../api/userApi";
import { getFormulariosDuenoPosteo } from "../api/formulariosApi";
import { useAuth } from "../auth/AuthProvider";
import { getVeterinarias } from "../api/commonApi";
import { getFundacion } from "../api/fundacionesApi";

const Navbar = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { user, userData, logout } = useAuth();

    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElMascotas, setAnchorElMascotas] = useState(null);
    const [anchorElServicios, setAnchorElServicios] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [notificaciones, setNotificaciones] = useState({
        formularios: 0,
        veterinarias: 0,
        fundaciones: 0,
        total:0
    });
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleOpenMascotasMenu = (event) =>
        setAnchorElMascotas(event.currentTarget);
    const handleOpenServiciosMenu = (event) =>
        setAnchorElServicios(event.currentTarget);

    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleCloseMascotasMenu = () => setAnchorElMascotas(null);
    const handleCloseServiciosMenu = () => setAnchorElServicios(null);
    const toggleDrawer = () => setDrawerOpen(!drawerOpen);
    const [isLoading, setIsLoading] = useState(true);
    const handleLogout = async () => {
        setAnchorElUser(null);
        await logout();
        navigate("/");
    };

    useEffect(() => {
        if (user) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [user]);

    // Cerrar el menú cuando cambien los datos del usuario o el usuario
    useEffect(() => {
        setAnchorElUser(null);
    }, [userData, user]);

    useEffect(() => {
        const fetchNotificaciones = async () => {
            if (!userData?.id) return;

            try {
                const [formulariosRes, vetsRes, fundacionesRes] =
                    await Promise.all([
                        getFormulariosDuenoPosteo(userData.id),
                        userData.rolId === 1
                            ? getVeterinarias()
                            : Promise.resolve({ data: [] }),
                        userData.rolId === 1
                            ? getFundacion()
                            : Promise.resolve({ data: [] }),
                    ]);

                const formulariosPendientes = formulariosRes.data.filter(
                    (f) =>
                        f.estadoFormularioId === 1 &&
                        f.nombreDueño === userData.nombreCompleto
                ).length;

                const vetsPendientes = vetsRes.data.filter(
                    (v) => v.estadoId === 1
                ).length;

                const fundPendientes = fundacionesRes.data.filter(
                    (f) => f.estadoId === 1
                ).length;

                setNotificaciones({
                    formularios: formulariosPendientes,
                    veterinarias: vetsPendientes,
                    fundaciones: fundPendientes,
                    total: formulariosPendientes + vetsPendientes + fundPendientes
                });
            } catch (err) {
                console.error("Error al cargar notificaciones", err);
                setNotificaciones({
                    formularios: 0,
                    veterinarias: 0,
                    fundaciones: 0,
                    total: 0
                });
            }
        };

        fetchNotificaciones();
    }, [userData]);

    const drawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/")}>
                        <Home sx={{ mr: 1 }} />
                        <ListItemText primary="Inicio" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/encontrados")}>
                        <Pets sx={{ mr: 1 }} />
                        <ListItemText primary="Encontradas" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/perdidos")}>
                        <ReportProblem sx={{ mr: 1 }} />
                        <ListItemText primary="Perdidas" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/adopcion")}>
                        <Favorite sx={{ mr: 1 }} />
                        <ListItemText primary="En adopción" />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/paseadores")}>
                        <DirectionsWalk sx={{ mr: 1 }} />
                        <ListItemText primary="Paseadores" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/cuidadores")}>
                        <People sx={{ mr: 1 }} />
                        <ListItemText primary="Cuidadores" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/veterinarias")}>
                        <LocalHospital sx={{ mr: 1 }} />
                        <ListItemText primary="Veterinarias" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/fundaciones")}>
                        <VolunteerActivism sx={{ mr: 1 }} />
                        <ListItemText primary="Fundaciones" />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/faq")}>
                        <HelpOutline sx={{ mr: 1 }} />
                        <ListItemText primary="Preguntas Frecuentes" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/ayuda")}>
                        <SupportAgent sx={{ mr: 1 }} />
                        <ListItemText primary="Ayuda" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <AppBar
            position="static"
            sx={{ backgroundColor: "#F4A261", boxShadow: 1, color: "#000" }}
        >
            <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <img
                        src="/logo-amigos-peludos.png"
                        alt="logo"
                        style={{
                            height: 80,
                            marginRight: 16,
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/")}
                    />
                    {isMobile ? (
                        <>
                            <IconButton color="inherit" onClick={toggleDrawer}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={drawerOpen}
                                onClose={toggleDrawer}
                            >
                                {drawerList}
                            </Drawer>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/")}
                            >
                                Inicio
                            </Button>
                            <Button
                                color="inherit"
                                endIcon={<ExpandMore />}
                                onClick={handleOpenMascotasMenu}
                            >
                                Mascotas
                            </Button>
                            <Menu
                                anchorEl={anchorElMascotas}
                                open={Boolean(anchorElMascotas)}
                                onClose={handleCloseMascotasMenu}
                            >
                                <MenuItem
                                    onClick={() => {
                                        navigate("/encontrados");
                                        handleCloseMascotasMenu();
                                    }}
                                >
                                    Encontradas
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/perdidos");
                                        handleCloseMascotasMenu();
                                    }}
                                >
                                    Perdidas
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/adopcion");
                                        handleCloseMascotasMenu();
                                    }}
                                >
                                    En adopción
                                </MenuItem>
                            </Menu>
                            <Button
                                color="inherit"
                                endIcon={<ExpandMore />}
                                onClick={handleOpenServiciosMenu}
                            >
                                Servicios
                            </Button>
                            <Menu
                                anchorEl={anchorElServicios}
                                open={Boolean(anchorElServicios)}
                                onClose={handleCloseServiciosMenu}
                            >
                                <MenuItem
                                    onClick={() => {
                                        navigate("/paseadores");
                                        handleCloseServiciosMenu();
                                    }}
                                >
                                    Paseadores
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/cuidadores");
                                        handleCloseServiciosMenu();
                                    }}
                                >
                                    Cuidadores
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/veterinarias");
                                        handleCloseServiciosMenu();
                                    }}
                                >
                                    Veterinarias
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/fundaciones");
                                        handleCloseServiciosMenu();
                                    }}
                                >
                                    Fundaciones
                                </MenuItem>
                            </Menu>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/faq")}
                            >
                                Preguntas Frecuentes
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/ayuda")}
                            >
                                Ayuda
                            </Button>
                        </>
                    )}
                </Box>

                {/* 🔒 Mostrar menú si hay sesión y datos cargados */}
                {!isLoading && user ? (
                    <Box>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Badge badgeContent={notificaciones.total} color="error">
                                <Avatar
                                    alt={userData?.nombreCompleto}
                                    src={userData?.foto || ""}
                                />
                            </Badge>
                        </IconButton>

                        <Menu
                            sx={{ mt: "45px" }}
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem disabled>
                                <Typography textAlign="center">
                                    ¡Hola,{" "}
                                    {userData?.nombreCompleto || "Usuario"}!
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {navigate("/perfil"); handleCloseUserMenu()}} >
                                <Person fontSize="small" sx={{ mr: 1 }} />{" "}
                                Perfil
                            </MenuItem>
                            <MenuItem onClick={() => {navigate("/formularios"), handleCloseUserMenu()}}>
                                <QuestionAnswer
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                />
                                Formularios
                                {notificaciones.formularios > 0 && (
                                    <Badge
                                        color="primary"
                                        badgeContent={
                                            notificaciones.formularios
                                        }
                                        sx={{ ml: 2 }}
                                    />
                                )}
                            </MenuItem>
                            {userData?.rolId === 1 && (
                                <MenuItem
                                    onClick={() => {navigate("/solicitudes"), handleCloseUserMenu();}}
                                >
                                    <Pets fontSize="small" sx={{ mr: 1 }} />
                                    Solicitudes
                                    {notificaciones.veterinarias +
                                        notificaciones.fundaciones >
                                        0 && (
                                        <Badge
                                            color="warning"
                                            badgeContent={
                                                notificaciones.veterinarias +
                                                notificaciones.fundaciones
                                            }
                                            sx={{ ml: 2 }}
                                        />
                                    )}
                                </MenuItem>
                                
                            )}
                            {userData?.rolId === 1 && (
                                <MenuItem
                                    onClick={() => {
                                    navigate("/denuncias");
                                    handleCloseUserMenu();
                                    }}
                                >
                                    <ReportProblem fontSize="small" sx={{ mr: 1 }} />
                                    Denuncias
                                </MenuItem>
                            )}


                            <MenuItem onClick={handleLogout}>
                                <Logout fontSize="small" sx={{ mr: 1 }} />{" "}
                                Cerrar Sesión
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box>
                        <Button
                            color="inherit"
                            onClick={() => navigate("/login")}
                        >
                            Iniciar sesión
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => navigate("/registro")}
                        >
                            Registrarse
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
