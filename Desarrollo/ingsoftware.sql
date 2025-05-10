create database IngSoftware;
use IngSoftware;
-- Tabla de Roles
CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Usuarios
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- Tabla de Instituciones
CREATE TABLE Institucion (
    id_institucion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_institucion VARCHAR(200) NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_acreditacion VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Tabla de Empresas
CREATE TABLE Empresa (
    id_empresa INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_empresa VARCHAR(200) NOT NULL,
    industria VARCHAR(100),
    direccion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Tabla de Estudiantes
CREATE TABLE Estudiante (
    id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    documento_identidad VARCHAR(50) NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    genero VARCHAR(20),
    nacionalidad VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- Tabla de Certificados
CREATE TABLE Certificado (
    id_certificado INT AUTO_INCREMENT PRIMARY KEY,
    id_institucion INT NOT NULL,
    id_estudiante INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    programa_academico VARCHAR(200) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_finalizacion DATE NOT NULL,
    promedio DECIMAL(5,2),
    creditos INT,
    estado ENUM('ACTIVO', 'REVOCADO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    descripcion TEXT,
    archivo_url VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_institucion) REFERENCES Institucion(id_institucion),
    FOREIGN KEY (id_estudiante) REFERENCES Estudiante(id_estudiante)
);

-- Tabla de Certificados en Blockchain
CREATE TABLE CertificadoBlockchain (
    id_blockchain INT AUTO_INCREMENT PRIMARY KEY,
    id_certificado INT NOT NULL,
    hash_certificado VARCHAR(255) NOT NULL UNIQUE,
    direccion_contrato VARCHAR(100) NOT NULL,
    id_transaccion VARCHAR(100) NOT NULL,
    bloque INT NOT NULL,
    fecha_registro TIMESTAMP NOT NULL,
    FOREIGN KEY (id_certificado) REFERENCES Certificado(id_certificado)
);

-- Tabla de Verificaciones
CREATE TABLE Verificacion (
    id_verificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_certificado INT NOT NULL,
    id_usuario_verificador INT NOT NULL,
    fecha_verificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado ENUM('VALIDO', 'INVALIDO', 'REVOCADO') NOT NULL,
    direccion_ip VARCHAR(50),
    dispositivo VARCHAR(100),
    FOREIGN KEY (id_certificado) REFERENCES Certificado(id_certificado),
    FOREIGN KEY (id_usuario_verificador) REFERENCES Usuario(id_usuario)
);

-- Tabla de Alertas de Fraude
CREATE TABLE AlertaFraude (
    id_alerta INT AUTO_INCREMENT PRIMARY KEY,
    id_certificado INT,
    hash_certificado VARCHAR(255),
    tipo_alerta VARCHAR(100) NOT NULL,
    severidad ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_deteccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE', 'INVESTIGANDO', 'RESUELTO', 'FALSO_POSITIVO') DEFAULT 'PENDIENTE',
    id_usuario_reportador INT,
    FOREIGN KEY (id_certificado) REFERENCES Certificado(id_certificado),
    FOREIGN KEY (id_usuario_reportador) REFERENCES Usuario(id_usuario)
);

-- Tabla de Actividad del Sistema
CREATE TABLE ActividadSistema (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    tipo_actividad VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direccion_ip VARCHAR(50),
    dispositivo VARCHAR(100),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);