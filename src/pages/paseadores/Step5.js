import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { useNavigate } from "react-router-dom";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Loading from "../components/Loading";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const Step5 = ({ onNext, onPrevious, step1Data, step2Data, step3Data,step4Data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [errorFile, setErrorFile] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const allData = {
            ...step1Data,
            ...step2Data,
            ...step3Data,
            ...step4Data,
            ...data,
        };

        console.log(allData);
        console.log(files)
        onNext(allData);
        // Puedes enviar 'allData' a la base de datos aquí
        setIsLoading(true); // Activar isLoading antes de redirigir
        
        setTimeout(() => {
            setIsLoading(false); // Desactivar isLoading después de 3 segundos
            onNext(allData);
            navigate("/paseadores");
        }, 4000); // 4000 ms (4 segundos)
    
       // navigate("/paseadores");
    };

    return (
        <>
        {isLoading && <Loading />}
        
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                               {/* ARCHIVOS */}
                <Col lg={12} className="d-flex justify-content-center">
                    <div className="text-center ">
                        {/* NOMBRE MASCOTA */}
                        <h5 className="fs-16 mb-1 ">
                            Fotos <span className="text-danger">*</span>
                        </h5>
                        <p>
                            Adjunta imagenes donde se aprecie el paseo de las
                            mascotas que has realizado
                        </p>
                        {/* FOTO DE LA MASCOTA */}
                        <FilePond
                            files={files}
                            onupdatefiles={setFiles}
                            acceptedFileTypes={["image/png", "image/jpeg"]}
                            allowMultiple={true}
                            maxFiles={4}
                            name="files"
                            className="filepond filepond-input-multiple"
                            labelIdle="Arrastra y suelta tus archivos o buscalos "
                        />
                        <p className="text-danger">{errorFile}</p>
                    </div>
                </Col>

                {/* botones de navegación */}
            </Row>
            <Col className="button-container">
                {onPrevious && (
                    <button className="btn-next-paseador" onClick={onPrevious}>
                        <span class="transition transition-back"></span>
                        <span class="gradient"></span>
                        <span class="label">Atras</span>
                    </button>
                )}

                <button className="btn-next-paseador" type="submit">
                    <span class="transition"></span>
                    <span class="gradient"></span>
                    <span class="label">Finalizar</span>
                </button>
            </Col>
        </Form>
        </>
    );
};

export default Step5;
