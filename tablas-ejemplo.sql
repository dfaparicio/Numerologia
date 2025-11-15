 base de datos

CREATE DATABASE IF NOT EXISTS numerologia;
USE numerologia;

-- Tabla usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100),
  fecha_nacimiento DATE,
  estado ENUM('activo', 'inactivo'),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla pagos
CREATE TABLE pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  monto DECIMAL(10,2),
  fecha_pago DATE,
  fecha_vencimiento DATE,
  metodo ENUM('tarjeta','efectivo','transferencia'),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla lecturas
CREATE TABLE lecturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  tipo ENUM('principal','diaria'),
  contenido TEXT,
  fecha_lectura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

+-----------------------+
| Tables_in_numerologia |
+-----------------------+
| lecturas              |
| pagos                 |
| usuarios              |
+-----------------------+

lecturas
+---------------+----------------------------+------+-----+-------------------+-------------------+
| Field         | Type                       | Null | Key | Default           | Extra             |
+---------------+----------------------------+------+-----+-------------------+-------------------+
| id            | int                        | NO   | PRI | NULL              | auto_increment    |
| usuario_id    | int                        | YES  | MUL | NULL              |                   |
| tipo          | enum('principal','diaria') | YES  |     | NULL              |                   |
| contenido     | text                       | YES  |     | NULL              |                   |
| fecha_lectura | timestamp                  | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+---------------+----------------------------+------+-----+-------------------+-------------------+

pagos
+-------------------+--------------------------------------------+------+-----+---------+----------------+
| Field             | Type                                       | Null | Key | Default | Extra          |
+-------------------+--------------------------------------------+------+-----+---------+----------------+
| id                | int                                        | NO   | PRI | NULL    | auto_increment |
| usuario_id        | int                                        | YES  | MUL | NULL    |                |
| monto             | decimal(10,2)                              | YES  |     | NULL    |                |
| fecha_pago        | date                                       | YES  |     | NULL    |                |
| fecha_vencimiento | date                                       | YES  |     | NULL    |                |
| metodo            | enum('tarjeta','efectivo','transferencia') | YES  |     | NULL    |                |
+-------------------+--------------------------------------------+------+-----+---------+----------------+

usuario
+------------------+---------------------------+------+-----+-------------------+-------------------+
| Field            | Type                      | Null | Key | Default           | Extra             |
+------------------+---------------------------+------+-----+-------------------+-------------------+
| id               | int                       | NO   | PRI | NULL              | auto_increment    |
| nombre           | varchar(100)              | YES  |     | NULL              |                   |
| email            | varchar(100)              | YES  |     | NULL              |                   |
| fecha_nacimiento | date                      | YES  |     | NULL              |                   |
| estado           | enum('activo','inactivo') | YES  |     | NULL              |                   |
| fecha_registro   | timestamp                 | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------------+---------------------------+------+-----+-------------------+-------------------+
