import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import Swal from "sweetalert2";

const Modal = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    //funcion para validar el inicio de sesion
    const onSubmit = async (mail, password) => {
        try {
            await login(mail, password);
            return true;
        } catch (error) {
            return false;
        }
    };

    //MODAL PARA INICIAR SESION
    const handleSweetAlertLogin = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: "Debe Iniciar Sesión nuevamente para dar de baja su cuenta",
                icon: "info",
                html: `
            <div className="container-modal">
                <div class="input">
                    <input type="text" required="true" autocomplete="off" id="mail">
                    <label for="name">Correo Electronico</label>
                </div>
                <div class="input">
                    <input type="password" required="true" autocomplete="off" id="password">
                    <label for="name">Contraseña</label>
                </div>
                
            </div>
          `,
                showCancelButton: true,
                confirmButtonText: "Iniciar Sesión",
                cancelButtonText: "Cancelar",
                showLoaderOnConfirm: true,
            })
            .then(async (result) => {
                const mail = document.getElementById("mail").value;
                const password = document.getElementById("password").value;
                if (result.isConfirmed) {
                    const login = await onSubmit(mail, password);
                    if (login) {
                        swalWithBootstrapButtons
                            .fire({
                                title: "El inicio de sesion fue exitoso!",
                                text: "Ya podes dar de baja tu perfil",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                            })
                            .then(() => {
                                window.location.reload();
                            });
                    } else {
                        swalWithBootstrapButtons.fire({
                            title: "Error!",
                            text: "Los datos ingresados son incorrectos",
                            icon: "error",
                            confirmButtonText: "Aceptar",
                        });
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelado",
                        text: "Tu perfil seguira con nosotros :)",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
    };

    //MODAL PARA ELIMINAR USUARIO
    const handleSweetAlertDeleteUser = (callback) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: "¿Estas seguro que deseas eliminar tu perfil?",
                text: "Tu cuenta se dara de baja, pero se guardaran tus datos por si regresas!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const deleteUser = await callback();
                    console.log(deleteUser);
                    if (deleteUser) {
                        swalWithBootstrapButtons
                            .fire({
                                title: "Tu perfil fue dado de baja con exito!",
                                text: "Ya no podras iniciar sesion!.",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                            })
                            .then(() => {
                                navigate("/");
                            });
                    } else {
                        handleSweetAlertLogin();
                    }
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelado",
                        text: "Tu perfil seguira con nosotros :)",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
    };

    //MODAL ELIMINAR MASCOTA
    const handleSweetAlertDeletePet = (nombre, id, foto, callback) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: "¿Estas seguro que deseas eliminar a " + nombre + "?",
                text: "Se borrara toda la informacion sobre su mascota!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const deletePet = callback(id, foto);
                    if (deletePet) {
                        swalWithBootstrapButtons
                            .fire({
                                title: nombre + " eliminado con exito!",
                                text: "Ya no aparecera en su perfil.",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                            })
                            .then(() => {
                                window.location.reload();
                            });
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelado",
                        text: nombre + " seguira siendo tu mascota :)",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
    };    
    
      //MODAL ELIMINAR PUBLICACION
      const handleSweetAlertDeletePost = (id, foto, callback) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons
            .fire({
                title: "¿Estas seguro que deseas eliminar la publicacion?",
                text: "Se borrara toda la informacion sobre la publicación!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                reverseButtons: true,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const deletePet = callback(id, foto);
                    if (deletePet) {
                        swalWithBootstrapButtons
                            .fire({
                                title: " Publicacion eliminada con exito!",
                                text: "Ya no aparecera en su perfil.",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                            })
                            .then(() => {
                                window.location.reload();
                            });
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelado",
                        text:"La publicación no fue eliminada.",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                }
            });
    };    
    


    return {
        handleSweetAlertLogin,
        handleSweetAlertDeleteUser,
        handleSweetAlertDeletePet,
        handleSweetAlertDeletePost,


      
    };
};

export default Modal;
