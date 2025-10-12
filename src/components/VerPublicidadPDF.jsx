import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import logo from "/logo-amigos-peludos.png";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 12,
        lineHeight: 1.5,
        backgroundColor: "#fff",
    },
    logo: {
        width: 80,
        alignSelf: "flex-end",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
        color: "#3e3e3e",
    },
    section: {
        marginBottom: 16,
        padding: 12,
        border: "1pt solid #ccc",
        borderRadius: 6,
        backgroundColor: "#fafafa",
    },
    label: {
        fontWeight: "bold",
        width: "35%",
        color: "#5d5d5d",
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "flex-start",
    },
    value: {
        width: "65%",
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
        color: "#5d5d5d",
        fontWeight: "bold",
        borderBottom: "1pt solid #e0e0e0",
        paddingBottom: 5,
    },
    imageContainer: {
        textAlign: "center",
        marginBottom: 15,
    },
    publicidadImage: {
        width: "100%",
        height: 200,
        objectFit: "cover",
        borderRadius: 8,
        border: "1pt solid #ddd",
    },
    footer: {
        marginTop: 30,
        textAlign: "center",
        fontSize: 10,
        color: "#999",
        borderTop: "1pt solid #eee",
        paddingTop: 10,
    },
    statusChip: {
        backgroundColor: "#e3f2fd",
        padding: 4,
        borderRadius: 4,
        textAlign: "center",
        fontSize: 10,
        fontWeight: "bold",
        color: "#1976d2",
        marginLeft: 8,
    },
    metricsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    metricBox: {
        backgroundColor: "#f5f5f5",
        padding: 8,
        borderRadius: 4,
        textAlign: "center",
        flex: 1,
        marginHorizontal: 5,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#1976d2",
    },
    metricLabel: {
        fontSize: 10,
        color: "#666",
        marginTop: 2,
    },
});

const VerPublicidadPDF = ({ publicidad }) => {
    const getEstadoColor = (estado) => {
        if (typeof estado === 'object') {
            switch (estado.nombre) {
                case 'Activa': return '#4caf50';
                case 'Pausada': return '#ff9800';
                case 'Pendiente': return '#2196f3';
                case 'Rechazada': return '#f44336';
                case 'Finalizada': return '#9e9e9e';
                case 'Eliminada': return '#f44336';
                default: return '#666';
            }
        }
        return '#666';
    };

    const getEstadoText = (estado) => {
        if (typeof estado === 'object') {
            return estado.nombre;
        }
        return estado || 'N/A';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.imageContainer}>
                    <Image style={styles.logo} src={logo} />
                </View>
                
                <Text style={styles.title}>Detalle de Publicidad</Text>

                {/* Imagen de la publicidad */}
                {publicidad.imagen && (
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Imagen de la Publicidad</Text>
                        <Image 
                            style={styles.publicidadImage} 
                            src={publicidad.imagen} 
                        />
                    </View>
                )}

                {/* Información básica */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Información Básica</Text>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Título:</Text>
                        <Text style={styles.value}>{publicidad.titulo || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Descripción:</Text>
                        <Text style={styles.value}>{publicidad.descripcion || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>URL de destino:</Text>
                        <Text style={styles.value}>{publicidad.url || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Teléfono:</Text>
                        <Text style={styles.value}>{publicidad.telefono || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Dirección:</Text>
                        <Text style={styles.value}>{publicidad.direccion || 'N/A'}</Text>
                    </View>
                </View>

                {/* Clasificación */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Clasificación</Text>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Tipo de anunciante:</Text>
                        <Text style={styles.value}>
                            {typeof publicidad.tipoAnunciante === 'object' 
                                ? publicidad.tipoAnunciante?.nombre 
                                : publicidad.tipoAnunciante || 'N/A'}
                        </Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Ubicación:</Text>
                        <Text style={styles.value}>
                            {typeof publicidad.ubicacion === 'object' 
                                ? publicidad.ubicacion?.nombre || publicidad.ubicacion?.codigo
                                : publicidad.ubicacion || 'N/A'}
                        </Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Estado:</Text>
                        <Text style={[styles.value, { color: getEstadoColor(publicidad.estado) }]}>
                            {getEstadoText(publicidad.estado)}
                        </Text>
                    </View>
                </View>

                {/* Métricas de rendimiento */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Métricas de Rendimiento</Text>
                    
                    <View style={styles.metricsContainer}>
                        <View style={styles.metricBox}>
                            <Text style={styles.metricValue}>
                                {publicidad.visualizaciones?.toLocaleString() || 0}
                            </Text>
                            <Text style={styles.metricLabel}>Visualizaciones</Text>
                        </View>
                        
                        <View style={styles.metricBox}>
                            <Text style={styles.metricValue}>
                                {publicidad.clics?.toLocaleString() || 0}
                            </Text>
                            <Text style={styles.metricLabel}>Clics</Text>
                        </View>
                        
                        <View style={styles.metricBox}>
                            <Text style={styles.metricValue}>
                                {publicidad.visualizaciones > 0 
                                    ? ((publicidad.clics / publicidad.visualizaciones) * 100).toFixed(2)
                                    : 0}%
                            </Text>
                            <Text style={styles.metricLabel}>CTR</Text>
                        </View>
                    </View>
                </View>

                {/* Fechas */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Fechas</Text>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Fecha de creación:</Text>
                        <Text style={styles.value}>
                            {publicidad.fechaCreacion 
                                ? new Date(publicidad.fechaCreacion).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'N/A'}
                        </Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Fecha de inicio:</Text>
                        <Text style={styles.value}>
                            {publicidad.fechaInicio 
                                ? new Date(publicidad.fechaInicio).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'N/A'}
                        </Text>
                    </View>
                    
                    <View style={styles.itemRow}>
                        <Text style={styles.label}>Fecha de fin:</Text>
                        <Text style={styles.value}>
                            {publicidad.fechaFin 
                                ? new Date(publicidad.fechaFin).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Información del usuario */}
                {publicidad.usuario && (
                    <View style={styles.section}>
                        <Text style={styles.subtitle}>Información del Anunciante</Text>
                        
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Nombre:</Text>
                            <Text style={styles.value}>
                                {publicidad.usuario.nombre || publicidad.usuario.nombreCompleto || 'N/A'}
                            </Text>
                        </View>
                        
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.value}>{publicidad.usuario.email || 'N/A'}</Text>
                        </View>
                        
                        <View style={styles.itemRow}>
                            <Text style={styles.label}>Teléfono:</Text>
                            <Text style={styles.value}>{publicidad.usuario.telefono || 'N/A'}</Text>
                        </View>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Documento generado por Amigos Peludos</Text>
                    <Text>Fecha de generación: {new Date().toLocaleDateString('es-ES')}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default VerPublicidadPDF;
