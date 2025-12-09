ChallengeFit – API de Retos Deportivos

API REST desarrollada para gestionar retos deportivos, usuarios y participación dentro de los retos. Incluye autenticación, control de roles, contenedores con Docker y uso de base de datos relacional.

Descripción del Proyecto

ChallengeFit es una API que permite registrar usuarios, crear retos con distintos niveles de dificultad y gestionar las participaciones de los usuarios.
El sistema está diseñado para ser consumido por aplicaciones web o móviles y cuenta con autenticación JWT, middlewares de seguridad y una arquitectura modular.

Estructura del Proyecto
challengefit/
│── db/
│    ├── .env
│    ├── docker-compose.yml
│
│── server/
│    ├── middlewares/
│    │      ├── authMiddleware.js
│    │      ├── roleMiddleware.js

│    ├── routes/
│    │      ├── authRoutes.js
│    │      ├── challengesRoutes.js
│    │      ├── participationsRoutes.js
│    │      ├── rankingDetalleRoutes.js
│    │      ├── rankingRoutes.js
│    │      ├── usersRoutes.js

│    ├── services/
│           ├── authServices.js
│           ├── challengesServices.js
│           ├── participationsServices.js
│           ├── rankingDetalleSerices.js
│           ├── rankingServices.js
│           ├── usersServices .js
│── .env
│── app.js

Tecnologías Utilizadas
-Node.js + Express
-MariaDB / MySQL
-Docker & Docker Compose
-JWT para autenticación
-bcrypt para cifrado de contraseñas
-dotenv para configuración
-Postman para pruebas

Instalación y Configuración
1️.Clonar el repositorio
git clone https://github.com/Keizel-2005/ProyectoAPI.git

2.Levantar la base de datos con Docker
cd db
docker-compose up -d

3.Instalar dependencias del servidor
cd server
npm init -y: Para inicializar el project con node.js
npm i express mysql2 cors dotenv:Para instalar dependecias express, mysql2, cors y dotenv
npm i -D nodemon:  intalar nodemon
npm install bcrypt jsonwebtoken express-validator

4.Ejecutar el servidor
npm run dev

Roles
- Administrador: Es el usuario con el nivel más alto de permisos dentro del sistema, su función principal es
gestionar y supervisar toda la plataforma, por lo que tiene accesos sin restricciones.
- Usuarios: Son los participantes regulares del sistema, quienes interactúan con los retos y acumulan puntos según sus actividades. Su acceso está enfocado únicamente en las funciones necesarias para participar dentro de la plataforma.

Integrantes 
-Erik Daniel Warnke Vargas
-Keizel Pamela Marchena Bolivar
-Andres Esteban Rodriguez Brizuela 
-Carlos Matías Zuñiga Carazo