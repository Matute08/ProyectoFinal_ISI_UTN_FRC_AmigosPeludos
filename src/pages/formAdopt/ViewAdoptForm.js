import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { getFormulariosId } from "../../services/api";

const ViewAdoptForm = ({ isOpen, toggle, selectedFormData }) => {
    const [dataForm, setDataForm] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchForm = async () => {
            if (selectedFormData) {
                const data = await getFormulariosId(selectedFormData);
                setDataForm(data);
                setIsLoading(false);
            }
        };
        console.log("====================================");
        console.log(dataForm);
        console.log("====================================");

        if (selectedFormData) {
            fetchForm();
        }
    }, [selectedFormData]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Los meses son indexados desde 0
        const year = date.getFullYear();
        return `${day < 10 ? "0" : ""}${day}/${
            month < 10 ? "0" : ""
        }${month}/${year}`;
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>DATOS DEL FORMULARIO</ModalHeader>
            <ModalBody>
                <div className="text-center">
                    <h3>Formulario de Adopción</h3>
                </div>

                <div className="p-3">
                    <div>
                        <div className="d-flex">
                            <p className="label">Nombre Completo:</p>
                            <p>
                                {dataForm
                                    ? `${dataForm.nombre} ${dataForm.apellido}`
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">DNI:</p>
                            <p>{dataForm ? dataForm.dni : ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">Celular:</p>
                            <p>{dataForm ? dataForm.celular : ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">Ciudad:</p>
                            <p>{dataForm ? "Cordoba" : ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">Barrio:</p>
                            <p>{dataForm ? dataForm.barrio : ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">Dirección:</p>
                            <p>
                                {dataForm
                                    ? `${dataForm.calle} ${dataForm.nroCalle}`
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">Tipo Vivienda:</p>
                            <p>{dataForm ? dataForm.tipoVivienda : ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">¿Propietario o Inquilino?:</p>
                            <p>
                                {dataForm
                                    ? dataForm.estadoResidencia
                                        ? "Inquilino"
                                        : "Propietario"
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">¿Aceptan Mascotas?:</p>
                            <p>
                                {dataForm
                                    ? dataForm.aceptaMascota
                                        ? "Si"
                                        : "No"
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">¿Cerramiento?:</p>
                            <p>
                                {dataForm
                                    ? dataForm.viviendaCerrada
                                        ? "Si"
                                        : "No"
                                    : ""}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">¿Otras Mascotas?:</p>
                            <p>{dataForm ? dataForm.otrasMascotas : ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">Estado Adopción:</p>
                            <p>{dataForm ? dataForm.estadoFormulario : ""}</p>
                        </div>
                    </div>

                    <div>
                        <div className="d-flex">
                            <p className="label">Fecha de Creación:</p>
                            <p>
                                {dataForm
                                    ? `${formatDate(dataForm.fechaAlta)}`
                                    : ""}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Agrega más campos según la estructura de tu formulario */}
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    Cerrar
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ViewAdoptForm;
