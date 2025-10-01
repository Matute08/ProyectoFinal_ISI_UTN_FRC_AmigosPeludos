import React from "react";
import {
    Box,
    Avatar,
    Typography,
    Paper,
    Divider,
    Button,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/AuthProvider";
import { updateUser } from "../../api/userApi"; // asegurate que esté disponible

const keyMap = {
    nombreCompleto: "Nombre Completo",
    mail: "Correo Electrónico",
    celular: "Teléfono",
    generoUsuario: "Género",
    provincia: "Provincia",
    ciudadUsuario: "Ciudad",
    barrioUsuario: "Barrio",
    direccionCompleta: "Dirección",
};

const excludedKeys = [
    "id",
    "foto",
    "rolId",
    "password",
    "mailVerificado",
    "habilitada",
    "fechaNacimiento",
    "fechaAlta",
    "codigoPostal",
    "username",
    "generoId",
    "barrioId",
    "tieneMascota",
    "cuentaVerificada",
    "qr",
    "esPaseador",
    "esCuidador",
    "esVeterinaria",
    "esFundacion",
    "tipoAutenticacionId",
    "rolUsuario",
    "nroCalle",
    "calle",
];

const PerfilInfo = ({ userData }) => {
    const { deleteAccount } = useAuth();
    const navigate = useNavigate();

    const handleDeleteUser = async () => {
        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Debes confirmar tu contraseña para eliminar la cuenta",
            input: "password",
            inputLabel: "Contraseña",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed || !confirm.value) return;

        const result = await deleteAccount(confirm.value);
        if (result.success) {
            await updateUser(userData.id, {
                        ...userData,
                        habilitada: false,
                    }); // inhabilita en BD
                    localStorage.clear();
            Swal.fire(
                "Eliminado",
                "Tu cuenta fue eliminada correctamente",
                "success"
            )
        } else {
            Swal.fire(
                "Error",
                result.error.message || "No se pudo eliminar tu cuenta",
                "error"
            );
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={2}
            >
                <Avatar
                    src={userData.foto}
                    alt={userData.nombreCompleto}
                    sx={{ width: 100, height: 100, mb: 1 }}
                />
                <Typography variant="h6">
                    {userData.nombreCompleto || "Nombre no disponible"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {userData.rolUsuario || "Rol no definido"}
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
                {Object.entries(userData)
                    .filter(
                        ([key, value]) =>
                            !excludedKeys.includes(key) &&
                            value !== null &&
                            value !== ""
                    )
                    .map(([key, value]) => (
                        <Box key={key} mb={1}>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                {keyMap[key] || key}
                            </Typography>
                            <Typography variant="body1">
                                {String(value)}
                            </Typography>
                        </Box>
                    ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/modificar-perfil")}
                    fullWidth
                >
                    Editar Perfil
                </Button>
                {/* <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                        alert("Eliminar cuenta pendiente de implementación")
                    }
                    fullWidth
                >
                    Eliminar Cuenta
                </Button> */}

                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteUser}
                    fullWidth
                >
                    Eliminar Cuenta
                </Button>
            </Stack>
        </Paper>
    );
};

export default PerfilInfo;
