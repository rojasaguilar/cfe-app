CREATE TABLE empleado (
	empeadoId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	rpe VARCHAR (12) NOT NULL,
	rtt varchar(12),
	nombres varchar(42) NOT NULL,
	apellidos varchar(56) NOT NULL,
--	noPlaza
	rfc VARCHAR(13) NOT NULL,
	curp VARCHAR(18) NOT NULL,
	activo boolean DEFAULT TRUE
);

CREATE TABLE cuenta_usuario (
    usuarioId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empeadoId UUID UNIQUE REFERENCES empleado(empeadoId) ON DELETE CASCADE,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'administrador',
    ultimo_acceso TIMESTAMP WITH TIME ZONE
);