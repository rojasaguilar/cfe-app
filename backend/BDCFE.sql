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

alter table plaza 
add column plazaPadreId UUID references plaza(plazaId) on
	delete
	set
	null;

alter table empleado 
add unique (curp);

alter table empleado
add constraint chk_empleado_rtt_rpe
check(
(rpe is not null and rtt is null)
or
(rpe is null and rtt is not null)
)
