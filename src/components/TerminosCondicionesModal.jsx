import React, { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const TerminosCondicionesModal = ({ open, onClose }) => {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const contentRef = useRef(null);

    const handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.target;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px de margen
        setHasScrolledToBottom(isAtBottom);
    };

    // Resetear el estado cuando se abre el modal
    useEffect(() => {
        if (open) {
            setHasScrolledToBottom(false);
        }
    }, [open]);

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { maxHeight: '80vh' }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: '#2e7d32',
                color: 'white'
            }}>
                <Typography variant="h6" component="div">
                    Términos y Condiciones
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent 
                ref={contentRef}
                onScroll={handleScroll}
                sx={{ p: 3 }}
            >
                <Box sx={{ mb: 3 }}>
                    <img
                        src="/logo-amigos-peludos.png"
                        alt="Logo Amigos Peludos"
                        style={{ height: 60, marginBottom: 16 }}
                    />
                </Box>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', mt: 2 }}>
                    1. Aceptación de los Términos y Condiciones
                </Typography>
                <Typography variant="body2" paragraph>
                    Bienvenido a "Amigos Peludos", una plataforma digital diseñada para conectar a dueños de mascotas 
                    con proveedores de servicios especializados en el cuidado animal. Al acceder, registrarte, navegar 
                    o utilizar cualquier funcionalidad de nuestra plataforma, confirmas que has leído, comprendido y 
                    aceptado de manera irrevocable estos términos y condiciones de uso.
                </Typography>
                <Typography variant="body2" paragraph>
                    Estos términos constituyen un acuerdo legal vinculante entre tú (el "Usuario") y Amigos Peludos 
                    (la "Plataforma", "nosotros", "nuestro" o "nos"). Si no estás de acuerdo con cualquier parte 
                    de estos términos, debes abstenerse inmediatamente de utilizar nuestros servicios.
                </Typography>
                <Typography variant="body2" paragraph>
                    Nos reservamos el derecho de modificar estos términos en cualquier momento sin previo aviso. 
                    Es tu responsabilidad revisar periódicamente estos términos para estar informado de cualquier 
                    cambio. El uso continuado de la plataforma después de cualquier modificación constituye tu 
                    aceptación de los nuevos términos.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    2. Descripción Detallada del Servicio
                </Typography>
                <Typography variant="body2" paragraph>
                    Amigos Peludos es una plataforma tecnológica integral que opera como intermediario digital para 
                    conectar a propietarios de mascotas con una red diversa de proveedores de servicios especializados 
                    en el cuidado animal. Nuestra plataforma facilita la búsqueda, evaluación, contratación y gestión 
                    de servicios relacionados con mascotas.
                </Typography>
                <Typography variant="body2" paragraph>
                    <strong>Servicios incluidos en nuestra plataforma:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • <strong>Cuidado de mascotas:</strong> Información sobre servicios de cuidado temporal<br/>
                    • <strong>Paseo de mascotas:</strong> Información sobre servicios de paseo individual y grupal<br/>
                    • <strong>Veterinarias y fundaciones</strong> Información sobre ubicacion, servicios brindados, datos de contacto y datos bancarios para donaciones<br/>
                    • <strong>Adopción:</strong> Plataforma para adopción responsable de mascotas<br/>
                    • <strong>Mascotas perdidas y encontradas</strong> Publicación y consulta de posteos sobre mascotas perdidas o encontradas
                </Typography>
                <Typography variant="body2" paragraph>
                    <strong>IMPORTANTE:</strong> Amigos Peludos actúa únicamente como intermediario tecnológico. 
                    No prestamos directamente ninguno de estos servicios, sino que facilitamos la conexión entre 
                    usuarios y proveedores de servicios independientes. No somos responsables por la calidad, 
                    seguridad, legalidad o efectividad de los servicios prestados por terceros.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    3. Limitación Exhaustiva de Responsabilidad
                </Typography>
                <Typography variant="body2" paragraph>
                    <strong>AMIGOS PELUDOS NO SE RESPONSABILIZA BAJO NINGUNA CIRCUNSTANCIA POR:</strong>
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>3.1 Servicios de Terceros:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • La calidad, seguridad, legalidad, efectividad o idoneidad de los servicios prestados por terceros<br/>
                    • La veracidad, exactitud o actualización de la información proporcionada por proveedores de servicios<br/>
                    • El cumplimiento de las obligaciones contractuales entre usuarios y proveedores de servicios<br/>
                    • La disponibilidad, puntualidad o cancelación de servicios contratados a través de la plataforma<br/>
                    • Los resultados obtenidos de la utilización de servicios de terceros<br/>
                    • La satisfacción del usuario con los servicios recibidos
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>3.2 Daños a Mascotas y Propiedades:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Lesiones, enfermedades, daños físicos o psicológicos que puedan sufrir las mascotas<br/>
                    • Pérdida, robo, extravío o muerte de mascotas durante el uso de servicios<br/>
                    • Daños a propiedades físicas causados por mascotas o proveedores de servicios<br/>
                    • Gastos veterinarios derivados de incidentes durante el uso de servicios<br/>
                    • Daños emocionales o psicológicos sufridos por los dueños de mascotas<br/>
                    • Pérdidas económicas derivadas de la incapacidad de trabajar o cuidar mascotas
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>3.3 Conflictos y Disputas:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Conflictos, disputas o desacuerdos entre usuarios de la plataforma<br/>
                    • Problemas de comunicación entre usuarios y proveedores de servicios<br/>
                    • Reclamos, demandas o acciones legales entre usuarios<br/>
                    • Violaciones de contratos celebrados entre usuarios<br/>
                    • Incumplimiento de acuerdos verbales o escritos entre partes
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>3.4 Información y Contenido:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Información incorrecta, desactualizada, engañosa o falsa proporcionada por usuarios<br/>
                    • Contenido inapropiado, ofensivo, ilegal o que viole derechos de terceros<br/>
                    • Decisiones tomadas por usuarios basadas en información de la plataforma<br/>
                    • Errores en la traducción, interpretación o presentación de información<br/>
                    • Omisiones o inexactitudes en perfiles, descripciones o calificaciones
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>3.5 Aspectos Técnicos y Operativos:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Interrupciones, fallos o indisponibilidad del servicio por motivos técnicos<br/>
                    • Pérdida de datos, información o comunicaciones<br/>
                    • Problemas de conectividad, servidores o infraestructura tecnológica<br/>
                    • Ataques cibernéticos, virus, malware o violaciones de seguridad<br/>
                    • Mantenimiento programado o no programado de la plataforma<br/>
                    • Cambios en la funcionalidad o disponibilidad de características
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>3.6 Limitación Monetaria:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    En ningún caso Amigos Peludos será responsable por daños directos, indirectos, incidentales, 
                    especiales, consecuenciales o punitivos que excedan el monto total pagado por el usuario 
                    a la plataforma en los doce (12) meses anteriores al evento que dio lugar al reclamo.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    4. Responsabilidades y Obligaciones del Usuario
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>4.1 Información Personal y de Cuenta:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Proporcionar información personal veraz, exacta, completa y actualizada<br/>
                    • Mantener actualizada toda la información de perfil, incluyendo datos de contacto<br/>
                    • Notificar inmediatamente cualquier cambio en la información personal<br/>
                    • Mantener la confidencialidad de credenciales de acceso (usuario y contraseña)<br/>
                    • Ser responsable de todas las actividades realizadas bajo su cuenta<br/>
                    • No compartir credenciales de acceso con terceros<br/>
                    • Cambiar contraseñas regularmente y usar contraseñas seguras
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>4.2 Cumplimiento Legal y Regulatorio:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Cumplir con todas las leyes locales, nacionales e internacionales aplicables<br/>
                    • Respetar las regulaciones sobre tenencia responsable de mascotas<br/>
                    • Obtener y mantener todas las licencias, permisos y certificaciones requeridas<br/>
                    • Cumplir con las normativas de salud pública y sanidad animal<br/>
                    • Respetar los derechos de propiedad intelectual de terceros<br/>
                    • No utilizar la plataforma para actividades ilegales o fraudulentas
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>4.3 Comportamiento y Conducta:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Tratar a todos los usuarios con respeto, cortesía y profesionalismo<br/>
                    • No discriminar por raza, género, edad, religión, orientación sexual o discapacidad<br/>
                    • No acosar, intimidar, amenazar o abusar verbalmente de otros usuarios<br/>
                    • Mantener un lenguaje apropiado y profesional en todas las comunicaciones<br/>
                    • Respetar la privacidad y confidencialidad de otros usuarios<br/>
                    • Reportar inmediatamente cualquier comportamiento inapropiado o sospechoso
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>4.4 Uso de Servicios de Terceros:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Evaluar cuidadosamente a los proveedores de servicios antes de contratarlos<br/>
                    • Verificar credenciales, referencias y calificaciones de proveedores<br/>
                    • Establecer acuerdos claros y por escrito con proveedores de servicios<br/>
                    • Supervisar el cuidado de sus mascotas cuando sea posible<br/>
                    • Proporcionar información completa sobre las necesidades especiales de sus mascotas<br/>
                    • Mantener comunicación regular con los proveedores de servicios
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>4.5 Contenido y Comunicaciones:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • No publicar contenido falso, engañoso, difamatorio o ilegal<br/>
                    • No compartir información personal de otros usuarios sin consentimiento<br/>
                    • No utilizar la plataforma para spam, publicidad no autorizada o promociones<br/>
                    • Respetar los derechos de autor y propiedad intelectual<br/>
                    • No publicar contenido que pueda dañar la reputación de la plataforma<br/>
                    • Mantener la confidencialidad de información sensible de la plataforma
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>4.6 Seguridad y Protección:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Implementar medidas de seguridad adecuadas para proteger su información<br/>
                    • No intentar acceder a cuentas, sistemas o datos de otros usuarios<br/>
                    • Reportar inmediatamente cualquier violación de seguridad o actividad sospechosa<br/>
                    • No utilizar software malicioso, virus o herramientas de hacking<br/>
                    • Mantener actualizado el software de seguridad en sus dispositivos<br/>
                    • Respetar las medidas de seguridad implementadas por la plataforma
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    5. Uso Aceptable y Prohibiciones
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>5.1 Uso Aceptable:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Buscar y contratar servicios legítimos para el cuidado de mascotas<br/>
                    • Ofrecer servicios profesionales relacionados con el cuidado animal<br/>
                    • Comunicarse de manera respetuosa y profesional con otros usuarios<br/>
                    • Publicar información veraz sobre mascotas y servicios<br/>
                    • Utilizar la plataforma de acuerdo con su propósito comercial<br/>
                    • Reportar problemas o comportamientos inapropiados
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>5.2 Actividades Prohibidas:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Realizar actividades ilegales, fraudulentas o que violen la ley<br/>
                    • Acosar, intimidar, amenazar o abusar de otros usuarios<br/>
                    • Publicar contenido falso, engañoso, difamatorio o ilegal<br/>
                    • Intentar acceder a cuentas, sistemas o datos de otros usuarios<br/>
                    • Interferir con el funcionamiento normal de la plataforma<br/>
                    • Utilizar bots, scripts automatizados o herramientas de scraping<br/>
                    • Realizar ingeniería inversa o descompilar el software<br/>
                    • Distribuir virus, malware o código malicioso<br/>
                    • Violar derechos de propiedad intelectual o industrial<br/>
                    • Realizar actividades comerciales no autorizadas<br/>
                    • Manipular calificaciones, reseñas o sistemas de reputación<br/>
                    • Crear cuentas falsas o múltiples cuentas para evadir restricciones
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    6. Política de Privacidad y Protección de Datos
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>6.1 Recopilación de Información:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Información personal: nombre, email, teléfono, dirección<br/>
                    • Información de mascotas: datos médicos, comportamiento, necesidades especiales<br/>
                    • Información de servicios: historial de contrataciones, calificaciones, reseñas<br/>
                    • Información técnica: dirección IP, tipo de dispositivo, sistema operativo<br/>
                    • Información de ubicación: para servicios basados en geolocalización<br/>
                    • Información de comunicación: mensajes, llamadas, videollamadas
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>6.2 Uso de la Información:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Proporcionar y mejorar nuestros servicios<br/>
                    • Facilitar la comunicación entre usuarios<br/>
                    • Personalizar la experiencia del usuario<br/>
                    • Procesar pagos y transacciones<br/>
                    • Enviar notificaciones y actualizaciones<br/>
                    • Cumplir con obligaciones legales y regulatorias<br/>
                    • Prevenir fraudes y actividades ilegales<br/>
                    • Realizar análisis y estadísticas agregadas
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>6.3 Compartir Información:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Con proveedores de servicios para facilitar la prestación de servicios<br/>
                    • Con autoridades competentes cuando sea requerido por ley<br/>
                    • Con terceros de confianza para procesamiento de pagos<br/>
                    • En casos de emergencia médica o de seguridad<br/>
                    • Con el consentimiento explícito del usuario<br/>
                    • En procesos de fusión, adquisición o venta de activos
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>6.4 Seguridad de Datos:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Implementamos medidas de seguridad técnicas y organizativas<br/>
                    • Encriptamos datos sensibles en tránsito y en reposo<br/>
                    • Limitamos el acceso a información personal al personal autorizado<br/>
                    • Realizamos auditorías regulares de seguridad<br/>
                    • Mantenemos copias de seguridad seguras<br/>
                    • Capacitamos al personal en protección de datos
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    7. Propiedad Intelectual
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>7.1 Derechos de Amigos Peludos:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • La plataforma, software, diseño y funcionalidades son propiedad exclusiva<br/>
                    • Marcas comerciales, logos y nombres comerciales están protegidos<br/>
                    • Contenido original creado por Amigos Peludos está protegido por derechos de autor<br/>
                    • Bases de datos y algoritmos son propiedad intelectual protegida<br/>
                    • Documentación, manuales y materiales de capacitación son propietarios
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>7.2 Licencia de Uso:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    Se otorga una licencia limitada, no exclusiva, no transferible y revocable para 
                    utilizar la plataforma únicamente para los fines permitidos por estos términos. 
                    Esta licencia no incluye el derecho a modificar, distribuir, vender o crear 
                    trabajos derivados basados en la plataforma.
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>7.3 Contenido del Usuario:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    Los usuarios conservan los derechos sobre su contenido, pero otorgan a Amigos Peludos 
                    una licencia no exclusiva para usar, reproducir, modificar y distribuir dicho contenido 
                    en relación con la prestación de servicios de la plataforma.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    8. Pagos y Transacciones
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>8.1 Procesamiento de Pagos:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Los pagos se procesan a través de proveedores de servicios de pago seguros<br/>
                    • Amigos Peludos no almacena información de tarjetas de crédito<br/>
                    • Los usuarios son responsables de mantener información de pago actualizada<br/>
                    • Las transacciones están sujetas a las políticas de los procesadores de pago<br/>
                    • Los reembolsos están sujetos a las políticas de cancelación específicas
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>8.2 Comisiones y Tarifas:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Amigos Peludos puede cobrar comisiones por el uso de la plataforma<br/>
                    • Las tarifas se comunicarán claramente antes de la transacción<br/>
                    • Los precios pueden variar según la ubicación y tipo de servicio<br/>
                    • Las tarifas están sujetas a cambios con notificación previa<br/>
                    • Los impuestos aplicables son responsabilidad del usuario
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    9. Suspensión y Terminación
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>9.1 Suspensión Temporal:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Por violación de estos términos y condiciones<br/>
                    • Por comportamiento inapropiado o abusivo<br/>
                    • Por actividades sospechosas o fraudulentas<br/>
                    • Por incumplimiento de políticas de pago<br/>
                    • Por solicitud de autoridades competentes
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>9.2 Terminación Permanente:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Por violaciones graves o repetidas de estos términos<br/>
                    • Por actividades ilegales o fraudulentas<br/>
                    • Por solicitud del usuario<br/>
                    • Por cierre de la plataforma<br/>
                    • Por incumplimiento de obligaciones de pago
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>9.3 Efectos de la Terminación:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Acceso inmediato a la cuenta será revocado<br/>
                    • Los datos del usuario pueden ser eliminados<br/>
                    • Las transacciones pendientes pueden ser canceladas<br/>
                    • Las obligaciones existentes permanecen vigentes<br/>
                    • Los derechos de propiedad intelectual se mantienen
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    10. Modificaciones y Actualizaciones
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>10.1 Modificaciones de Términos:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Nos reservamos el derecho de modificar estos términos en cualquier momento<br/>
                    • Los cambios serán notificados con al menos 30 días de anticipación<br/>
                    • Las modificaciones se publicarán en la plataforma y por email<br/>
                    • El uso continuado constituye aceptación de los nuevos términos<br/>
                    • Los usuarios pueden terminar su cuenta si no aceptan los cambios
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>10.2 Actualizaciones de Servicio:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • La plataforma puede ser actualizada regularmente<br/>
                    • Nuevas funcionalidades pueden ser agregadas<br/>
                    • Funcionalidades existentes pueden ser modificadas o eliminadas<br/>
                    • Los usuarios serán notificados de cambios significativos<br/>
                    • La compatibilidad con versiones anteriores no está garantizada
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    11. Ley Aplicable y Jurisdicción
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>11.1 Ley Aplicable:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    Estos términos se rigen por las leyes de la República Argentina, sin consideración 
                    a sus principios de conflicto de leyes. Cualquier disputa será resuelta de acuerdo 
                    con la legislación argentina vigente.
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>11.2 Jurisdicción:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    Cualquier controversia, disputa o reclamo relacionado con estos términos será 
                    sometida a la jurisdicción exclusiva de los tribunales competentes de la Ciudad 
                    Autónoma de Buenos Aires, Argentina.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    12. Disposiciones Generales
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>12.1 Divisibilidad:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    Si alguna disposición de estos términos es considerada inválida o inaplicable, 
                    las disposiciones restantes permanecerán en pleno vigor y efecto.
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>12.2 Renuncia:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    La falta de ejercicio de cualquier derecho bajo estos términos no constituye 
                    una renuncia a dicho derecho. Los derechos solo pueden ser renunciados por 
                    escrito y de manera específica.
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>12.3 Acuerdo Completo:</strong>
                </Typography>
                <Typography variant="body2" paragraph>
                    Estos términos, junto con la Política de Privacidad, constituyen el acuerdo 
                    completo entre las partes y reemplazan todos los acuerdos anteriores relacionados 
                    con el uso de la plataforma.
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                    13. Contacto y Soporte
                </Typography>
                
                <Typography variant="body2" paragraph>
                    <strong>13.1 Información de Contacto:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Email: 2023amigospeludos@gmail.com<br/>
                    • Horario de atención: Lunes a Viernes de 9:00 a 18:00<br/>
                </Typography>

                <Typography variant="body2" paragraph>
                    <strong>13.2 Soporte Técnico:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                    • Documentación y tutoriales disponibles online
                </Typography>

                <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                        Al continuar con el registro, confirmas que has leído, entendido y aceptado 
                        estos términos y condiciones.
                    </Typography>
                </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Button 
                    onClick={onClose} 
                    variant="contained"
                    disabled={!hasScrolledToBottom}
                    sx={{ 
                        backgroundColor: hasScrolledToBottom ? '#2e7d32' : '#ccc',
                        '&:hover': { 
                            backgroundColor: hasScrolledToBottom ? '#27642a' : '#ccc' 
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#666'
                        }
                    }}
                >
                    {hasScrolledToBottom ? 'Entendido' : 'Desplázate para leer todo'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TerminosCondicionesModal;
