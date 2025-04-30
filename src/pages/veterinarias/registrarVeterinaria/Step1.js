import React, { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Col, Form, Row, Label } from "reactstrap";
import { getAllBarrio } from "../../../services/commonApi"; // Ajusta la ruta
import Map from "../../components/maps/MapaUbicacionParticular"; // Ajusta la ruta
import Loading from "../../components/Loading"; // Ajusta la ruta

const Step1Refactored = () => {
    const { register, formState: { errors }, setValue, watch, trigger } = useFormContext();
    const [isLoading, setIsLoading] = useState(true);
    const [barrios, setBarrios] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: -31.41894, lng: -64.19353 }); // Centro inicial Córdoba

    // Observa los campos de dirección para actualizar el mapa
    const direccion = watch("direccion");
    const altura = watch("numeroCalle");
    const selectedBarrioId = watch("barrioId"); // Observa el ID del barrio

    // Carga los barrios
    useEffect(() => {
        const fetchBarrio = async () => {
            setIsLoading(true);
            try {
                const barrioData = await getAllBarrio();
                setBarrios(barrioData.data || []); // Asegúrate que sea un array
            } catch (error) {
                console.error("Error al cargar barrios:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBarrio();
    }, []);

    // Función para manejar el clic en el mapa y actualizar lat/lng
    const handleMapInteraction = useCallback((lat, lng) => {
        // Redondea a 5 decimales como en tu código original
        const roundedLat = Number(lat.toFixed(5));
        const roundedLng = Number(lng.toFixed(5));
        setValue('latitud', roundedLat, { shouldValidate: true });
        setValue('longitud', roundedLng, { shouldValidate: true });
        setMapCenter({ lat: roundedLat, lng: roundedLng }); // Actualiza el centro del mapa al hacer clic
         // Opcional: disparar validación si tienes reglas específicas para lat/lng
        trigger(['latitud', 'longitud']);
    }, [setValue, trigger]);

    // Encuentra el nombre del barrio seleccionado para pasar al mapa
     const selectedBarrioNombre = barrios.find(b => b.id === parseInt(selectedBarrioId, 10))?.nombre || "";


    // Función para permitir solo números en ciertos inputs
    const handleKeyPressNumeric = (e) => {
        const regex = /^[0-9\b]+$/; // Permite números y backspace
        if (!regex.test(e.key)) {
            e.preventDefault();
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        // No necesitas <Form> aquí porque está en el componente padre AddVeterinariaRefactored
        <Row>
            {/* Nombre Veterinaria */}
            <Col md={6} className="mb-3">
                <Label htmlFor="nombre" className="form-label">Nombre Veterinaria</Label>
                <input
                    id="nombre"
                    type="text"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    placeholder="Nombre de la Veterinaria"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
            </Col>

            {/* Barrio */}
            <Col md={6} className="mb-3">
                <Label htmlFor="barrioId" className="form-label">Barrio</Label>
                <select
                    id="barrioId"
                    className={`form-select ${errors.barrioId ? "is-invalid" : ""}`}
                    {...register("barrioId", { required: "Seleccione un barrio" })}
                >
                    <option value="">Seleccione...</option>
                    {barrios.map((barrio) => (
                        <option key={barrio.id} value={barrio.id}>
                            {barrio.nombre}
                        </option>
                    ))}
                </select>
                {errors.barrioId && <div className="invalid-feedback">{errors.barrioId.message}</div>}
            </Col>

            {/* Dirección */}
            <Col md={5} className="mb-3">
                <Label htmlFor="direccion" className="form-label">Dirección (Calle)</Label>
                <input
                    id="direccion"
                    type="text"
                    className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                    placeholder="Ej: Sarmiento"
                    {...register("direccion", { required: "La dirección es obligatoria" })}
                />
                {errors.direccion && <div className="invalid-feedback">{errors.direccion.message}</div>}
            </Col>

            {/* Número Calle */}
            <Col md={2} className="mb-3">
                <Label htmlFor="numeroCalle" className="form-label">Altura</Label>
                <input
                    id="numeroCalle"
                    type="text" // Mantenido como text por si hay "S/N", pero validado como número
                    maxLength={6} // Aumentado por si acaso
                    className={`form-control ${errors.numeroCalle ? "is-invalid" : ""}`}
                    placeholder="Ej: 980"
                    {...register("numeroCalle", {
                        required: "La altura es obligatoria",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo números"
                        }
                     })}
                    onKeyPress={handleKeyPressNumeric} // Restringir entrada a números
                />
                {errors.numeroCalle && <div className="invalid-feedback">{errors.numeroCalle.message}</div>}
            </Col>

             {/* Celular */}
            <Col md={5} className="mb-3">
                <Label htmlFor="numeroTelefono" className="form-label">Celular de Contacto</Label>
                <input
                    id="numeroTelefono"
                    type="text" // Puede incluir prefijos, mejor text
                    maxLength={15}
                    className={`form-control ${errors.numeroTelefono ? "is-invalid" : ""}`}
                    placeholder="Ej: 3511234567"
                    {...register("numeroTelefono", {
                        required: "El celular es obligatorio",
                         pattern: {
                            value: /^[0-9+()\s-]*$/, // Permite números, +, (), espacio, guión
                            message: "Número de teléfono inválido"
                         }
                     })}
                     onKeyPress={handleKeyPressNumeric} // Opcional: si solo quieres números puros
                />
                {errors.numeroTelefono && <div className="invalid-feedback">{errors.numeroTelefono.message}</div>}
            </Col>

            {/* CUIT */}
            <Col md={6} className="mb-3">
                 <Label htmlFor="cuil" className="form-label">CUIT</Label>
                 <input
                     id="cuil"
                     type="text"
                     maxLength={11}
                     className={`form-control ${errors.cuil ? "is-invalid" : ""}`}
                     placeholder="Solo números, sin guiones"
                     {...register("cuil", {
                         required: "El CUIT es obligatorio",
                         pattern: {
                             value: /^[0-9]{11}$/,
                             message: "El CUIT debe tener 11 dígitos numéricos"
                         }
                     })}
                     onKeyPress={handleKeyPressNumeric} // Solo números
                 />
                 {errors.cuil && <div className="invalid-feedback">{errors.cuil.message}</div>}
            </Col>

             {/* Mapa */}
            <Col xs={12} className="mb-3">
                 <Label className="form-label">Ubicación en Mapa</Label>
                 <p><small>Haz clic en el mapa para fijar la ubicación exacta o arrastra el marcador.</small></p>
                 <div style={{ height: '400px', width: '100%' }}> {/* Contenedor con altura definida */}
                    <Map
                        // Pasa las funciones y datos necesarios al componente del mapa
                        onMapClick={handleMapInteraction} // Para obtener lat/lng al hacer clic
                        onLocationChange={handleMapInteraction} // Si el mapa devuelve la ubicación de otra forma (ej. al mover marcador)
                        center={mapCenter} // Para centrar el mapa
                        // Pasa la dirección para que el mapa intente geocodificarla si tiene esa capacidad
                        direccion={direccion}
                        altura={altura}
                        barrio={selectedBarrioNombre} // Pasa el nombre del barrio
                        ciudad={"Córdoba"}
                        pais={"Argentina"}
                        // Asegúrate de que el componente Map pueda mostrar un marcador en lat/lng
                        markerPosition={{ lat: watch('latitud'), lng: watch('longitud') }}
                    />
                 </div>
                 {/* Mostrar errores de latitud/longitud si los hay */}
                 {errors.latitud && <div className="text-danger small mt-1">{errors.latitud.message || 'Latitud inválida'}</div>}
                 {errors.longitud && <div className="text-danger small mt-1">{errors.longitud.message || 'Longitud inválida'}</div>}
                 {/* Inputs ocultos o deshabilitados para mostrar lat/lng (opcional) */}
                 {/*
                 <Row className="mt-2">
                    <Col>Lat: {watch('latitud')}</Col>
                    <Col>Lng: {watch('longitud')}</Col>
                 </Row>
                 */}
                 {/* Registrar latitud y longitud para validación si es necesario */}
                  <input type="hidden" {...register("latitud", { required: "Debes seleccionar una ubicación en el mapa" })} />
                  <input type="hidden" {...register("longitud", { required: "Debes seleccionar una ubicación en el mapa" })} />
            </Col>

            {/* Los botones de navegación ahora están en AddVeterinariaRefactored */}
        </Row>
    );
};

export default Step1Refactored;