Here are your tables in Markdown. Just copy each one and take screenshots:

---

## Entidad: Usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único del usuario |
| name | string | Nombre del usuario |
| last_name | string | Apellido del usuario |
| date_of_birth | date | Fecha de nacimiento |
| email | string | Correo electrónico |
| phone | string | Número de teléfono |
| password_hash | string | Contraseña encriptada |
| user_type | string | Tipo de usuario (gov, student, police) |
| discount_percentage | int | Porcentaje de descuento asignado |
| is_active | boolean | Estado activo del usuario |
| created_at | datetime | Fecha de creación del registro |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Billeteras

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único de la billetera |
| user_id | string | ID del usuario propietario |
| payment_methods | array | Métodos de pago asociados |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Métodos de Pago

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único del método de pago |
| wallet_id | string | ID de la billetera asociada |
| user_id | string | ID del usuario propietario |
| method_type | string | Tipo de método (card) |
| is_default | boolean | Si es el método por defecto |
| is_active | boolean | Estado activo del método |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Tarjetas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único de la tarjeta |
| user_id | string | ID del usuario propietario |
| name_on_card | string | Nombre en la tarjeta |
| card_number | string | Número de la tarjeta (encriptado) |
| expiry_date | string | Fecha de vencimiento |
| cvv | string | Código de seguridad (encriptado) |
| card_type | string | Tipo de tarjeta (visa, mastercard) |
| is_default | boolean | Si es la tarjeta por defecto |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Transacciones

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único de la transacción |
| user_id | string | ID del usuario |
| payment_method | string | Método de pago utilizado |
| amount | float | Monto original |
| discount_applied | float | Descuento aplicado |
| final_amount | float | Monto final cobrado |
| type | string | Tipo de transacción (trip_payment) |
| status | string | Estado (completed, pending) |
| bus_id | string | ID del autobús |
| route_id | string | ID de la ruta |
| trip_id | string | ID del viaje |
| fare_snapshot_id | string | ID de la tarifa aplicada |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Conductores

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único del conductor |
| name | string | Nombre del conductor |
| email | string | Correo electrónico |
| phone | string | Número de teléfono |
| license_number | string | Número de licencia de conducir |
| license_expiry | date | Fecha de vencimiento de la licencia |
| status | string | Estado (active, inactive) |
| rating | float | Calificación promedio |
| hire_date | date | Fecha de contratación |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Autobuses

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único del autobús |
| plate_number | string | Número de placa |
| model | string | Modelo del autobús |
| capacity | int | Capacidad de pasajeros |
| year | int | Año del vehículo |
| maintenance_status | string | Estado de mantenimiento |
| current_latitude | float | Latitud actual |
| current_longitude | float | Longitud actual |
| speed | float | Velocidad actual |
| status | string | Estado (in_service, out_of_service) |
| last_updated | datetime | Última actualización de ubicación |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Paradas de Ruta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único de la parada |
| route_id | string | ID de la ruta asociada |
| stop_name | string | Nombre de la parada |
| latitude | float | Latitud de la parada |
| longitude | float | Longitud de la parada |
| stop_order | int | Orden de la parada en la ruta |
| is_active | boolean | Estado activo de la parada |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Asignaciones de Conductor

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único de la asignación |
| driver_id | string | ID del conductor |
| bus_id | string | ID del autobús |
| route_id | string | ID de la ruta |
| assigned_date | date | Fecha de asignación |
| shift_start | time | Hora de inicio del turno |
| shift_end | time | Hora de fin del turno |
| status | string | Estado (active, completed) |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Viajes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único del viaje |
| bus_id | string | ID del autobús |
| route_id | string | ID de la ruta |
| driver_id | string | ID del conductor |
| fare_snapshot_id | string | ID de la tarifa aplicada |
| start_time | datetime | Hora de inicio del viaje |
| end_time | datetime | Hora de finalización |
| status | string | Estado (in_progress, completed) |
| current_stop_order | int | Parada actual |
| passenger_count | int | Cantidad de pasajeros |
| total_revenue | float | Ingreso total del viaje |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Viajes de Pasajeros

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| user_id | string | ID del usuario |
| trip_id | string | ID del viaje |
| transaction_id | string | ID de la transacción |
| boarded_at | datetime | Hora de abordaje |
| exited_at | datetime | Hora de salida |
| status | string | Estado (in_transit, completed) |
| fare_amount | float | Monto de la tarifa |
| discount_applied | float | Descuento aplicado |
| final_amount | float | Monto final |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---

## Entidad: Historial de Tarifas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | Identificador único |
| route_id | string | ID de la ruta |
| base_fare | float | Tarifa base |
| effective_date | datetime | Fecha de entrada en vigor |
| end_date | datetime | Fecha de finalización |
| reason | string | Motivo del cambio |
| modified_by | string | ID del administrador que modificó |
| created_at | datetime | Fecha de creación |
| updated_at | datetime | Fecha de última actualización |

---
