--ORGANIGRAMA
create table departamento (
	departamentoId UUID primary key default gen_random_uuid(),
	nombre VARCHAR (56) unique not null,
	activo boolean default true
);

create table PUESTO (
	puestoId UUID primary key default gen_random_uuid(),
	nombrePuesto varchar(50) not null,
	activo boolean default true
);

create table PLAZA (
	plazaId UUID primary key default gen_random_uuid(),
	noPlaza varchar(30) unique not null,
	puestoId UUID references puesto(puestoId) on
delete
	cascade,	
	plazaPadreId UUID references plaza(plazaId),
	departamentoId UUID references departamento(departamentoId) on
	delete
		cascade,
		activo boolean default true
);
-- USUARIOS/EMPLEADOS
create table empleado (
	empleadoId UUID primary key default gen_random_uuid(),
	rpe VARCHAR (12) unique not null,
	rtt varchar(12) unique,
	nombres varchar(42) unique not null,
	apellidos varchar(56) not null,
	rfc VARCHAR(13) unique not null,
	curp VARCHAR(18) unique not null,
	plazaId UUID unique references plaza(plazaId) on
delete
	cascade,
	activo boolean default true,
	
	constraint chk_empleado_rtt_rpe
check(
		(rpe is NULL)
		<>
		(rtt is null)
	 )	
);

create table cuenta_usuario (
    usuarioId UUID primary key default gen_random_uuid(),
    empleadoId UUID unique references empleado(empleadoId) on
delete
	cascade,
	email VARCHAR(150) unique not null,
	password VARCHAR(255) not null,
	rol VARCHAR(50) default 'administrador',
	ultimo_acceso TIMESTAMP with TIME zone,
	created_at TIMESTAMP with TIME zone,
	passwordChangedAt TIMESTAMP with TIME zone,
	activo boolean default true	
);

CREATE TABLE bateria (
  bateriaId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  puestoId UUID NOT NULL REFERENCES puesto(puestoId),
  departamentoId UUID NOT NULL REFERENCES departamento(departamentoId),
--  puestoSuperiorId UUID REFERENCES puesto(puestoId) ON DELETE SET NULL, DELETED INCONSISTENCY WITH PLAZA-PUESTO-PUESTOSUPERIOR
  activo BOOLEAN NOT NULL DEFAULT true,

  -- Garantiza que no haya dos baterías con el mismo puesto y departamento
  CONSTRAINT uq_bateria_puesto_departamento UNIQUE (puestoId, departamentoId)
);

create table curso (
 cursoId UUID primary key default gen_random_uuid(),
 codigoCurso varchar(40) unique not null,
 nombre varchar(200) not null,
 horasPracticas smallint not null,
 horasTeoria smallint not null,
 generaDC3 boolean not null,	
 activo BOOLEAN not null default true
);

CREATE TABLE curso_bateria (
  bateriaId UUID NOT NULL REFERENCES bateria(bateriaId) ON DELETE CASCADE,
  cursoId UUID NOT NULL REFERENCES curso(cursoId) ON DELETE CASCADE

  CONSTRAINT pk_curso_bateria PRIMARY KEY (bateriaId, cursoId)
);

drop table curso
drop table curso_bateria
--UTILS

update
	cuenta_usuario
set
	passwordChangedAt = NOW()
where
	usuarioId = '4ec4db62-a452-45b0-bc5a-3febe46dd6ad';

alter table cuenta_usuario add column passwordChangedAt TIMESTAMP with TIME zone;

alter table empleado add column plazaId UUID unique references plaza(plazaId) on
delete
	cascade;

select
	pl.noPlaza as noPlaza,
	pl.plazaId,
	pu.nombrePuesto as nombrePuesto,
	pu.puestoId,
	e.empleadoId,
	e.rpe as rpe,
	e.rtt as rtt,
	e.nombres as empleado_nombres
from
	plaza pl
inner join puesto pu on
	pl.puestoId = pu.puestoId
left join empleado e on
	pl.plazaId = e.plazaId
	and e.activo = true
where
	pl.departamentoId = 'b4f66c6b-8a7b-4014-86e1-6dd9e52fccdf'

INSERT INTO curso (
  codigoCurso,
  nombre,
  horasPracticas,
  horasTeoria,
  generaDC3,
  activo
)
VALUES
  (
    'CFE-SEG-001',
    'Seguridad e higiene en subestaciones eléctricas',
    16,
    8,
    true,
    true
  ),
  (
    'CFE-MAT-004',
    'Mantenimiento preventivo de transformadores de potencia',
    20,
    12,
    true,
    true
  ),
  (
    'CFE-CAP-012',
    'Procedimientos de consignación y libranza en líneas de transmisión',
    12,
    8,
    true,
    true
  ),
  (
    'CFE-NOR-008',
    'Normatividad técnica y operación del sistema eléctrico nacional',
    0,
    16,
    false,
    true
  );
