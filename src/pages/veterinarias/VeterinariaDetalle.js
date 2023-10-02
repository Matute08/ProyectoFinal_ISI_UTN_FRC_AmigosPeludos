import React from "react";
import { Link } from "react-router-dom";

const VeterinariaDetalle = ({ veterinaria, onClose }) => {
    if (!veterinaria) {
        return null;
    }

    // Determinar si la veterinaria es de Google Places o registrada
    const fuente = veterinaria.fuente;

    return (
        <div className="veterinaria-detail">
            <div className="d-flex justify-content-end">
                <button className="close-button " onClick={onClose}>
                    X
                </button>
            </div>

            {fuente !== "registrada" && (
                <div>
                    <h3>{veterinaria.name}</h3>
                    <p>Dirección: {veterinaria.vicinity}</p>
                    <p>Valoración: {veterinaria.rating}</p>
                    {/* Información específica de veterinarias de Google Places */}
                    {/* Agrega aquí cualquier información adicional de Google Places */}
                </div>
            )}

            {fuente === "registrada" && (
                <div>
                    {/* Información específica de veterinarias registradas */}
                    <h3>{veterinaria.nombre}</h3>
                    <p>
                        Dirección: {veterinaria.direccion}{" "}
                        {veterinaria.numeroCalle}
                    </p>
                    <p>Teléfono: {veterinaria.numeroTelefono}</p>

                    {/* Mostrar horarios */}
                    <p>Horarios:</p>
                    <ul>
                        <li>
                            Lunes:{" "}
                            {veterinaria.horarios && veterinaria.horarios.lunes
                                ? veterinaria.horarios.lunes
                                : "Cerrado"}
                        </li>
                        <li>
                            Martes:{" "}
                            {veterinaria.horarios && veterinaria.horarios.martes
                                ? veterinaria.horarios.martes
                                : "Cerrado"}
                        </li>
                        <li>
                            Miércoles:{" "}
                            {veterinaria.horarios &&
                            veterinaria.horarios.miercoles
                                ? veterinaria.horarios.miercoles
                                : "Cerrado"}
                        </li>
                        <li>
                            Jueves:{" "}
                            {veterinaria.horarios && veterinaria.horarios.jueves
                                ? veterinaria.horarios.jueves
                                : "Cerrado"}
                        </li>
                        <li>
                            Viernes:{" "}
                            {veterinaria.horarios &&
                            veterinaria.horarios.viernes
                                ? veterinaria.horarios.viernes
                                : "Cerrado"}
                        </li>
                        <li>
                            Sábado:{" "}
                            {veterinaria.horarios && veterinaria.horarios.sabado
                                ? veterinaria.horarios.sabado
                                : "Cerrado"}
                        </li>
                        <li>
                            Domingo:{" "}
                            {veterinaria.horarios &&
                            veterinaria.horarios.domingo
                                ? veterinaria.horarios.domingo
                                : "Cerrado"}
                        </li>
                    </ul>

                    <Link
                        className="btn-next-paseador btn-next "
                        type="submit"
                        to={`perfil-veterinaria/${
                            veterinaria && veterinaria.id
                        }`}
                    >
                        <span class="transition"></span>
                        <span class="gradient"></span>
                        <span class="label">Ver Servicios</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default VeterinariaDetalle;
