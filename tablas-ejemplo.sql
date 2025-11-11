 base de datos

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
