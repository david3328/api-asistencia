--INSERTAR ASISTENCIA DEL ALUMNO
INSERT INTO alumno_asistencia(id_asistencia,id_alumno)
VALUES ($1,$2)

--VERIFICAR SI EL ALUMNO ESTA MATRICULADO
SELECT G.id_guia INTO _response FROM guias AS G 
INNER JOIN matriculas AS M ON M.id_guia = G.id_guia
INNER JOIN horarios AS H ON H.id_guia = G.id_guia
INNER JOIN asistencias AS A ON A.id_horario = H.id_horario
WHERE M.id_alumno = ? AND A.id_asistencia = ? 

--SELECCIONAR TELEFONO DEL DOCENTE SEGUN ASISTENCIA
SELECT D.telefono FROM docentes AS D 
INNER JOIN guias AS G ON G.id_docente = D.id_docente
INNER JOIN horarios AS H ON H.id_guia = G.id_guia
INNER JOIN asistencias AS A ON A.id_horario = H.id_horario
WHERE A.id_asistencia = $1 

--FUNCION PARA OBTENER TELEFONO DEL DOCENTE
CREATE OR REPLACE FUNCTION fn_telefono(_idasistencia smallint)
RETURNS character varying AS 
$BODY$
DECLARE _telefono varchar(12);
BEGIN
	SELECT D.telefono INTO _telefono FROM docentes AS D 
	INNER JOIN guias AS G ON G.id_docente = D.id_docente
	INNER JOIN horarios AS H ON H.id_guia = G.id_guia
	INNER JOIN asistencias AS A ON A.id_horario = H.id_horario
	WHERE A.id_asistencia = _idasistencia;
	IF _telefono IS NULL THEN
		RAISE EXCEPTION 'No se encuentra número telefónico';
	END IF;
	RETURN _telefono;
END;
$BODY$
LANGUAGE plpgsql;

DROP FUNCTION fn_asistencia(varchar,smallint)
--FUNCION PARA REGISTRAR ASISTENCIA DEL ALUMNO Y VERIFICAR SI PERTENECE AL CURSO
CREATE OR REPLACE FUNCTION fn_asistencia(_idalumno varchar, _idasistencia smallint,_fecha timestamp)
RETURNS smallint AS
$BODY$
DECLARE _response smallint;
BEGIN
	SELECT G.id_guia INTO _response FROM guias AS G 
	INNER JOIN matriculas AS M ON M.id_guia = G.id_guia
	INNER JOIN horarios AS H ON H.id_guia = G.id_guia
	INNER JOIN asistencias AS A ON A.id_horario = H.id_horario
	WHERE M.id_alumno = _idalumno AND A.id_asistencia = _idasistencia;
	INSERT INTO alumno_asistencia(id_asistencia,id_alumno,fecha) VALUES (_idasistencia,_idalumno,_fecha);
	IF _response IS NULL THEN
		_response = 0;
	END IF; 
	RETURN _response;
END;
$BODY$
LANGUAGE plpgsql;
SELECT fn_asistencia('132036C'::varchar,2::smallint)
SELECT * FROM alumnos
SELECT * FROM alumno_asistencia
--CREAR ASISTENCIA 
INSERT INTO asistencias (id_horario) VALUES ($1) RETURNING id_asistencia
