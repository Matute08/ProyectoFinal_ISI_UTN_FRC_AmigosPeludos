import React, { useState, useEffect } from "react";
import {
    getTipoMascota,
    getAllRazaId,
    getSexoMascota,
    getCiudad,
    getAllBarrio,
} from "../../services/Api";
import Loading from "./Loading";
import { Col } from "reactstrap";

const FilterPets = ({ cardsData }) => {
    const [isLoading, setIsLoading] = useState(true);

    const [tiposMascota, setTipoMascota] = useState([]);
    const [raza, setRaza] = useState([]);
    const [sexo, setSexo] = useState([]);
    const [ciudad, setCiudad] = useState([]);
    const [barrio, setBarrio] = useState([]);
    const [isRazaEnabled, setIsRazaEnabled] = useState(false); // Nuevo estado para habilitar/deshabilitar el campo de raza

    //tipo de mascota
    useEffect(() => {
        const fetchData = async () => {
            try {
                const tipo = await getTipoMascota();
                if (tipo) {
                    setTipoMascota(tipo);
                    setIsLoading(false);
                }
            } catch (error) {
                // Manejo de errores
            }
        };

        fetchData();
    }, []);

    //sexo
    useEffect(() => {
        const fetchSexo = async () => {
            try {
                const sexo = await getSexoMascota();
                if (sexo) {
                    setSexo(sexo);
                }
            } catch (error) {
                // Manejo de errores
            }
        };
        fetchSexo();
    }, []);

    //ciudad
    useEffect(() => {
        const fetchCiudad = async () => {
            try {
                const ciudad = await getCiudad();
                if (ciudad) {
                    setCiudad(ciudad);
                }
            } catch (error) {
                // Manejo de errores
            }
        };
        fetchCiudad();
    }, []);
    //barrio
    useEffect(() => {
        const fetchBarrio = async () => {
            try {
                const barrio = await getAllBarrio();
                if (barrio) {
                    setBarrio(barrio);
                }
            } catch (error) {
                // Manejo de errores
            }
        };
        fetchBarrio();
    }, []);

    //raza
    const getRaza = async (e) => {
        const op = e.target.value;
        setRaza(await getAllRazaId(op));
    };

    // Función para habilitar el campo de raza cuando se selecciona un tipo de mascota
    const handleTipoMascotaChange = (e) => {
        const tipoMascotaId = e.target.value;
        setIsRazaEnabled(!!tipoMascotaId); // Habilitar el campo de raza si tipoMascotaId tiene valor
        getRaza(e);
    };

    return (
        <React.Fragment>
            {!isLoading ? (
                <>
                
                    <Col lg={2}>
                        <div className="mb-3">
                            <label className="form-label">
                                Tipo de mascota:
                            </label>
                            <select
                                className="form-select "
                                onChange={handleTipoMascotaChange}
                            >
                                <option value="">Seleccione...</option>
                                {tiposMascota.map((elemento) => (
                                    <option
                                        className="form-control"
                                        key={elemento.id}
                                        value={elemento.id}
                                    >
                                        {elemento.tipo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Col>

                    <Col lg={2}>
                        <div className="mb-3">
                            <label>Raza:</label>
                            <select
                                name="raza"
                                className="form-select "
                                disabled={!isRazaEnabled} // Deshabilitar el campo de raza si no está habilitado
                            >
                                <option value="">Seleccione...</option>
                                {raza &&
                                    raza.map((elemento) => (
                                        <option
                                            className="form-control"
                                            key={elemento.id}
                                            value={elemento.id}
                                        >
                                            {elemento.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </Col>

                    <Col lg={2}>
                        <div className="mb-3">
                            <label>Sexo:</label>
                            <select name="sexo" className="form-select ">
                                <option value="">Seleccione...</option>
                                {sexo &&
                                    sexo.map((elemento) => (
                                        <option
                                            className="form-control"
                                            key={elemento.id}
                                            value={elemento.id}
                                        >
                                            {elemento.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </Col>
                    <Col lg={2}>
                        <div className="mb-3">
                            <label>Ciudad:</label>
                            <select
                                name="ciudad"
                                className="form-select "
                            >
                                <option value="">Seleccione...</option>
                                {ciudad &&
                                    ciudad.map((elemento) => (
                                        <option
                                            className="form-control"
                                            key={elemento.id}
                                            value={elemento.id}
                                        >
                                            {elemento.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </Col>
                    <Col lg={2}>
                        <div className="mb-3">
                            <label>Barrio:</label>
                            <select
                                name="barrio"
                                className="form-select "
                            >
                                <option value="">Seleccione...</option>
                                {barrio &&
                                    barrio.map((elemento) => (
                                        <option
                                            className="form-control"
                                            key={elemento.id}
                                            value={elemento.id}
                                        >
                                            {elemento.nombre}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </Col>
                    <Col lg={12}>
                        <div className="button-filter w-100 d-flex justify-content-center">
                            <button className="btn btn-success mt-2 acept">
                                Aplicar 
                            </button>

                            <button className="btn btn-danger mt-2 clean">
                                Limpiar 
                            </button>
                        </div>
                     
                    </Col>
                  
                </>
            ) : (
                <>
                    <Loading></Loading>
                </>
            )}
        </React.Fragment>
    );
};

export default FilterPets;
