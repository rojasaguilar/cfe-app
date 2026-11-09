--ORGANIGRAMA
CREATE TABLE departamento (
	departamentoId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre VARCHAR (56) unique NOT NULL,
	activo boolean DEFAULT TRUE
);

create table PUESTO (
	puestoId UUID primary key default gen_random_uuid(),
	nombrePuesto varchar(50) not null,
	activo boolean default TRUE
);

create table PLAZA (
	plazaId UUID primary key default gen_random_uuid(),
	noPlaza varchar(30) unique not null,
	puestoId UUID references puesto(puestoId) on delete cascade,	
	plazaPadreId UUID references plaza(plazaId),
	departamentoId UUID references departamento(departamentoId) on delete cascade,
	activo boolean default TRUE
);

-- USUARIOS/EMPLEADOS
CREATE TABLE empleado (
	empleadoId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	rpe VARCHAR (12) NOT NULL,
	rtt varchar(12),
	nombres varchar(42) NOT NULL,
	apellidos varchar(56) NOT NULL,
	rfc VARCHAR(13) NOT NULL,
	curp VARCHAR(18) NOT NULL,
	plazaId UUID unique references plaza(plazaId) on delete cascade,
	activo boolean DEFAULT TRUE
);

CREATE TABLE cuenta_usuario (
    usuarioId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleadoId UUID UNIQUE REFERENCES empleado(empleadoId) ON DELETE CASCADE,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'administrador',
    ultimo_acceso TIMESTAMP WITH TIME zone,
    created_at TIMESTAMP WITH TIME zone,
    passwordChangedAt TIMESTAMP WITH TIME zone,
    activo boolean DEFAULT true	
);



--UTILS

UPDATE cuenta_usuario 
SET passwordChangedAt = NOW() 
WHERE usuarioId = '4ec4db62-a452-45b0-bc5a-3febe46dd6ad';

alter table cuenta_usuario add column  passwordChangedAt TIMESTAMP WITH TIME zone;

alter table empleado add column plazaId UUID unique references plaza(plazaId) on delete cascade;


SELECT 
  pl.noPlaza AS noPlaza, 
  pl.plazaId,
  pu.nombrePuesto AS nombrePuesto,
  pu.puestoId,
  e.empleadoId,
  e.rpe AS rpe,
  e.rtt as rtt,
  e.nombres AS empleado_nombres
FROM plaza pl
INNER JOIN puesto pu ON pl.puestoId = pu.puestoId
LEFT JOIN empleado e ON pl.plazaId = e.plazaId AND e.activo = true
WHERE pl.departamentoId = 'b4f66c6b-8a7b-4014-86e1-6dd9e52fccdf'

ALTER TABLE plaza 
ADD COLUMN plazaPadreId UUID REFERENCES plaza(plazaId) ON DELETE SET NULL;

delete from plaza where activo = false

