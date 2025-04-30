import React, { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Table, Input, Col, Label, Row } from "reactstrap";

const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const horasDisponibles = Array.from({ length: 17 }, (_, index) => `${7 + index}:00`); // 7:00 a 23:00

const Step2Refactored = () => {
    const { register, formState: { errors }, watch, setValue, trigger } = useFormContext();

    // Estados locales solo para manejar la UI de la tabla de horarios
    // Los valores reales se guardan en el form state de react-hook-form
    const [horariosDetalle, setHorariosDetalle] = useState(() => {
         // Inicializa el estado local basado en los valores del formulario si existen
        const initialHorarios = watch('horarios') || {};
        const initialDetalle = {};
        diasSemana.forEach(dia => {
            // Intenta parsear el string guardado o establece valores por defecto
            // Esta lógica de parseo es básica, habría que mejorarla si los formatos son variados
            const horarioDia = initialHorarios[dia] || "";
            let desdeM = "", hastaM = "", desdeT = "", hastaT = "", corrido = false;
             if (horarioDia.includes("Horario corrido")) {
                corrido = true;
                const times = horarioDia.match(/(\d{1,2}:\d{2})/g);
                if(times && times.length >= 2) {
                   desdeM = times[0]; // Asigna a mañana por simplicidad
                   hastaT = times[1]; // Asigna a tarde por simplicidad
                }
            } else if (horarioDia.includes("Turno Mañana") && horarioDia.includes("Turno Tarde")) {
                 const times = horarioDia.match(/(\d{1,2}:\d{2})/g);
                  if(times && times.length >= 4) {
                    desdeM = times[0]; hastaM = times[1]; desdeT = times[2]; hastaT = times[3];
                  }
            } else if (horarioDia.includes("Turno Mañana")) {
                 const times = horarioDia.match(/(\d{1,2}:\d{2})/g);
                 if(times && times.length >= 2) { desdeM = times[0]; hastaM = times[1]; }
            } else if (horarioDia.includes("Turno Tarde")) {
                 const times = horarioDia.match(/(\d{1,2}:\d{2})/g);
                 if(times && times.length >= 2) { desdeT = times[0]; hastaT = times[1]; }
            }
             initialDetalle[dia] = { desdeM, hastaM, desdeT, hastaT, corrido };
        });
        return initialDetalle;
    });


    const diasDesde = watch("diasDesde");
    const diasHasta = watch("diasHasta");

    // Función para actualizar el estado local y el valor del formulario
    const handleHorarioChange = useCallback((dia, campo, value) => {
        setHorariosDetalle(prev => {
            const newState = {
                ...prev,
                [dia]: { ...prev[dia], [campo]: value }
            };

            // Si se marca/desmarca "corrido", limpiar los campos de mañana/tarde no relevantes
            if (campo === 'corrido') {
                 newState[dia].hastaM = "";
                 newState[dia].desdeT = "";
                 if(value === false) { // Si se desmarca corrido, quizas limpiar todo? O solo los intermedios?
                    // Decide qué limpiar al desmarcar corrido. Limpiamos intermedios por ahora.
                 }
            }
            // Si se selecciona "corrido" y se cambia "desdeM", limpiar hastaM y desdeT
             if(newState[dia].corrido && campo === 'desdeM') {
                 newState[dia].hastaM = "";
                 newState[dia].desdeT = "";
             }
             // Si se selecciona "corrido" y se cambia "hastaT", limpiar hastaM y desdeT
              if(newState[dia].corrido && campo === 'hastaT') {
                 newState[dia].hastaM = "";
                 newState[dia].desdeT = "";
             }

            // Si NO es corrido y se cambia desdeM o hastaM, limpiar desdeT/hastaT si no tienen sentido? (Opcional)
            // if (!newState[dia].corrido && (campo === 'desdeM' || campo === 'hastaM')) { ... }


             // Generar el string concatenado y actualizar el formulario
            const { desdeM, hastaM, desdeT, hastaT, corrido } = newState[dia];
            let horarioString = "";
            if (corrido && desdeM && hastaT) {
                 horarioString = `Horario corrido desde ${desdeM} hasta ${hastaT}`;
            } else if (!corrido && desdeM && hastaM && desdeT && hastaT) {
                horarioString = `Turno Mañana desde ${desdeM} hasta ${hastaM} y Turno Tarde desde ${desdeT} hasta ${hastaT}`;
            } else if (!corrido && desdeM && hastaM) {
                horarioString = `Turno Mañana desde ${desdeM} hasta ${hastaM}`;
            } else if (!corrido && desdeT && hastaT) {
                 horarioString = `Turno Tarde desde ${desdeT} hasta ${hastaT}`;
            }

             // Actualizar el valor específico del día dentro del objeto 'horarios' en react-hook-form
            setValue(`horarios.${dia}`, horarioString, { shouldValidate: true, shouldDirty: true });
            trigger(`horarios.${dia}`); // Dispara validación para este campo si hay reglas

            return newState;
        });
    }, [setValue, trigger]);


    // Genera las opciones de días
    const generarOpcionesDias = () => {
        return diasSemana.map((dia, index) => (
            <option key={index} value={index + 1}>
                {dia.charAt(0).toUpperCase() + dia.slice(1)} {/* Capitaliza el día */}
            </option>
        ));
    };

     // Genera las opciones de horas
    const generarOpcionesHoras = () => {
        return horasDisponibles.map(hora => (
             <option key={hora} value={hora}>{hora}</option>
        ));
    };


    // Determina qué días mostrar en la tabla
    const diasAMostrar = diasSemana.filter((_, index) => {
        const diaNum = index + 1;
        return diaNum >= parseInt(diasDesde || "1", 10) && diaNum <= parseInt(diasHasta || "7", 10);
    });

    return (
        <div className="w-100">
            <h5 className="text-center mb-3">Indique el horario laboral</h5>

            {/* Selección de Rango de Días */}
            <Row className="justify-content-center mb-4">
                <Col md={5}>
                    <Label htmlFor="diasDesde">Días Laborables Desde:</Label>
                    <select
                        id="diasDesde"
                        className={`form-select ${errors.diasDesde ? "is-invalid" : ""}`}
                        {...register("diasDesde", { required: "Seleccione el día inicial" })}
                    >
                        <option value="">Seleccione...</option>
                        {generarOpcionesDias()}
                    </select>
                    {errors.diasDesde && <div className="invalid-feedback">{errors.diasDesde.message}</div>}
                </Col>
                <Col md={5}>
                    <Label htmlFor="diasHasta">Hasta:</Label>
                    <select
                        id="diasHasta"
                        className={`form-select ${errors.diasHasta ? "is-invalid" : ""}`}
                        {...register("diasHasta", {
                            required: "Seleccione el día final",
                             validate: (value) => parseInt(value || "0", 10) >= parseInt(diasDesde || "0", 10) || "El día final debe ser igual o posterior al inicial"
                        })}
                    >
                        <option value="">Seleccione...</option>
                        {generarOpcionesDias()}
                    </select>
                    {errors.diasHasta && <div className="invalid-feedback">{errors.diasHasta.message}</div>}
                </Col>
                 {/* Input oculto para registrar el objeto horarios y poder validarlo si es necesario */}
                 <input type="hidden" {...register('horarios', {
                      validate: (value) => {
                          // Ejemplo de validación: al menos un día debe tener horario definido
                          const tieneHorario = Object.values(value || {}).some(h => h && h.trim() !== "");
                          //return tieneHorario || "Debe definir el horario para al menos un día.";
                           // O simplemente true si no necesitas una validación compleja aquí
                           return true;
                      }
                  })} />
                 {errors.horarios && !errors.horarios.type && /* Evita mostrar error de campos hijos */ (
                    <Col xs={12} className="mt-2 text-danger text-center">
                         {typeof errors.horarios.message === 'string' ? errors.horarios.message : 'Error en horarios.'}
                    </Col>
                 )}
            </Row>

            {/* Tabla de Horarios Detallados */}
            {diasDesde && diasHasta && diasAMostrar.length > 0 && (
                <div className="table-responsive">
                    <Table striped bordered hover responsive className="text-center">
                        <thead className="table-light">
                            <tr>
                                <th>Día</th>
                                <th>Horario Corrido</th>
                                <th>Desde Mañana</th>
                                <th>Hasta Mañana</th>
                                <th>Desde Tarde</th>
                                <th>Hasta Tarde</th>
                            </tr>
                        </thead>
                        <tbody>
                            {diasAMostrar.map((dia) => {
                                const detalleDia = horariosDetalle[dia] || { desdeM: "", hastaM: "", desdeT: "", hastaT: "", corrido: false };
                                const isCorrido = detalleDia.corrido;
                                return (
                                <tr key={dia}>
                                    <td className="text-capitalize align-middle">{dia}</td>
                                    <td className="align-middle">
                                        <Input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={isCorrido}
                                            onChange={(e) => handleHorarioChange(dia, 'corrido', e.target.checked)}
                                        />
                                    </td>
                                    {/* Desde Mañana */}
                                    <td>
                                        <Input
                                            type="select"
                                            bsSize="sm" // Tamaño más pequeño
                                            className="form-select form-select-sm"
                                            value={detalleDia.desdeM}
                                            onChange={(e) => handleHorarioChange(dia, 'desdeM', e.target.value)}
                                            // Deshabilitado si no es corrido Y se ha definido turno tarde? Lógica compleja.
                                            // Por ahora, siempre habilitado si no es corrido.
                                            // disabled={!isCorrido && detalleDia.desdeT} // Ejemplo lógica compleja
                                        >
                                            <option value="">-</option>
                                            {generarOpcionesHoras()}
                                        </Input>
                                    </td>
                                     {/* Hasta Mañana */}
                                    <td>
                                         <Input
                                             type="select"
                                             bsSize="sm"
                                             className="form-select form-select-sm"
                                             value={detalleDia.hastaM}
                                             onChange={(e) => handleHorarioChange(dia, 'hastaM', e.target.value)}
                                             disabled={isCorrido} // Deshabilitado si es corrido
                                              // Validar que hastaM > desdeM (se haría en la lógica de handleHorarioChange o con validate en register si fuera un campo directo)
                                         >
                                             <option value="">-</option>
                                             {generarOpcionesHoras()}
                                         </Input>
                                    </td>
                                     {/* Desde Tarde */}
                                    <td>
                                         <Input
                                             type="select"
                                             bsSize="sm"
                                             className="form-select form-select-sm"
                                             value={detalleDia.desdeT}
                                             onChange={(e) => handleHorarioChange(dia, 'desdeT', e.target.value)}
                                             disabled={isCorrido} // Deshabilitado si es corrido
                                              // Validar que desdeT > hastaM
                                         >
                                             <option value="">-</option>
                                             {generarOpcionesHoras()}
                                         </Input>
                                    </td>
                                     {/* Hasta Tarde */}
                                    <td>
                                         <Input
                                             type="select"
                                             bsSize="sm"
                                             className="form-select form-select-sm"
                                             value={detalleDia.hastaT}
                                             onChange={(e) => handleHorarioChange(dia, 'hastaT', e.target.value)}
                                             // No deshabilitar este si es corrido, es el límite final
                                             // Validar que hastaT > desdeT (si existe) o hastaT > desdeM (si es corrido)
                                         >
                                             <option value="">-</option>
                                             {generarOpcionesHoras()}
                                         </Input>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                 </div>
            )}

            {/* Los botones de navegación ahora están en AddVeterinariaRefactored */}
        </div>
    );
};

export default Step2Refactored;