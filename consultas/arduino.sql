
CREATE TABLE alumnos(
	id_alumno varchar(10),
	nombres varchar(50) NOT NULL,
	apellido_paterno varchar(20) NOT NULL,
	apellido_materno varchar(20) NOT NULL,
	CONSTRAINT pk_alumnos PRIMARY KEY (id_alumno)	
);


CREATE TABLE cursos(
	id_curso varchar(5),
	nombre varchar(100) NOT NULL,
	creditos smallint NOT NULL,
	ciclo smallint NOT NULL,
	ht smallint NOT NULL,
	hp smallint NOT NULL,
	hl smallint NOT NULL,
	hs smallint NOT NULL,
	ha smallint NOT NULL,
	requisito varchar(5),
	CONSTRAINT pk_cursos PRIMARY KEY (id_curso),
	CONSTRAINT uk_cursos_nombre UNIQUE (nombre),
	CONSTRAINT ck_cursos_creditos CHECK (creditos > 0),
	CONSTRAINT ck_cursos_ht CHECK (ht >= 0),
	CONSTRAINT ck_cursos_hp CHECK (hp >= 0),
	CONSTRAINT ck_cursos_hl CHECK (hl >= 0),
	CONSTRAINT ck_cursos_hs CHECK (hs >= 0),
	CONSTRAINT ck_cursos_ha CHECK (ha >= 0)

);

CREATE TABLE docentes(
	id_docente smallserial,
	nombres varchar(50) NOT NULL,
	apellido_paterno varchar(20) NOT NULL,
	apellido_materno varchar(50) NOT NULL,
	email varchar(50) NOT NULL,
	telefono varchar(12)NOT NULL,
	CONSTRAINT pk_docentes PRIMARY KEY (id_docente),
	CONSTRAINT uk_docentes_email UNIQUE (email),
	CONSTRAINT uk_docentes_telefono UNIQUE (telefono)
);

CREATE TABLE grupos(
	id_grupo varchar(3),
	year varchar(4) NOT NULL,
	CONSTRAINT pk_grupos PRIMARY KEY (id_grupo)
);

CREATE TABLE semestres(
	id_semestre smallserial,
	codigo varchar(7) NOT NULL,
	year varchar(4) NOT NULL,
	CONSTRAINT pk_semestres PRIMARY KEY (id_semestre)
);

CREATE TABLE guias(
	id_guia smallserial,
	id_curso varchar(5) NOT NULL,
	id_grupo varchar(3) NOT NULL,
	id_docente smallint NOT NULL,
	id_semestre smallint NOT NULL,
	CONSTRAINT pk_guias PRIMARY KEY (id_guia),
	CONSTRAINT fk_guias_cursos FOREIGN KEY (id_curso)
	REFERENCES cursos (id_curso),
	CONSTRAINT fk_guias_grupos FOREIGN KEY (id_grupo)
	REFERENCES grupos (id_grupo),
	CONSTRAINT fk_guias_docentes FOREIGN KEY (id_docente)
	REFERENCES docentes (id_docente),
	CONSTRAINT fk_guias_semestres FOREIGN KEY (id_semestre)
	REFERENCES semestres (id_semestre),
	CONSTRAINT uk_guias_curso_grupo_docente UNIQUE (id_curso,id_grupo,id_docente,id_semestre) 
);

CREATE TABLE horarios(
	id_horario smallserial,
	dia varchar (2) NOT NULL,
	hora_inicio time NOT NULL,
	hora_fin time NOT NULL,
	id_guia smallint NOT NULL,
	CONSTRAINT pk_horarios PRIMARY KEY (id_horario),
	CONSTRAINT fk_horarios_guias FOREIGN KEY (id_guia)
	REFERENCES guias (id_guia),
	CONSTRAINT ck_horarios_horas CHECK (hora_fin > hora_inicio)
);


CREATE TABLE matriculas(
	id_matricula smallserial,
	id_alumno varchar(10) NOT NULL,
	id_guia smallint NOT NULL,
	CONSTRAINT pk_matriculas PRIMARY KEY (id_matricula),
	CONSTRAINT fk_matriculas_alumnos FOREIGN KEY (id_alumno)
	REFERENCES alumnos (id_alumno),
	CONSTRAINT fk_matriculas_guias FOREIGN KEY (id_guia)
	REFERENCES guias (id_guia)
);


CREATE TABLE asistencias(
	id_asistencia smallserial,
	id_horario smallint NOT NULL,
	fecha timestamp NOT NULL DEFAULT now(),
	CONSTRAINT pk_asistencias PRIMARY KEY (id_asistencia),
	CONSTRAINT fk_asistencias_horarios FOREIGN KEY (id_horario)
	REFERENCES horarios(id_horario)
);

CREATE TABLE alumno_asistencia(
	id_alumno_asistencia smallserial,
	id_asistencia smallint NOT NULL,
	id_alumno varchar(10) NOT NULL,
	fecha timestamp NOT NULL DEFAULT now(),
	CONSTRAINT pk_alumno_asistencia PRIMARY KEY (id_alumno_asistencia),
	CONSTRAINT fk_alumno_asistencia_asistencias FOREIGN KEY (id_asistencia)
	REFERENCES asistencias (id_asistencia),
	CONSTRAINT fk_alumno_asistencia_alumnos FOREIGN KEY (id_alumno)
	REFERENCES alumnos (id_alumno)
);

