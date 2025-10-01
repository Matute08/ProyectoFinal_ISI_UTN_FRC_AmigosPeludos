import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { cambiarEstadoPublicacion, getEstadosPublicacion } from '../api/publicacionesApi';
import { mostrarAlertaExito, mostrarAlertaError } from '../utils/showAlert';

const CambiarEstadoPublicacion = ({ 
    open, 
    onClose, 
    publicacionId, 
    onEstadoCambiado,
    tipoPublicacion = "publicación", // "perdida", "encontrada", "adopcion"
    nombrePublicacionMascota
}) => {
    useEffect(() => {
        if (open) {
            mostrarModalCambioEstado();
        }
    }, [open]);

    const mostrarModalCambioEstado = async () => {
        try {
            // Cargar estados disponibles
            const estados = await getEstadosPublicacion();
            const estadosParaCambio = estados.filter(estado => estado.id !== 1);

            // Crear opciones para el select
            const opciones = {};
            estadosParaCambio.forEach(estado => {
                opciones[estado.id] = estado.nombre;
            });

            // Obtener mensaje explicativo según el tipo
            const getMensajeExplicativo = (estadoId) => {
                const tipo = tipoPublicacion.toLowerCase();
                const mensajes = {
                    2: `Marcar como finalizada significa que la mascota ${tipo === 'perdida' ? 'fue encontrada' : tipo === 'encontrada' ? 'fue reclamada por su dueño' : 'fue adoptada'}.`,
                    3: `Marcar como cancelada significa que ya no necesitás esta publicación (por ejemplo, la mascota apareció sola o decidiste no continuar).`
                };
                return mensajes[estadoId] || '';
            };

            const { value: estadoSeleccionado } = await Swal.fire({
                title: `<div style="color: #2c3e50; font-weight: bold; font-size: 24px;">🐾 Cambiar Estado</div>`,
                html: `
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="
                            background: linear-gradient(135deg, #4caf50, #66bb6a);
                            color: white;
                            padding: 15px;
                            border-radius: 12px;
                            margin-bottom: 20px;
                            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                        ">
                            <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                                ${nombrePublicacionMascota || 'Mascota'}
                            </div>
                            <div style="font-size: 14px; opacity: 0.9;">
                                ${tipoPublicacion}
                            </div>
                        </div>
                        
                        <p style="
                            color: #666;
                            font-size: 16px;
                            margin: 20px 0;
                            line-height: 1.5;
                        ">
                            ¿Cómo querés cambiar el estado de esta publicación?
                        </p>
                        
                        <div id="explicacion" style="
                            background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
                            padding: 15px;
                            border-radius: 12px;
                            border-left: 4px solid #2196f3;
                            font-size: 14px;
                            color: #1565c0;
                            margin-top: 15px;
                            display: none;
                            text-align: left;
                            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
                        "></div>
                    </div>
                `,
                input: 'select',
                inputOptions: opciones,
                inputPlaceholder: 'Seleccionar nuevo estado',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debés seleccionar un estado';
                    }
                },
                showCancelButton: true,
                confirmButtonText: '✅ Confirmar Cambio',
                cancelButtonText: '❌ Cancelar',
                confirmButtonColor: '#4caf50',
                cancelButtonColor: '#f44336',
                allowOutsideClick: false,
                allowEscapeKey: true,
                width: '500px',
                padding: '20px',
                background: '#ffffff',
                customClass: {
                    container: 'swal-over-mui',
                    popup: 'swal2-popup-custom',
                    title: 'swal2-title-custom',
                    htmlContainer: 'swal2-html-custom',
                    input: 'swal2-input-custom',
                    confirmButton: 'swal2-confirm-custom',
                    cancelButton: 'swal2-cancel-custom'
                },
                didOpen: () => {
                    // Asegurar que el SweetAlert esté por encima de los modales MUI
                    const swalContainer = document.querySelector('.swal2-container');
                    if (swalContainer) {
                        swalContainer.style.zIndex = '9999';
                    }

                    // Agregar estilos CSS personalizados
                    const style = document.createElement('style');
                    style.textContent = `
                        .swal2-popup-custom {
                            border-radius: 20px !important;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
                        }
                        .swal2-title-custom {
                            margin-bottom: 0 !important;
                        }
                        .swal2-html-custom {
                            margin: 0 !important;
                        }
                        .swal2-input-custom {
                            border: 2px solid #e0e0e0 !important;
                            border-radius: 10px !important;
                            padding: 12px 16px !important;
                            font-size: 16px !important;
                            transition: all 0.3s ease !important;
                        }
                        .swal2-input-custom:focus {
                            border-color: #4caf50 !important;
                            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
                        }
                        .swal2-confirm-custom {
                            border-radius: 25px !important;
                            padding: 12px 30px !important;
                            font-weight: bold !important;
                            font-size: 16px !important;
                            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3) !important;
                        }
                        .swal2-cancel-custom {
                            border-radius: 25px !important;
                            padding: 12px 30px !important;
                            font-weight: bold !important;
                            font-size: 16px !important;
                            box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3) !important;
                        }
                    `;
                    document.head.appendChild(style);

                    // Agregar listener para mostrar explicación cuando cambie la selección
                    const select = document.querySelector('.swal2-select');
                    const explicacion = document.getElementById('explicacion');
                    
                    if (select && explicacion) {
                        select.addEventListener('change', (e) => {
                            const mensaje = getMensajeExplicativo(parseInt(e.target.value));
                            if (mensaje) {
                                explicacion.innerHTML = `<strong>💡 Explicación:</strong><br/>${mensaje}`;
                                explicacion.style.display = 'block';
                            } else {
                                explicacion.style.display = 'none';
                            }
                        });
                    }
                }
            });

            if (estadoSeleccionado) {
                // Mostrar loading
                Swal.fire({
                    title: '<div style="color: #2c3e50; font-weight: bold;">⏳ Procesando...</div>',
                    html: '<div style="color: #666; font-size: 16px;">Cambiando el estado de la publicación</div>',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    width: '400px',
                    padding: '30px',
                    background: '#ffffff',
                    customClass: {
                        container: 'swal-over-mui',
                        popup: 'swal2-popup-custom',
                        title: 'swal2-title-custom'
                    },
                    didOpen: () => {
                        Swal.showLoading();
                        const swalContainer = document.querySelector('.swal2-container');
                        if (swalContainer) {
                            swalContainer.style.zIndex = '9999';
                        }
                    }
                });

                try {
                    const resultado = await cambiarEstadoPublicacion(publicacionId, parseInt(estadoSeleccionado));
                    
                    
                    // Mapear el nuevo estado a nombre
                    const mapeoEstados = {
                        1: 'Activa',
                        2: 'Finalizada', 
                        3: 'Cancelada'
                    };
                    
                    // Usar nombreEstado si existe, sino mapear desde nuevoEstado
                    const estadoNombre = resultado.nombreEstado || mapeoEstados[resultado.nuevoEstado] || estados.find(e => e.id === parseInt(estadoSeleccionado))?.nombre;
                    
                    Swal.fire({
                        title: '<div style="color: #2c3e50; font-weight: bold; font-size: 24px;">🎉 ¡Éxito!</div>',
                        html: `
                            <div style="text-align: center; margin: 20px 0;">
                                <div style="
                                    background: linear-gradient(135deg, #4caf50, #66bb6a);
                                    color: white;
                                    padding: 20px;
                                    border-radius: 12px;
                                    margin-bottom: 20px;
                                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                                ">
                                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                                        ${nombrePublicacionMascota || 'Mascota'}
                                    </div>
                                    <div style="font-size: 14px; opacity: 0.9;">
                                        Estado cambiado a: <strong>${estadoNombre}</strong>
                                    </div>
                                    <div style="font-size: 12px; opacity: 0.7; margin-top: 5px;">
                                        ID: ${resultado.publicacionId} | Estado: ${resultado.nuevoEstado}
                                    </div>
                                </div>
                                
                                <p style="
                                    color: #666;
                                    font-size: 16px;
                                    margin: 0;
                                    line-height: 1.5;
                                ">
                                    La publicación fue actualizada exitosamente
                                </p>
                            </div>
                        `,
                        confirmButtonText: '✅ Perfecto',
                        confirmButtonColor: '#4caf50',
                        width: '450px',
                        padding: '20px',
                        background: '#ffffff',
                        customClass: {
                            container: 'swal-over-mui',
                            popup: 'swal2-popup-custom',
                            title: 'swal2-title-custom',
                            confirmButton: 'swal2-confirm-custom'
                        },
                        didOpen: () => {
                            const swalContainer = document.querySelector('.swal2-container');
                            if (swalContainer) {
                                swalContainer.style.zIndex = '9999';
                            }
                        }
                    });

                    onEstadoCambiado();
                } catch (error) {
                    console.error('Error al cambiar estado:', error);
                    Swal.fire({
                        title: '<div style="color: #2c3e50; font-weight: bold; font-size: 24px;">❌ Error</div>',
                        html: `
                            <div style="text-align: center; margin: 20px 0;">
                                <div style="
                                    background: linear-gradient(135deg, #f44336, #e57373);
                                    color: white;
                                    padding: 20px;
                                    border-radius: 12px;
                                    margin-bottom: 20px;
                                    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
                                ">
                                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">
                                        ${nombrePublicacionMascota || 'Mascota'}
                                    </div>
                                    <div style="font-size: 14px; opacity: 0.9;">
                                        No se pudo cambiar el estado
                                    </div>
                                </div>
                                
                                <p style="
                                    color: #666;
                                    font-size: 16px;
                                    margin: 0;
                                    line-height: 1.5;
                                ">
                                    Ocurrió un error al procesar la solicitud. Intentalo nuevamente.
                                </p>
                            </div>
                        `,
                        confirmButtonText: '🔄 Reintentar',
                        confirmButtonColor: '#f44336',
                        width: '450px',
                        padding: '20px',
                        background: '#ffffff',
                        customClass: {
                            container: 'swal-over-mui',
                            popup: 'swal2-popup-custom',
                            title: 'swal2-title-custom',
                            confirmButton: 'swal2-cancel-custom'
                        },
                        didOpen: () => {
                            const swalContainer = document.querySelector('.swal2-container');
                            if (swalContainer) {
                                swalContainer.style.zIndex = '9999';
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error al cargar estados:', error);
            mostrarAlertaError('Error al cargar los estados disponibles');
        } finally {
            onClose();
        }
    };

    // Este componente no renderiza nada, solo maneja el modal
    return null;
};

export default CambiarEstadoPublicacion;
