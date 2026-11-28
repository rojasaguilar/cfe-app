1. Aunque no tenga bateria acutal, pero si superior, deberia dejarme ver la superior al menos.


4. ¿Cómo determinar cuál es el plan activo?
Aquí hay algo importante en tu modelo: tienes dos conceptos diferentes.
- Vigencia: determina cuándo el plan está activo.
- Periodo de modificación: determina hasta cuándo se permiten modificaciones.
Por lo tanto, puedes consultar el plan vigente así:
```sql
    SELECT *
    FROM planCapacitacion
    WHERE NOW() >= fechaApertura
    AND NOW() < validoHasta;
```

Y determinar si todavía permite modificaciones:

```sql
    SELECT *
    FROM planCapacitacion
    WHERE NOW() >= fechaApertura
    AND NOW() < fechaCierre;
```

tengo una pregunta. Haré un sistema en el cual, tendré el registro de los cursos tomados por los empleados. Tengo uan tabla curso con datos como nombrCurso, modalidad, generaConstancia, horaspracticas, horasTeoria, siendo cada curso unique en esta tabla (el catalogo de cursos). Tengo otra tabla donde haré el historial de cada empleados de los cursos que han tomado, pero el problema es que se pueden tomar un mismo curso un año por ejepmlo presencial (en zacatecas), luego al siguiente mes otro lo cursa pero en queretaro y otro lo cursa pero online, esas distinciones de donde y CUANDO tomó el curso, donde las deber;ía de almacenar? y ademas, debo poder saber 


# hostname podman
`host.containers.internal`

# Events
```js
plan.created
login


# Plan
Paso	Frontend						Backend
1	Definir vigencia y datos generales del programa	
2	Seleccionar archivo Excel	
3	Solicitar análisis del archivo				Extraer y validar información
4	Mostrar resultados del análisis				Comparar claves contra el catálogo de cursos
5	Completar información faltante o dejarla pendiente	
6	Revisar resumen de importación	
7	Confirmar creación del programa y su oferta		Validar nuevamente y persistir mediante una transacción
8	Mostrar resultado de la operación	
9. 								Notificar jefes de departamento/administradores
Aportar 

1. seleccionar plan
2. Click generar aportacion 
	2.1 Crear AportesPlan (planId, departamentoId, responsableId, now(), 'BORRADOR')
3. Seleccionar empleados y cursos
4. Botón guradar cambios
	4.1 Insertar cursos_empleados_aportacion (aporteId, empleadoId, cursoId)
5. Enviar aporte
	5.1 Insertar pendientes cursos_empleados_aportacion (aporteId, empleadoId, cursoId)
	5.2 Update AportesPlan (planId, fechaEnvio, 'ENVIADA')
6. Desactivar boton agregar empleados