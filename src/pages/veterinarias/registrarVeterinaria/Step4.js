import React from "react";
import { useFormContext } from "react-hook-form";
import { Col, Row, Label, Input } from "reactstrap";

const Step4Refactored = () => {
    const { register, formState: { errors }, watch } = useFormContext();

    // Observa si acepta transferencias para mostrar/ocultar el CBU
    const aceptaTransferencias = watch("aceptaTransferencias");

    const handleKeyPressNumeric = (e) => {
        const regex = /^[0-9\b]+$/;
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <Row className="w-75">
                <h5 className="text-center mb-3">Donaciones</h5>
                <p className="text-muted mb-4 text-center small">
                    Si aceptas donaciones, personas podrán colaborar a través de la plataforma
                    para cubrir costos de tratamientos de mascotas necesitadas en tu veterinaria.
                    Si aceptas, te pediremos un CBU/Alias para recibir las transferencias.
                </p>

                {/* Acepta Donaciones? */}
                <Col xs={12} className="mb-3">
                    <Label htmlFor="aceptaTransferencias" className="form-label">¿Aceptas recibir donaciones?</Label>
                    <select
                        id="aceptaTransferencias"
                        className={`form-select ${errors.aceptaTransferencias ? "is-invalid" : ""}`}
                        {...register("aceptaTransferencias", { required: "Selecciona una opción" })}
                    >
                        <option value="" disabled>Seleccione...</option>
                        <option value="Si">Sí, acepto donaciones</option>
                        <option value="No">No, por ahora no</option>
                    </select>
                    {errors.aceptaTransferencias && (
                        <div className="invalid-feedback">{errors.aceptaTransferencias.message}</div>
                    )}
                </Col>

                {/* CBU (Condicional) */}
                {aceptaTransferencias === "Si" && (
                    <Col xs={12} className="mb-3">
                        <Label htmlFor="cbu" className="form-label">CBU o Alias</Label>
                        <input
                            id="cbu"
                            type="text"
                            maxLength={22} // CBU tiene 22 dígitos, Alias puede variar
                            className={`form-control ${errors.cbu ? "is-invalid" : ""}`}
                            placeholder="Ingresa tu CBU (22 dígitos) o Alias"
                            {...register("cbu", {
                                required: "El CBU/Alias es obligatorio si aceptas donaciones",
                                // Validación más específica para CBU/Alias si es necesaria
                                // pattern: { value: /^[0-9]{22}$/, message: 'CBU inválido (22 dígitos)' }
                                // O una validación más flexible para Alias
                                validate: value => (value && value.length > 3) || "Ingresa un CBU o Alias válido"

                            })}
                            onKeyPress={handleKeyPressNumeric} // Solo si esperas CBU numérico
                        />
                        {errors.cbu && (
                            <div className="invalid-feedback">{errors.cbu.message}</div>
                        )}
                    </Col>
                )}
                {/* Campo oculto para estadoId si no se gestiona en otro lado */}
                <input type="hidden" {...register('estadoId')} />
                {/* Campo oculto para usuarioId si no se gestiona en otro lado */}
                <input type="hidden" {...register('usuarioId')} />

                 {/* Los botones de navegación ahora están en AddVeterinariaRefactored */}
            </Row>
        </div>
    );
};

export default Step4Refactored;