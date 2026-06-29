# Hospital Management System

## Proyecto Final — Validación y Verificación de Software

**Escuela Politécnica Nacional — 2026A**

---

## 1. Descripción del Proyecto

Sistema de gestión hospitalaria fullstack que permite administrar **pacientes**, **doctores**, **citas médicas** e **historias clínicas**. El sistema está desarrollado con **Spring Boot 3.3** (backend), **JavaScript/HTML/CSS** (frontend) y **PostgreSQL** (base de datos).

### Stack Tecnológico

| Capa       | Tecnología                    |
|------------|-------------------------------|
| Backend    | Java 17, Spring Boot 3.3, JPA |
| Frontend   | JavaScript, HTML5, CSS3       |
| Base Datos | PostgreSQL 16 (Docker)        |
| Build      | Maven                         |

---

## 2. Objetivo del Proyecto

Este proyecto es una **práctica integral** de validación y verificación de software. El código base contiene **bugs y vulnerabilidades intencionales** que los estudiantes deben detectar mediante:

1. **Pruebas Unitarias** — Backend (JUnit + Mockito) y Frontend (Jest)
2. **Pruebas de Integración** — Backend (Spring Boot Test) y Frontend (Selenium/Playwright)
3. **Análisis Estático de Código** — SonarQube, ESLint, Checkstyle
4. **Análisis de Seguridad OWASP** — OWASP Top 10, SAST

El sistema es **funcional** pero contiene defectos que solo son detectables mediante pruebas sistemáticas.

---

## 3. Requisitos Previos

- **Java 17+**
- **Maven 3.9+**
- **Docker** y **Docker Compose**
- **Node.js 20+** (para herramientas de testing frontend)
- **Postman** o **curl** (para pruebas manuales de API)

---

## 4. Estructura del Proyecto

```
hospital-management/
├── backend/
│   ├── src/main/java/com/hospital/
│   │   ├── HospitalApplication.java
│   │   ├── model/           # Entidades JPA
│   │   ├── dto/             # Objetos de transferencia
│   │   ├── repository/      # Repositorios JPA
│   │   ├── service/         # Lógica de negocio
│   │   ├── controller/      # Controladores REST
│   │   └── exception/       # Manejo de excepciones
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── schema.sql       # DDL - Estructura de la BD
│   │   └── data.sql         # DML - Datos semilla
│   ├── src/test/            # Pruebas (a implementar)
│   └── pom.xml
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js           # Módulo principal
│       ├── api.js           # Comunicación con API REST
│       ├── utils.js         # Utilidades (formateo, validación)
│       ├── pacientes.js     # Módulo de pacientes
│       ├── doctores.js      # Módulo de doctores
│       ├── citas.js         # Módulo de citas
│       └── historias.js     # Módulo de historias clínicas
├── docker-compose.yml
├── README.md
└── DOCUMENTACION.md
```

---

## 5. Instalación y Ejecución

### 5.1 Base de Datos (PostgreSQL con Docker)

```bash
# Iniciar PostgreSQL
docker-compose up -d

# Verificar que este corriendo
docker ps

# Detener la base de datos
docker-compose down
```

### 5.2 Backend (Spring Boot)

```bash
cd backend

# Compilar y ejecutar
./mvnw spring-boot:run

# O si tienes Maven instalado globalmente:
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 5.3 Frontend

Abre el archivo `frontend/index.html` directamente en tu navegador, o usa un servidor web simple:

```bash
cd frontend
python3 -m http.server 3000
```

Luego abre: `http://localhost:3000`

---

## 6. API Endpoints

### Pacientes

| Método | Endpoint                              | Descripción                |
|--------|---------------------------------------|----------------------------|
| GET    | `/api/pacientes`                      | Listar todos               |
| GET    | `/api/pacientes/{id}`                 | Buscar por ID              |
| POST   | `/api/pacientes`                      | Crear paciente             |
| PUT    | `/api/pacientes/{id}`                 | Actualizar paciente        |
| DELETE | `/api/pacientes/{id}`                 | Eliminar paciente          |
| GET    | `/api/pacientes/buscar?nombre=X`      | Buscar por nombre          |
| GET    | `/api/pacientes/estadisticas/edad-promedio` | Edad promedio         |

### Doctores

| Método | Endpoint                                     | Descripción                      |
|--------|----------------------------------------------|----------------------------------|
| GET    | `/api/doctores`                              | Listar todos                     |
| GET    | `/api/doctores/{id}`                         | Buscar por ID                    |
| POST   | `/api/doctores`                              | Crear doctor                     |
| PUT    | `/api/doctores/{id}`                         | Actualizar doctor                |
| DELETE | `/api/doctores/{id}`                         | Eliminar doctor                  |
| GET    | `/api/doctores/buscar-especialidad?q=X`     | Buscar por especialidad          |
| GET    | `/api/doctores/buscar-nombre?nombre=X&apellido=Y` | Buscar por nombre completo |

### Citas

| Método | Endpoint                              | Descripción                |
|--------|---------------------------------------|----------------------------|
| GET    | `/api/citas`                          | Listar todas               |
| GET    | `/api/citas/{id}`                     | Buscar por ID              |
| POST   | `/api/citas`                          | Crear cita                 |
| PUT    | `/api/citas/{id}`                     | Actualizar cita            |
| DELETE | `/api/citas/{id}`                     | Eliminar cita              |
| GET    | `/api/citas/paciente/{pacienteId}`    | Citas por paciente         |
| GET    | `/api/citas/doctor/{doctorId}`        | Citas por doctor           |
| GET    | `/api/citas/estado/{estado}`          | Citas por estado           |
| GET    | `/api/citas/rango-fechas`             | Citas por rango de fechas  |

### Historias Clínicas

| Método | Endpoint                                      | Descripción                     |
|--------|-----------------------------------------------|---------------------------------|
| GET    | `/api/historias-clinicas`                     | Listar todas                   |
| GET    | `/api/historias-clinicas/{id}`                | Buscar por ID                  |
| POST   | `/api/historias-clinicas`                     | Crear historia clínica         |
| GET    | `/api/historias-clinicas/paciente/{id}`       | Historias por paciente         |
| GET    | `/api/historias-clinicas/doctor/{id}`         | Historias por doctor           |

---

## 7. Entregables del Proyecto (Trabajo en Grupo)

El proyecto debe realizarse en **grupos de 3-4 estudiantes**. Cada grupo debe entregar:

### 7.1 Pruebas Unitarias — Backend (30%)

Implementar pruebas unitarias con **JUnit 5** y **Mockito** para:

- `PacienteService`
- `DoctorService`
- `CitaService`
- `HistoriaClinicaService`

Las pruebas deben cubrir casos **normales, límite y de error**. Se debe alcanzar al menos **80% de cobertura** en capa de servicio.

### 7.2 Pruebas Unitarias — Frontend (15%)

Implementar pruebas unitarias con **Jest** para las funciones en:

- `utils.js` (validaciones, formateo)
- `api.js` (mock de fetch)

### 7.3 Pruebas de Integración — Backend (20%)

Implementar pruebas de integración con **Spring Boot Test** (`@SpringBootTest`, `MockMvc`, `TestRestTemplate`) para todos los controladores REST.

### 7.4 Pruebas de Integración — Frontend (15%)

Implementar pruebas end-to-end con **Selenium WebDriver** o **Playwright** que cubran los flujos principales:

- Crear y listar pacientes
- Crear y listar doctores
- Agendar y consultar citas
- Registrar y consultar historias clínicas

### 7.5 Análisis Estático de Código (10%)

Configurar y ejecutar herramientas de análisis estático:

- **Backend**: SonarQube / SonarLint, Checkstyle o SpotBugs
- **Frontend**: ESLint

Entregar un informe con los hallazgos encontrados, clasificados por severidad.

### 7.6 Análisis de Seguridad OWASP (10%)

Realizar un análisis de seguridad basado en el **OWASP Top 10 (2021)**, identificando al menos:

- Vulnerabilidades de inyección (SQL, XSS)
- Exposición de información sensible
- Configuraciones de seguridad incorrectas
- Fallas en control de acceso (CORS)

---

## 8. Bugs Intencionales Incluidos

El código base contiene bugs y vulnerabilidades en las siguientes categorías:

### Backend
- SQL Injection (DoctorService.buscarPorEspecialidadInsegura)
- División por cero (PacienteService.calcularEdadPromedio)
- Status HTTP incorrectos (200 en vez de 201/404)
- N+1 queries (CitaService, CitaRepository)
- Falta de @Transactional (CitaService)
- Exposición de stack traces (GlobalExceptionHandler)
- Falta de validación de FK (creación de citas sin verificar paciente)
- CORS demasiado permisivo (@CrossOrigin origins = "*")
- Falta de paginación en consultas

### Base de Datos
- Falta FOREIGN KEY en citas.paciente_id
- Falta NOT NULL en doctores.especialidad

### Frontend
- XSS (innerHTML sin sanitización)
- Validación de email incorrecta
- Escape HTML incompleto
- Conversión de zona horaria defectuosa
- Falta de debounce en búsquedas
- Eliminación sin confirmación
- Manejo de errores deficiente
- Timeouts no configurados en fetch

---

## 9. Criterios de Evaluación

| Criterio                      | Peso  |
|-------------------------------|-------|
| Pruebas Unitarias Backend     | 30%   |
| Pruebas Unitarias Frontend    | 15%   |
| Pruebas Integración Backend   | 20%   |
| Pruebas Integración Frontend  | 15%   |
| Análisis Estático             | 10%   |
| Análisis Seguridad OWASP      | 10%   |
| **TOTAL**                     | 100%  |

### Puntos Extra
- Identificar bugs NO documentados (+5%)
- Proponer e implementar correcciones (+5%)
- Cobertura de código > 90% (+5%)

---

## 10. Recursos y Referencias

- [Spring Boot Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [OWASP Top 10 (2021)](https://owasp.org/www-project-top-ten/)
- [SonarQube Documentation](https://docs.sonarsource.com/sonarqube/latest/)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

---

## 11. Licencia

Este proyecto es de uso exclusivo para fines educativos en la Escuela Politécnica Nacional.

---

**Profesor:** Christian Suárez  
**Materia:** Validación y Verificación de Software  
**Período:** 2026A
