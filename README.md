<h1 align="center">Medical AIDp</h1>
<p align="center"><i>Diagnósticos remotos.</i></p>
<br>

Bienvenido al repositorio de **Medical AID**, una aplicación web diseñada para diagnósticos médicos remotos utilizando machine learning desarrollada durante el transcurso de la asignatura "Capstone" de Duoc UC.

## Tabla de contenidos
  - [Lenguajes](#Lenguajes)
  - [Tecnología](#Tecnología)
  - [Base de datos](#Base_de_datos)
  - [Arquitectura](#Arquitectura)
  - [Framework](#Framework)
  - [Aplicación](#Aplicación)
  - [Pasos de implementación](#Pasos_de_implementación)

## Aplicación

Medical AID tiene como objetivo proporcionar un acceso rápido, preciso y económico a diagnósticos médicos remotos. Utiliza machine learning para permitir que los usuarios obtengan diagnósticos confiables.

A continuación, se presentan las principales vistas de la aplicación:

1. Página de inicio
La página de inicio permite a los usuarios iniciar sesión para acceder a todas las funcionalidades de la plataforma.

<img src="images/Login" alt="Página de Inicio" height="500px">

2. Registro de Usuarios
Los nuevos usuarios pueden registrarse fácilmente a través de esta interfaz.

<img src="images/RegisterPage" alt="Registro de Usuarios" height="500px">

3. Página de Perfil
La sección de perfil permite a los usuarios ver y actualizar su información personal.

<img src="images/ProfilePage" alt="Página de Perfil" height="500px">

4. Formulario de Diagnóstico
Interfaz intuitiva para ingresar síntomas y generar un diagnóstico médico remoto.

<img src="images/Formulario_diagnostico" alt="Formulario de Diagnóstico" height="500px">

5. Resultados de Diagnóstico
Los resultados del diagnóstico se muestran con un resumen claro y recomendaciones específicas.

<img src="images/Resultado_diagnostico" alt="Resultados del Diagnóstico" height="500px">

6. Biblioteca de Diagnósticos
Sección donde los usuarios pueden acceder a información detallada sobre enfermedades.

<img src="images/libraryPage" alt="Biblioteca de Información" height="500px">

7. Panel de Administración
Vista exclusiva para administradores, donde pueden gestionar usuarios, alertas y revisar el comportamiento de las enfermedades diagnósticadas.

<img src="images/adminPage" alt="Panel de Administración" height="500px">

8. Gestión de Alertas
Los administradores pueden crear y gestionar alertas que se mostrarán a los usuarios.

<img src="images/createAlert" alt="Gestión de Alertas" height="500px">

9. Dashboard
Un dashboardo que permite visualizar volumetría y estadística relacionadas con los diagnósticos realizados.

<img src="images/dashboard" alt="Tablero de Estadísticas" height="500px">

## Lenguajes

El proyecto utiliza los siguientes lenguajes de programación:
- **JavaScript**: Para el desarrollo del frontend, utilizando React.
- **HTML**: Para estructurar el contenido web.
- **CSS/SCSS**: Para el diseño y estilo de la aplicación.
- **Node.js**: Para el desarrollo del backend.
- **SQL**: Para la gestión de la base de datos relacional.
- **Python**: Para el desarrollo del modelo de machine learning y conexión de éste modelo con el backend.

# Tecnología

### Software Utilizado
- **Visual Studio Code**: Editor de código fuente desarrollado por Microsoft. Ofrece una gran variedad de herramientas, soporte y extensiones que permiten el desarrollo de código, incluyendo: soporte para depuración, control de versiones integrado, resaltado de sintaxis, finalización de código inteligente, fragmentos y refactorización de código.
- **PGAdmin**: Herramienta de administración y desarrollo de bases de datos para PostgreSQL.
- **GitHub**: Plataforma de hosting de repositorios de código que permite la colaboración y control de versiones utilizando Git.
- **Google Collab**: Entorno de desarrollo interactivo basado en la nube que permite ejecutar código Python directamente desde un navegador. ütil para el desarrollo y experimentación con modelos de machine learning, análisis de datos y pruebas rápidas de código.
  
### Frontend
- **React**: Librería desarrollada por Facebook para construir interfaces de usuario (UI).
- **React Router DOM**: Librería para manejar el enrutamiento en la aplicación.
- **Axios**: Cliente HTTP para realizar peticiones a la API.
- **React Toastify**: Librería para mostrar notificaciones.
- **SweetAlert2**: Librería para mostrar alertas.
- **FontAwesome**: Librería con Iconos.
- **React Select**: Componente para manejar listas desplegables con funcionalidades avanzadas.
- **React Table**: Librería para construir tablas interactivas.
- **React Leaflet**: Librería para trabajar con mapas interactivos basados en Leaflet.
- **Leaflet**: Librería de mapas para renderizar mapas interactivos.
- **React Leaflet Cluster**: Extensión para Leaflet que soporta agrupaciones de marcadores.
- **Chart.js**: Librería para generar gráficos dinámicos.
- **React Chart.js 2**: Componente de React para integrar Chart.js.
- **Chart.js Plugin Datalabels**: Extensión para agregar etiquetas de datos a los gráficos.
- **React Icons**: Librería para agregar iconos populares de diferentes fuentes.
- **React Slick**: Componente de carrusel para React.
- **Slick Carousel**: Dependencia requerida para carruseles en React Slick.
- **UUID**: Generador de identificadores únicos universales (UUID).
- **Web Vital**s: Herramienta para medir el rendimiento de la web.
- **Ag Grid Community**: Biblioteca avanzada para la creación de tablas.
- **Ag Grid React**: Extensión para usar Ag Grid con React.

### Backend
- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para construir aplicaciones web y APIs.
- **Bcryptjs**: Librería para el hash de contraseñas.
- **Jsonwebtoken**: Implementación de JSON Web Tokens para la autenticación.
- **Cors**: Middleware para habilitar CORS.
- **Dotenv**: Librería para manejar variables de entorno.
- **Node-fetch**: Librería para realizar peticiones HTTP.
- **Nodemailer**: Librería para el envío de correos electrónicos.
- **PG (node-postgres)**: Cliente para PostgreSQL.
- **Dotenv**: Librería para manejar variables de entorno.
- **Body Parser**: Middleware para analizar datos del cuerpo de las peticiones.
- **Crypto**: Librería para operaciones criptográficas.
- **Nodemailer**: Librería para el envío de correos electrónicos.
- **Nodemailer Mock**: Herramienta para simular el envío de correos durante las pruebas.
- **PG (node-postgres)**: Cliente para trabajar con bases de datos PostgreSQL.
- **PG Hstore**: Utilidad para manejar datos tipo JSON en PostgreSQL.
- **Sequelize**: ORM (Object Relational Mapper) para trabajar con bases de datos SQL.
- **Sequelize Mock**: Biblioteca para simular modelos Sequelize en pruebas.

### Machine Learning

- **Scikit-learn**:
  - **DecisionTreeClassifier**: Algoritmo para clasificación basado en árboles de decisión.
  - **KNeighborsClassifier**: Algoritmo basado en vecinos más cercanos.
  - **SVC**: Clasificador basado en máquinas de soporte vectorial.
  - **LogisticRegression**: Modelo de regresión logística.
  - **RandomForestClassifier**: Clasificador basado en bosques aleatorios.
  - **accuracy_score**: Métrica para evaluar la precisión del modelo.
  - **confusion_matrix**: Genera una matriz de confusión para evaluar el rendimiento del modelo.
  - **precision_score**: Calcula la precisión del modelo.
  - **recall_score**: Calcula la sensibilidad del modelo.
  - **f1_score**: Calcula la métrica F1, combinando precisión y recall.
  - **roc_auc_score**: Calcula el área bajo la curva ROC.
  - **roc_curve**: Genera la curva ROC para evaluar el modelo.
  - **cross_val_score**: Realiza validación cruzada.
  - **GridSearchCV**: Búsqueda de hiperparámetros.
- **Pandas**: Manipulación y análisis de datos estructurados.
- **NumPy**: Operaciones matemáticas y manejo eficiente de arrays.
- **Seaborn**: Visualización de datos estadísticos.
- **Matplotlib**: Gráficos y visualización de datos.
- **Scipy**: Herramientas estadísticas avanzadas.
- **Seaborn Dataset Loader**: Función para cargar conjuntos de datos.
- 
### Herramientas de Desarrollo
- **Jest**: Framework de pruebas para JavaScript.
- **Supertest**: Librería para probar APIs HTTP.
- **Nodemon**: Herramienta para reiniciar automáticamente el servidor.
- **Pytest**: Librería para probar APIs HTTP.

## Base_de_datos

El proyecto utiliza PostgreSQL como sistema de gestión de bases de datos relacional. A continuación se describe su estructura de tablas y relaciones:

### Esquema de la Base de Datos

<img src="Medical_AID\Medical-AID\Documentacion\Base de datos\Modelo ER Medical AID.png" height="50vh">

El detalle del esquema de la base de datos se encuentra en el siguiente documento:
[Documento Técnico de Base de Datos](Documentacion/Base%20de%20datos/Documento%20Técnico%20de%20Base%20de%20Datos.docx)



### Relación entre las tablas
- Un user puede tener un único user profile (1:1).
- Un user puede tener múltiples roles a través de user roles (1:N).
- Un user puede tener múltiples sessions (1:N).
- Un user puede tener múltiples diagnoses (1:N).
- Un user puede estar relacionado con múltiples alerts a través de user alerts (1:N).
- Un user puede generar múltiples audit logs (1:N).
- Un role puede estar asociada con múltiples users a través de user roles (1:N).
- Un diagnosis puede estar relacionado con múltiples symptoms a través de diagnosis symptoms (1:N).
- Un diagnosis puede estar relacionado con múltiples diseases a través de diagnosis disease (1:N).
- Un symptom puede estar relacionado con múltiples diagnoses a través de diagnosis symptoms (1:N).
- Una disease puede estar relacionada con múltiples diagnoses a través de diagnosis disease (1:N).
- Una alert puede estar asociada con múltiples users a través de user alerts (1:N).
- Una alert puede tener múltiples ubicaciones geográficas a través de alert geolocation (1:N).
- Un user alert está relacionado con un único user (N:1) y una única alert (N:1).
- Un newsletter subscriber tiene un único registro, con un correo electrónico único (1:1).

## Arquitectura

El proyecto sigue una arquitectura de cliente-servidor de tres capas, que separa las responsabilidades en diferentes niveles:

<img src="images/tres_capas.png" height="600">

### 1. Capa de Presentación (Frontend)
- **React**: Maneja las vistas de la aplicación, proporcionando una interfaz de usuario. Esta capa permite generar interacciones con el usuario y la presentación de los datos.

### 2. Capa de Lógica del Negocio (Backend)
- **Node.js y Express**: Gestionan la lógica del negocio a través de controladores que manejan las solicitudes HTTP, procesan los datos y aplican las reglas del negocio. Esta capa actúa como intermediaria entre la capa de presentación y la capa de datos, comunicándose con APIs externas y la base de datos interna según sea necesario.

- **Python y Flask**: Se utilizó para crear el endpoint que conectan el modelo de machine learning, que recibe síntomas como input y envía un diagnóstico como output, con el backend en Express.

### 3. Capa de Datos (Base de Datos)
- **PostgreSQL**: Almacena los datos de la aplicación. Las tablas y sus relaciones están definidas en la base de datos. Esta capa es responsable del almacenamiento, recuperación y gestión de los datos.

## Framework

### Frontend - React
React es una biblioteca de JavaScript desarrollada por Facebook, utilizada para construir interfaces de usuario. Permite la creación de componentes reutilizables que pueden manejar su propio estado, lo que facilita el desarrollo de aplicaciones web complejas y dinámicas. React utiliza un DOM virtual para optimizar la actualización de la interfaz de usuario, lo que mejora el rendimiento de la aplicación.

### Backend - Express
Express es un framework para Node.js, diseñado para construir aplicaciones web y APIs de manera sencilla y eficiente. Proporciona características para la gestión de solicitudes HTTP, middleware y enrutamiento, lo que permite el desarrollo de servidores y servicios web escalables y mantenibles. Express es altamente flexible y se integra bien con otros módulos y bibliotecas de Node.js.

## Pasos_de_implementación

Utilizar el siguiente documento para implementar el proyecto:
[Manuel de despliegue](Documentacion/Manuales/Manual%20de%20Despliegue.docx)
