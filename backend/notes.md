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