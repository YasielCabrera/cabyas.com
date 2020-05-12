---
title: Django Shell
date: '2020-05-06'
spoiler: Qué es el Shell de Django, cómo funciona y para qué se puede utilizar
cta: 'django-shell'
---

La consola interactiva es una herramienta que nos permite escribir sentencias de código Python al mismo tiempo que se ejecutan. Podemos acceder a esta útil herramienta ejecutando el comando `python` en una consola e inmediatamente podremos escribir cualquier sentencia válida de Python en ella, desde declaración de variables hasta ciclos y clases. Es una potente herramienta para probar pequeñas porciones de código y verificar que se comporta exactamente como queremos.

Un problema que surge cuando estamos en un proyecto con Django es que las configuraciones de este no son cargadas por lo que no tendremos acceso a la base de datos, correo u otras características configurables de Django. A pesar de que podemos ejecutar el código Python que se encarga de cargar estas configuraciones, no es tan sencillo y… a los desarrolladores no nos gusta pasar trabajo por lo que Django viene con un comando que hace esto por nosotros: `shell`.

El shell de django, o consola interactiva funciona exactamente igual que la de Python solo con la diferencia de que podemos, por ejemplo, hacer consultas a la base de datos y esta base de datos será la que está configurada en `settings.py`. En esta consola podemos ejecutar cualquier código que puede ser ejecutado en cualquier parte de un proyecto Django.

## Abriendo el shell

Para abrir el shell solo tenemos que abrir una consola (si tenemos un ambiente virtual, debemos activarlo). Luego se ejecuta el siguiente comando:

```bash
python manage.py shell
```

El [prompt](https://es.wikipedia.org/wiki/Prompt) es indicado por el símbolo `>>>` y en el momento que aparezca podremos comenzar a introducir código. Por cada línea introducida, al presionar `Enter` el resultado se mostrará en la siguiente línea. Si la línea introducida requiere más líneas, por ejemplo, en el caso de los ciclos `for`, el prompt cambiará a tres puntos `...` indicando que esa nueva línea depende de la anterior, en esos casos se debe presionar `Enter` en una línea en blanco para ejecutar todas las líneas anteriores:

```python
>>> print('hello world')  # una línea
hello world 
>>>
>>> for n in range(1, 3):  # múltiples líneas 
...	    print(n)
...
1
2
>>>
```

## 4 cosas que puedes hacer en el shell

Aunque aquí te presento solo 4 casos en los que utilizar el `shell` es muy útil, tu imaginación es el límite, hay muy pocas cosas no puedas hacer en el `shell`.
 
### 1- Interactuar con la base de datos:

Este es uno de los principales usos que le dan los desarrolladores al `shell` de Django. Antes mencioné que podemos ejecutar cualquier código que podríamos poner en cualquier parte de un proyecto en Django, por lo que aquí podremos actualizar, eliminar, crear o pedir información de la base de datos utilizando el ORM.

### 2- Crear consultas complejas:

Crear consultas sencillas es muy fácil y poco probable que nos equivoquemos al hacerlas, pero cuando creamos consultas realmente complejas casi nunca funcionan a la primera (al menos a mí me pasa). Que no funcione no es un problema, veremos el error cuando abramos la página o lo que sea que ejecuta la consulta, el problema es que para saber si funciona o no tenemos que (en la mayoría de los casos): guardar el fichero, esperar a que el servidor de desarrollo cargue los nuevos cambios, abrir el navegador, abrir la página que ejecuta la consulta y si da error, arreglar la consulta y repetir el proceso hasta que funcione. Este proceso puede hacernos perder en algunas ocasiones mucho tiempo. Por eso crear la consulta en la consola interactiva es una buena práctica pues sabremos si hay algo mal tan pronto como presionemos `Enter`.

### 3- Arreglar inconsistencias en producción:

Imaginemos que por alguna razón necesitamos modificar algunos datos en producción, algo sencillo. Podríamos pensar en crear un [comando](https://docs.djangoproject.com/en/3.0/howto/custom-management-commands/) nuevo, pero, ¡solo lo vamos a usar una vez! Otra variante podría ser escribir algún código dentro del proyecto. En ambos casos tendríamos que agregar los cambios a git, probablemente crear un [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests), desplegar los cambios y una vez desplegado el proyecto con los nuevos cambios, si el código no se ejecuta automáticamente, tendríamos que ejecutarlo manualmente. ¡Mucho trabajo! Con el `shell` solo tenemos que conectarnos al servidor de producción, abrir el `shell` y ejecutar el código necesario para realizar los cambios que queremos.

### 4- Enviar correos

La idea principal del `shell` es ejecutar código utilizando la configuración del proyecto por lo que podemos [enviar correos](https://docs.djangoproject.com/en/3.0/topics/email/) fácilmente utilizando esta configuración desde el `shell`:

```python
>>> from django.core.mail import send_mail
>>> 
>>> send_mail(
...     'Hello world',
...     'Hi Jon, I\'m sending this from the shell 😁.',
...     'me@example.com',
...     ['jhon.doe@example.com'],
...     fail_silently=False,
... )
```

## Conslusiones

El `shell` es el lugar perfecto para probar "cosas" en el proyecto, sobre todo cuando se están creando o probando consultas a la base de datos. 
