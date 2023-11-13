import React, { useState, useEffect } from "react";
import {
    getTipoMascota,
    getAllRazaId,
    getSexoMascota,
    getCiudad,
    getAllBarrio,
} from "../../services/api";
import Loading from "./Loading";
import { Col } from "reactstrap";

const FilterPets = ({ cardsData, setPublicacionesFiltradas }) => {
    const [isLoading, setIsLoading] = useState(true);

    const [tiposMascota, setTipoMascota] = useState([]);
    const [raza, setRaza] = useState([]);
    const [sexo, setSexo] = useState([]);
    const [ciudad, setCiudad] = useState([]);
    const [barrio, setBarrio] = useState([]);
    const [isRazaEnabled, setIsRazaEnabled] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tipo = await getTipoMascota();
                if (tipo) {
                    setTipoMascota(tipo);
                }
            } catch (error) {
                // Manejo de errores
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleTipoMascotaChange = async (e) => {
        const tipoMascotaId = e.target.value;
        setIsRazaEnabled(!!tipoMascotaId);

        try {
            const razaData = await getAllRazaId(tipoMascotaId);
            if (razaData) {
                setRaza(razaData);
            }
        } catch (error) {
            // Manejo de errores
        }
    };

    useEffect(() => {
        const fetchSexo = async () => {
            try {
                const sexoData = await getSexoMascota();
                if (sexoData) {
                    setSexo(sexoData);
                }
            } catch (error) {
                // Manejo de errores
            }
        };
        fetchSexo();
    }, []);

    useEffect(() => {
        const fetchCiudad = async () => {
            try {
                const ciudadData = await getCiudad();
                if (ciudadData) {
                    setCiudad(ciudadData);
                }
            } catch (error) {
                // Manejo de errores
            }
        };
        fetchCiudad();
    }, []);

    useEffect(() => {
        const fetchBarrio = async () => {
            try {
                const barrioData = await getAllBarrio();
                if (barrioData) {
                    setBarrio(barrioData);
                }
            } catch (error) {
                // Manejo de errores
            }
        };
        fetchBarrio();
    }, []);

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
                                className="form-select"
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
                                className="form-select"
                                disabled={!isRazaEnabled}
                            >
                                <option value="">Seleccione...</option>
                                {raza.map((elemento) => (
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
                            <select name="sexo" className="form-select">
                                <option value="">Seleccione...</option>
                                {sexo.map((elemento) => (
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
                            <select name="ciudad" className="form-select">
                                <option value="">Seleccione...</option>
                                {ciudad.map((elemento) => (
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
                            <select name="barrio" className="form-select">
                                <option value="">Seleccione...</option>
                                {barrio.map((elemento) => (
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
                <Loading></Loading>
            )}
        </React.Fragment>
    );
};

export default FilterPets;
