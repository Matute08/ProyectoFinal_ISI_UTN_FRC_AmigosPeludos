import React from "react";
import { useFormContext } from "react-hook-form";
import { Col, Form, Row, Label, Input } from "reactstrap";

const Step3Refactored = () => {
    const { register, formState: { errors }, watch } = useFormContext();

     // Define los servicios para generar los checkboxes dinámicamente
    const serviciosList = [
        { id: 'castraciones', label: 'Castraciones' },
        { id: 'internaciones', label: 'Internaciones' },
        { id: 'vacunaciones', label: 'Vacunaciones' },
        { id: 'equipoLaboratorio', label: 'Extracciones de Sangre / Laboratorio' },
        { id: 'radiografias', label: 'Radiografías' },
        { id: 'ecografias', label: 'Ecografías' },
        { id: 'guardia24hs', label: 'Guardias 24hs' },
        { id: 'emergencias', label: 'Emergencias a Domicilio' },
        { id: 'observaciones', label: 'Observaciones Gratuitas (?)' } // Revisar si es correcto el label
    ];

    return (
        <div className="w-100">
            <h5 className="text-center mb-4">Servicios Ofrecidos</h5>
            {/* Input oculto para validación general del objeto servicios si es necesario */}
             <input type="hidden" {...register('servicios', {
                 // validate: (value) => Object.values(value || {}).some(v => v === true) || "Debe seleccionar al menos un servicio"
                 validate: () => true // O validación más compleja si es necesario
             })} />
             {errors.servicios && !errors.servicios.type && (
                <p className="text-danger text-center small">{errors.servicios.message}</p>
             )}

            <Row className="justify-content-center">
                {serviciosList.map(servicio => (
                     <Col key={servicio.id} md={6} lg={4} className="mb-3">
                         <div className="form-check form-switch"> {/* Usar form-switch para un look más moderno */}
                             <Input
                                 type="checkbox"
                                 className="form-check-input"
                                 id={`servicio-${servicio.id}`}
                                 role="switch"
                                 {...register(`servicios.${servicio.id}`)} // Registra directamente como booleano
                             />
                             <Label className="form-check-label" htmlFor={`servicio-${servicio.id}`}>
                                 {servicio.label}
                             </Label>
                             {/* Los errores específicos por campo son menos comunes con checkboxes, pero se podrían añadir */}
                         </div>
                    </Col>
                 ))}

                {/* Otros Servicios */}
                <Col xs={12} className="mb-3">
                    <Label htmlFor="servicios-otros" className="form-label">Otros Servicios (Opcional)</Label>
                    <textarea
                        id="servicios-otros"
                        rows={3}
                        className={`form-control ${errors.servicios?.otros ? "is-invalid" : ""}`}
                        placeholder="Describa otros servicios ofrecidos"
                        {...register("servicios.otros", {
                             // Puedes añadir validaciones como maxLength si es necesario
                             setValueAs: v => v === "" ? null : v // Guarda null si está vacío
                        })}
                    />
                    {errors.servicios?.otros && (
                         <div className="invalid-feedback">{errors.servicios.otros.message}</div>
                    )}
                </Col>
            </Row>

            {/* Los botones de navegación ahora están en AddVeterinariaRefactored */}
        </div>
    );
};

export default Step3Refactored;