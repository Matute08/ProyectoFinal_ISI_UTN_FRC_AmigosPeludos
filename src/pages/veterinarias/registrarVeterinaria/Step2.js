import React, { useState, useEffect } from "react";
import { Form } from "reactstrap";
import { Table, Input, Col } from "reactstrap";
import { useForm } from "react-hook-form";

const Step2 = ({ onNext, onPrev, step1Data }) => {
    const [horarios, setHorarios] = useState({
        lunes: ["", "", "", ""],
        martes: ["", "", "", ""],
        miercoles: ["", "", "", ""],
        jueves: ["", "", "", ""],
        viernes: ["", "", "", ""],
        sabado: ["", "", "", ""],
        domingo: ["", "", "", ""],
    });

    const [checkBoxState, setCheckBoxState] = useState({
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
    });

    const [diasDesde, setDiasDesde] = useState(0);
    const [horariosConcatenados, setHorariosConcatenados] = useState();
    const [diasHasta, setDiasHasta] = useState(0);

    const handleDiasDesdeChange = (e) => {
        setDiasDesde(Number(e.target.value));
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm();

    const onSubmit = async (data) => {
        const isValid = await trigger();
        if (isValid) {
            data.horarios = horariosConcatenados;
            console.log(data.horarios);
            onNext({ ...step1Data, ...data });
        }
    };

    const handleDiasHastaChange = (e) => {
        setDiasHasta(Number(e.target.value));
    };

    const handleCheckBoxChange = (dia, value) => {
        setCheckBoxState((prevState) => ({
            ...prevState,
            [dia]: value,
        }));
    };

    const generarTabla = () => {
        if (diasDesde === 0 || diasHasta === 0) {
            return null;
        }

        const diasSeleccionados = [...Array(7).keys()].slice(
            diasDesde - 1,
            diasHasta
        );

        return (
            <Table striped bordered responsive>
                <thead>
                    <tr>
                        <th>Día</th>
                        <th>Trabaja</th>
                        <th>Desde Turno Mañana</th>
                        <th>Hasta Turno Mañana</th>
                        <th>Desde Turno Tarde</th>
                        <th>Hasta Turno Tarde</th>
                    </tr>
                </thead>
                <tbody>
                {Object.keys(horarios).map(
                    (dia, index) =>
                        diasSeleccionados.includes(index) && (
                            <tr key={dia}>
                                <td>{dia}</td>
                                <td>
                                    <Input
                                        type="checkbox"
                                        checked={checkBoxState[dia]}
                                        onChange={(e) =>
                                            handleCheckBoxChange(
                                                dia,
                                                e.target.checked
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={horarios[dia][0]}
                                        onChange={(e) =>
                                            handleHorarioChange(
                                                dia,
                                                0,
                                                e.target.value
                                            )
                                        }
                                        //disabled={checkBoxState[dia]}
                                    >
                                        <option value="">
                                            Seleccione...
                                        </option>
                                        <option value="8am">8am</option>
                                        <option value="9am">9am</option>
                                    </Input>
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={horarios[dia][1]}
                                        onChange={(e) =>
                                            handleHorarioChange(
                                                dia,
                                                1,
                                                e.target.value
                                            )
                                        }
                                        disabled={checkBoxState[dia]}
                                    >
                                        <option value="">
                                            Seleccione...
                                        </option>
                                        <option value="8:00">8:00</option>
                                        <option value="8:15">8:15</option>
                                    </Input>
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={horarios[dia][2]}
                                        onChange={(e) =>
                                            handleHorarioChange(
                                                dia,
                                                2,
                                                e.target.value
                                            )
                                        }
                                        disabled={checkBoxState[dia]}
                                    >
                                        <option value="">
                                            Seleccione...
                                        </option>
                                        <option value="13:00">13:00</option>
                                        <option value="14:00">14:00</option>
                                    </Input>
                                </td>
                                <td>
                                    <Input
                                        type="select"
                                        value={horarios[dia][3]}
                                        onChange={(e) =>
                                            handleHorarioChange(
                                                dia,
                                                3,
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Seleccione...
                                        </option>
                                        <option value="17:00">17:00</option>
                                        <option value="18:00">18:00</option>
                                    </Input>
                                </td>
                            </tr>
                        )
                )}
                </tbody>
            </Table>
        );
    };

    const handleHorarioChange = (dia, turno, value) => {
        setHorarios((prevHorarios) => ({
            ...prevHorarios,
            [dia]: prevHorarios[dia].map((horario, index) =>
                index === turno ? value : horario
            ),
        }));
    };

    const generarHorariosConcatenados = () => {
        const horariosConcatenados = {};
        for (const dia in horarios) {
            const [desdeManana, hastaManana, desdeTarde, hastaTarde] =
                horarios[dia];
            if (desdeManana && hastaManana && desdeTarde && hastaTarde) {
                horariosConcatenados[
                    dia
                ] = `Turno Mañana desde ${desdeManana} hasta ${hastaManana} y Turno Tarde desde ${desdeTarde} hasta ${hastaTarde}`;
            } else if (desdeManana && hastaTarde) {
                horariosConcatenados[
                    dia
                ] = `Horario corrido desde ${desdeManana} hasta ${hastaTarde}`;
            } else {
                const turnos = [];
                if (desdeManana && hastaManana) {
                    turnos.push(
                        `Turno Mañana desde ${desdeManana} hasta ${hastaManana}`
                    );
                }
                if (desdeTarde && hastaTarde) {
                    turnos.push(
                        `Turno Tarde desde ${desdeTarde} hasta ${hastaTarde}`
                    );
                }
                horariosConcatenados[dia] = turnos.join(" y ");
            }
        }

        return horariosConcatenados;
    };

    useEffect(() => {
        const hsConcatenados = generarHorariosConcatenados();
        setHorariosConcatenados(hsConcatenados);
    }, [horarios]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)} className="form-step">
            <div className="w-100 text-center">
                <h5>Indique el horario laboral de la veterinaria</h5>
                <p>Seleccione los días laborables</p>
                <div className="d-flex justify-content-center">
                    <div className="m-3">
                        <label>Desde:</label>
                        <select
                            type="select"
                            name="diasDesde"
                            className={`form-select ${
                                errors.diasDesde ? "is-invalid" : ""
                            }`}
                            {...register("diasDesde", {
                                required: "Seleccione una opción",
                            })}
                            onChange={handleDiasDesdeChange}
                        >
                            <option value={""}>
                                Seleccione el día inicial
                            </option>
                            <option value={1}>Lunes</option>
                            <option value={2}>Martes</option>
                            <option value={3}>Miércoles</option>
                            <option value={4}>Jueves</option>
                            <option value={5}>Viernes</option>
                            <option value={6}>Sábado</option>
                            <option value={7}>Domingo</option>
                        </select>
                        {errors.diasDesde && (
                            <div className="invalid-feedback">
                                {errors.diasDesde.message}
                            </div>
                        )}
                    </div>

                    <div className="m-3">
                        <label>Hasta:</label>
                        <select
                            type="select"
                            name="diasHasta"
                            className={`form-select ${
                                errors.diasHasta ? "is-invalid" : ""
                            }`}
                            {...register("diasHasta", {
                                required: "Seleccione una opción",
                            })}
                            onChange={handleDiasHastaChange}
                        >
                            <option value={""}>
                                Seleccione el día inicial
                            </option>
                            <option value={1}>Lunes</option>
                            <option value={2}>Martes</option>
                            <option value={3}>Miércoles</option>
                            <option value={4}>Jueves</option>
                            <option value={5}>Viernes</option>
                            <option value={6}>Sábado</option>
                            <option value={7}>Domingo</option>
                        </select>
                        {errors.diasHasta && (
                            <div className="invalid-feedback">
                                {errors.diasHasta.message}
                            </div>
                        )}
                    </div>
                </div>
                {generarTabla()}
                <Col className="button-container">
                    {onPrev && (
                        <button className="btn-next-paseador" onClick={onPrev}>
                            <span className="transition transition-back"></span>
                            <span className="gradient"></span>
                            <span className="label">Atrás</span>
                        </button>
                    )}

                    <button className="btn-next-paseador" type="submit">
                        <span className="transition"></span>
                        <span className="gradient"></span>
                        <span className="label">Siguiente</span>
                    </button>
                </Col>
            </div>
        </Form>
    );
};

export default Step2;
