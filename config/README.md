# API de Gestión de Horarios de Seguridad

## Descripción del Proyecto
Este proyecto tiene como objetivo proporcionar una API REST para gestionar los horarios, turnos, asistencia y otros aspectos relacionados con una empresa de seguridad.

### Tecnologías Usadas:
- **Node.js** con **Express**
- **PostgreSQL** como base de datos
- **Sequelize** como ORM
- **JWT** para autenticación
- **Docker** para contenerización

## Instrucciones de Despliegue

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Javisolarte/SeguridadPrivada.git
cd SeguridadPrivada
2. Instalar Dependencias
bash
Copiar
Editar
npm install
3. Configuración del Entorno
Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

env
Copiar
Editar
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=seguridad_db
DB_HOST=localhost
PORT=3000
JWT_SECRET=tu_secreto
4. Ejecutar la API
Para iniciar el servidor, ejecuta:

bash
Copiar
Editar
npm start
5. Usar Docker (Opcional)
Si prefieres usar Docker, ejecuta:

bash
Copiar
Editar
docker-compose up --build
Documentación de los Endpoints:
La documentación completa de la API está disponible en http://localhost:3000/api-docs una vez que el servidor esté en funcionamiento.