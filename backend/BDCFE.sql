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
	puestoId UUID references puesto(puestoId),	
	plazaPadreId UUID references plaza(plazaId),
	departamentoId UUID references departamento(departamentoId),
	activo boolean default true
);
-- USUARIOS/EMPLEADOS
create table empleado (
	empleadoId UUID primary key default gen_random_uuid(),
	rpe VARCHAR (12) unique,
	rtt varchar(12) unique,
	nombres varchar(42) unique not null,
	apellidos varchar(56) not null,
	rfc VARCHAR(13) unique not null,
	curp VARCHAR(18) unique not null,
	plazaId UUID unique references plaza(plazaId),
	fechaNacimiento DATE,
	estadoCivil varchar(10),
	domicilio text,
	telefono text, 
	correo text,	
	fotoUrl text unique,	
	activo boolean default true,
	
	constraint chk_empleado_rtt_rpe
check(
		(rpe is null)
		<>
		(rtt is null)
	 )	
);

create unique index uq_empleado_nombre_normalizado
on
empleado (LOWER(TRIM(nombres)),
LOWER(TRIM(apellidos)));

alter table departamento 
add column responsableId uuid not null DEFAULT '1a2b2606-6e8e-4b14-881d-9186dc316765' references empleado(empleadoId);

ALTER TABLE departamento
ALTER COLUMN responsableId DROP DEFAULT;

create table cuenta_usuario (
    usuarioId UUID primary key default gen_random_uuid(),
    empleadoId UUID unique references empleado(empleadoId),
	email VARCHAR(150) unique not null,
	password VARCHAR(255) not null,
	rol VARCHAR(50) default 'administrador',
	ultimo_acceso TIMESTAMP with TIME zone,
	created_at TIMESTAMP with TIME zone,
	passwordChangedAt TIMESTAMP with TIME zone,
	activo boolean default true	
);

create table bateria (
  bateriaId UUID primary key default gen_random_uuid(),
  puestoId UUID not null references puesto(puestoId),
  departamentoId UUID not null references departamento(departamentoId),
--  puestoSuperiorId UUID REFERENCES puesto(puestoId) ON DELETE SET NULL, DELETED INCONSISTENCY WITH PLAZA-PUESTO-PUESTOSUPERIOR
activo BOOLEAN not null default true,
-- Garantiza que no haya dos baterías con el mismo puesto y departamento
  constraint uq_bateria_puesto_departamento unique (puestoId, departamentoId)
);

create table curso (
 cursoId UUID primary key default gen_random_uuid(),
 codigoCurso varchar(40) unique not null,
 nombre varchar(200) not null,
 horasPracticas smallint not null,
 horasTeoria smallint not null,
 generaDC3 boolean not null,
-- presencial boolean not null default false,
-- virtual boolean not null default false,
tipoCurso varchar(30) not null check(tipoCurso in ('ADMINISTRATIVO', 'ESPECIALIZADO', 'TECNICO', 'SIMULADOR', 'PENDIENTE')),
 activo BOOLEAN not null default true
);

alter table CURSO add constraint curso_tipocurso_check check(tipoCurso in ('ADMINISTRATIVO', 'ESPECIALIZADO', 'TECNICO', 'SIMULADOR', 'PENDIENTE'))

create table especialidad (
	especialidadId UUID primary key default gen_random_uuid(),
	codigoEspecialidad varchar(10) not null,	
	nombreEspecialidad varchar(50) not null	
);

create table cursoEspecialidad (
	especialidadId UUID not null references especialidad (especialidadId),
	cursoId UUID not null references curso (cursoId),
	
	constraint pk_curso_especialidad primary key (especialidadId, cursoId)
);

create table curso_bateria (
  bateriaId UUID not null references bateria(bateriaId),
  cursoId UUID not null references curso(cursoId),

  constraint pk_curso_bateria primary key (bateriaId, cursoId)
);
--create table kardex (
--	kardexId UUID primary key not null default gen_random_uuid(),
--	empleadoId uuid not null references empleado (empleadoId)
--);

create table kardex(
	kardexId UUID primary key not null default gen_random_uuid(),
	empleadoId uuid not null references empleado (empleadoId),
--	kardexId uuid not null references kardex (kardexId),
cursoId uuid not null references curso (cursoId),
	fechaInicioCurso DATE not null ,
	estadoCurso varchar(30) not null check(estadoCurso in ('INSCRITO', 'CURSANDO', 'APROBADO', 'REPROBADO', 'CURSADO_SIN_CALIFICACION')),
	tipoProgramacion varchar(1) not null check(tipoProgramacion in('D', 'F')),
	fechaTerminoCurso DATE,
	modalidad varchar(40) check(modalidad in('PRESENCIAL', 'DISTANCIA (S)', 'DISTANCIA (A)', 'VIDEOCONFERENCIA (S)', 'B-LEARNING (S)', 'SITIO')),
	ubicacion varchar(60),
	calificacion smallint,
	urlDC3 text,
	fechaSubidaDC3 timestamptz,
	
check (
	(
		estadoCurso in ('APROBADO', 'REPROBADO')
		and fechaTerminoCurso is not null
		and calificacion is not null
	)
	or (
		estadoCurso = 'CURSADO_SIN_CALIFICACION'
		and fechaTerminoCurso is not null
		and calificacion is null
	)
	or (
		estadoCurso in ('INSCRITO', 'CURSANDO')
	)
),
check (
		fechaTerminoCurso is null
		or fechaTerminoCurso >= fechaInicioCurso
	  )
);

create table planCapacitacion (
    planId UUID primary key default gen_random_uuid(),

    fechaApertura TIMESTAMPTZ not null default NOW(),
    fechaCierre TIMESTAMPTZ null,
    validoHasta TIMESTAMPTZ not null,

    estado VARCHAR(20) not null default 'ABIERTO'
        check (estado in ('ABIERTO', 'CERRADO', 'CANCELADO')),

    constraint planes_no_translapados
        exclude
	using GIST (
            tstzrange(fechaApertura, validoHasta, '[)') with &&
        )
where
(estado <> 'CANCELADO'),

    constraint chk_plan_capacitacion_fechas
        check (
            fechaApertura < validoHasta
	and (
                (
                    estado = 'ABIERTO'
		and fechaCierre is null
                )
	or
                (
                    estado = 'CERRADO'
		and fechaCierre is not null
		and fechaApertura < fechaCierre
		and fechaCierre <= validoHasta
                )
	or
                (
                    estado = 'CANCELADO'
		and fechaCierre is not null
		and fechaApertura < fechaCierre
                )
            )
        )
);

create table aportes_planCapacitacion(
	aporteId UUID primary key default gen_random_uuid(),
	planId uuid not null references planCapacitacion(planId),
	departamentoId uuid not null references departamento(departamentoId),
	responsableId uuid not null references empleado(empleadoId),
	fechaCreacion TIMESTAMPTZ not null default NOW(),
	fechaRevision TIMESTAMPTZ null,
	fechaEnvio TIMESTAMPTZ null,
	estado varchar(20) not null default 'BORRADOR'
		check (estado in('BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA')),
	motivoRechazo text null,	
	
	constraint uq_plan_departamento
    unique (planId, departamentoId),
    
    constraint chk_aporte_estado
check (
    (
        estado = 'BORRADOR'
        and fechaEnvio is null
        and motivoRechazo is null
    )
    or
    (
        estado = 'ENVIADA'
        and fechaEnvio is not null
        and motivoRechazo is null
    )
    or
    (
        estado = 'APROBADA'
        and fechaEnvio is not null
        and motivoRechazo is null
        and fechaRevision is not null
    )
    or
    (
        estado = 'RECHAZADA'
        and fechaEnvio is not null
        and motivoRechazo is not null
        and LENGTH(TRIM(motivoRechazo)) > 0
          and fechaRevision is not null
    )
    
), constraint chk_aporte_fechas
check (
    (fechaEnvio is null or fechaEnvio >= fechaCreacion)
    and
    (fechaRevision is null or (
        fechaEnvio is not null
        and fechaRevision >= fechaEnvio
    ))
)
);

create table aportacion_cursos_empleados (
	aporteId UUID not null references aportes_planCapacitacion(aporteId),
	empleadoId uuid not null references empleado(empleadoId),
	cursoId uuid not null references curso(cursoId),
	constraint pk_aportacion_cursos_empleados primary key (aporteId, empleadoId, cursoId)
);

CREATE TABLE necesidad (
    necesidadId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    propuestaPor UUID NOT NULL
        REFERENCES empleado(empleadoId),

    departamentoId UUID NOT NULL
        REFERENCES departamento(departamentoId),

    tema TEXT NOT NULL,

    fechaPropuesta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fechaEnvio TIMESTAMPTZ,
    fechaResolucion TIMESTAMPTZ,

    resueltaPor UUID REFERENCES empleado(empleadoId),

    estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR'
        CHECK (estado IN (
            'BORRADOR',
            'PENDIENTE',
            'APROBADA',
            'RECHAZADA',
            'CANCELADA'
        )),

    visibilidad VARCHAR(20) NOT NULL DEFAULT 'PRIVADA'
        CHECK (visibilidad IN (
            'PRIVADA',
            'SELECTIVA',
            'PUBLICA'
        )),

    aceptaAportes BOOLEAN NOT NULL DEFAULT FALSE,

    cursoAsignadoId UUID REFERENCES curso(cursoId),

    motivoRechazo TEXT,

    CONSTRAINT chk_tema_necesidad
        CHECK (LENGTH(TRIM(tema)) > 0),

    CONSTRAINT chk_fechas_vida_necesidad
        CHECK (fechaResolucion >= fechaPropuesta),

    CONSTRAINT chk_fechas_estado
        CHECK (
            (
                estado IN ('BORRADOR', 'PENDIENTE')
                AND fechaResolucion IS NULL
            )
            OR
            (
                estado IN ('APROBADA', 'RECHAZADA', 'CANCELADA')
                AND fechaResolucion IS NOT NULL
            )
        ),

    CONSTRAINT chk_motivo_rechazo
        CHECK (
            estado <> 'RECHAZADA'
            OR (
                motivoRechazo IS NOT NULL
                AND LENGTH(TRIM(motivoRechazo)) > 0
            )
        ),

    CONSTRAINT chk_recepcion_aportes
        CHECK (
            NOT aceptaAportes
            OR (
                estado = 'PENDIENTE'
                AND visibilidad <> 'PRIVADA'
            )
        )
);

CREATE TABLE aporte_necesidad (
    aporteId UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    necesidadId UUID NOT NULL
        REFERENCES necesidad(necesidadId),

    responsableId UUID NOT NULL
        REFERENCES empleado(empleadoId),

    departamentoId UUID NOT NULL
        REFERENCES departamento(departamentoId),

    fechaCreacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    fechaEnvio TIMESTAMPTZ,

    estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR'
        CHECK (estado IN (
            'BORRADOR',
            'ENVIADO',
            'RETIRADO'
        )),

    CONSTRAINT uq_aporte_necesidad_departamento
        UNIQUE (necesidadId, departamentoId)
);

CREATE TABLE cursos_propuestos_necesidad (
    aporteId UUID NOT NULL
        REFERENCES aporte_necesidad(aporteId),

    cursoId UUID NOT NULL
        REFERENCES curso(cursoId),

    PRIMARY KEY (aporteId, cursoId)
);

CREATE TABLE empleados_propuestos_necesidad (
    aporteId UUID NOT NULL
        REFERENCES aporte_necesidad(aporteId),

    empleadoId UUID NOT NULL
        REFERENCES empleado(empleadoId),

    PRIMARY KEY (aporteId, empleadoId)
);

CREATE TABLE necesidad_visibilidad (
    necesidadId UUID NOT NULL
        REFERENCES necesidad(necesidadId),

    departamentoId UUID NOT NULL
        REFERENCES departamento(departamentoId),

    autorizadoPor UUID NOT NULL
        REFERENCES empleado(empleadoId),

    fechaAutorizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (necesidadId, departamentoId)
);
