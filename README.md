# 🐾 Amigos Peludos – Frontend

**Amigos Peludos** es una plataforma solidaria que permite publicar y encontrar mascotas perdidas, gestionar adopciones responsables, registrar mascotas en adopción, generar carnets de vacunación digitales, visualizar información por QR, acceder a servicios de cuidadores y paseadores, y mucho más.

Este repositorio contiene el código del frontend desarrollado con **React**, **Vite**, **Material UI** y **Firebase**, consumiendo APIs REST desarrolladas en **C#** y desplegadas en **---**.

---

## 🚀 Funcionalidades principales

- 🔐 Autenticación con email/contraseña y Google (Firebase Auth)  
- 🐶 Publicación de mascotas perdidas, encontradas y en adopción  
- 📷 Carga de imágenes mediante FilePond y almacenamiento en Firebase Storage  
- 📍 Geolocalización de mascotas encontradas con Leaflet  
- 📋 Formularios de adopción con estados y descarga en PDF  
- 💉 Carnet de vacunación digital con efecto de libreta  
- 🧠 Sistema de matcheo por similitud de imágenes y datos estructurados  
- 🛟 Registro y gestión de paseadores y cuidadores  
- 📱 Generación y escaneo de QR para mostrar información del dueño  

---

## 🛠️ Tecnologías utilizadas

- React + Vite  
- Material UI  
- Firebase (Auth + Storage)  
- Axios  
- React Hook Form  
- Leaflet  
- FilePond  
- React PDF / HTMLFlipBook  
- Supabase (PostgreSQL)  

---

## 📦 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Matute08/ProyectoFinal_ISI_UTN_FRC_AmigosPeludos.git
cd ProyectoFinal_ISI_UTN_FRC_AmigosPeludos
```

### 2. Instalar dependencias

```bash
npm install
```


### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🧪 Scripts útiles

```bash
npm run dev       # Inicia el servidor local
npm run build     # Genera una build de producción
npm run preview   # Previsualiza la build
```

---

## 🧑‍💻 Estructura general

```bash
src/
│
├── components/         # Componentes reutilizables
├── pages/              # Vistas principales
├── api/                # Conexiones a endpoints en C#
├── hooks/              # Custom hooks
├── auth/               # Auth y otros contextos globales
├── assets/             # Imágenes, logos, estilos
├── routes/             # Rutas protegidas y públicas
└── App.jsx             # Root de la aplicación
```

---

## ✨ Créditos

Desarrollado como proyecto final de carrera.

Agradecimientos especiales a la comunidad UTN-FRC, a los profes que acompañaron la tesis, y a todos los que forman parte del equipo de desarrollo de Amigos Peludos.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**.
