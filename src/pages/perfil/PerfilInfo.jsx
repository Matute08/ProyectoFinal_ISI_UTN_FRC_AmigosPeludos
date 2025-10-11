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

// Campos que queremos mostrar en el perfil con sus etiquetas
const profileFields = [
    {
        key: "nombreCompleto",
        label: "Nombre Completo",
        required: true
    },
    {
        key: "mail",
        label: "Correo Electrónico",
        required: true
    },
    {
        key: "celular",
        label: "Teléfono",
        required: false
    },
    {
        key: "generoUsuario",
        label: "Género",
        required: false
    },
    {
        key: "provinciaNombre",
        label: "Provincia",
        required: false
    },
    {
        key: "ciudadUsuario",
        label: "Ciudad",
        required: false
    },
    {
        key: "barrioUsuario",
        label: "Barrio",
        required: false
    },
    {
        key: "direccionCompleta",
        label: "Dirección",
        required: false
    }
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
                {profileFields.map((field) => {
                    const value = userData[field.key];
                    const hasValue = value !== null && value !== "" && value !== undefined;
                    
                    return (
                        <Box key={field.key} mb={1}>
                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                            >
                                {field.label}
                                {field.required && (
                                    <Typography 
                                        component="span" 
                                        color="error.main"
                                        sx={{ ml: 0.5 }}
                                    >
                                        
                                    </Typography>
                                )}
                            </Typography>
                            <Typography 
                                variant="body1"
                                sx={{ 
                                    color: hasValue ? 'text.primary' : 'text.disabled',
                                    fontStyle: hasValue ? 'normal' : 'italic'
                                }}
                            >
                                {hasValue ? String(value) : 'No especificado'}
                            </Typography>
                        </Box>
                    );
                })}
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
