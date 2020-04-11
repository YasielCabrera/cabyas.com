---
title: Creando un proyecto con Django
date: '2020-04-05'
spoiler: Primeros pasos.
---

Django es un framework web de alto nivel que permite el desarrollo rápido de aplicaciones siguiendo el patrón de diseño [MTV](https://uniwebsidad.com/libros/django-1-0/capitulo-5/el-patron-de-diseno-mtv). Desarrollado y mantenido por excelentes programadores de la comunidad, Django se encarga de gran parte de las complicaciones del desarrollo web, por lo que puedes escribir tu aplicación sin inventar la rueda de una forma elegante y sencilla. “Sencillo” es la palabra fundamental diría yo.

>La meta fundamental de Django es facilitar la creación de sitios web complejos. Django pone énfasis en el re-uso, la conectividad y extensibilidad de componentes, el desarrollo rápido y el principio No te repitas (DRY, del inglés Don't Repeat Yourself).

- [Objetivos](#objetivos)
- [Entorno](#entorno)
  - [Instalación de Python](#instalaci%c3%b3n-de-python)
  - [Creación de un ambiente virtual](#creaci%c3%b3n-de-un-ambiente-virtual)
  - [Instalación de Django](#instalaci%c3%b3n-de-django)
  - [Eligiendo un IDE](#eligiendo-un-ide)
- [Creando el proyecto](#creando-el-proyecto)
  - [Guardando las dependencias](#guardando-las-dependencias)
- [Creando la primera App](#creando-la-primera-app)
  - [Instalando la aplicación](#instalando-la-aplicaci%c3%b3n)
  - [Primera página](#primera-p%c3%a1gina)

## Objetivos

¿Todo debe tener un objetivo verdad? Pues el nuestro, como podrán deducir, es crear un proyecto con Django. Pero, ¿sobre qué? ¡Un clásico! Haremos una aplicación de **Todo**. Si, de esas donde pones tareas que quieres hacer y las vas marcando según las termines.

Va a tener súper poderes, pero no hablemos ahora de eso, ya veremos más artículos donde detallaremos mejor la idea. Por ahora, nos vamos a concentrar en instalar Django y crear la estructura básica. Exactamente lo que tenemos que hacer cada vez que iniciamos cualquier proyecto con Django.

## Entorno

Al inicio dije que Django es un framework escrito en Python y Python es un lenguaje interpretado, por tanto, necesitamos un intérprete instalado en nuestra computadora para poder ejecutar cualquier código escrito en Python. Así que lo primero que haremos es instalar Python si no lo hemos hecho.

### Instalación de Python

Si has hecho tu tarea parcialmente, habrás visto que existen dos “versiones principales”: la 2 y la 3. Desde el primero de enero de este año (2020) los [creadores dejaron de darle soporte a la versión 2](https://www.python.org/doc/sunset-python-2/), por lo que a menos que tengas un sistema legacy o realmente no tengas más remedio, ¡siempre usa la versión 3!

Descarga la última versión de Python desde la [página oficial](https://www.python.org/downloads/).

En el caso de Windows el proceso de instalación es muy sencillo, el típico “siguiente”, “siguiente” … Solo tener en cuenta en la primera ventana, marcar la opción **Add Python 3.8 to PATH** de lo contrario lo tendrás que hacer manual más tarde.

Si usas Linux puedes consultar [este enlace](https://realpython.com/installing-python/) para ayudarte en la instalación. Comprueba primero si no está instalado, en muchas distribuciones viene por defecto. Puedes consultarlo con `python --version` o `python3 --version`.


### Creación de un ambiente virtual

Anteriormente he escrito [un artículo](/virtualenv-python/) donde explico para qué usamos los ambientes virtuales, así como el proceso de instalación y creación de estos.

Si no sabes que son los ambientes virtuales o como instalarlos, te recomiendo primero leer el artículo que te mencioné. **Te recomiendo que no continúes hasta que no hayas instalado, creado y activado un ambiente virtual.**

### Instalación de Django

Si ya tenemos instalado el ambiente virtual, podemos proceder a instalar Django. Es MUY sencillo: solo tenemos que correr un comando en nuestra consola. Así que abrimos la consola y ejecutamos el siguiente comando (aún no lo hagas):

```bash
pip install django
```

Con el comando anterior habremos instalado Django en nuestro ambiente, de esta forma habremos instalado la última versión publicada de Django, ¿acaso no es eso bueno? Sí, pero casi siempre hay un *“pero”*, y aquí hay uno que tenemos que tener en cuenta.

LTS, ¿has escuchado, visto o sabes lo que significan esas siglas? Pues significa *“Long Time Support”*, y es un apellido que se le pone, no solo en Django, sino en la mayoría de las versiones de software a las cuales los creadores tienen planificado darle soporte a largo plazo. Y, por tanto, la comunidad en general producirá “soluciones” que tengan la mayor compatibilidad posible con estas versiones. ¿Por qué con este tipo de versiones y no con todas? Bueno, pues las demás versiones por lo general solo tienen unos pocos meses de soporte mientras las LTS tienen años, así que son más estables… teóricamente 😅.

En el caso que nos importa ahora mismo: Django. El periodo de soporte de las versiones no LTS es de 1 año y 3 meses aproximadamente, mientras que el periodo de las LTS es de 3 años. El equipo de desarrollo de Django está comprometido a sacar versiones LTS cada 2 años según la página oficial. La última versión LTS es la 2.2 con soporte hasta abril del 2022.

Por cuestiones de compatibilidad es buena idea mantener la última versión LTS, pero en materias de seguridad, lo mejor es mantener la última versión. Por lo que, a menos que necesites algunos paquetes que no soporten las últimas versiones de Django, instala la más reciente. Las aplicaciones son como los carros, hay que darles mantenimiento regularmente, por lo que hay que mantenerlas actualizadas.

Si necesita instalar una versión especifica de Django, por ejemplo: la última versión LTS (en el momento de escribir este artículo es la 2.2) lo podemos hacer de la siguiente forma:

```bash
pip install django==2.2
```

Como se puede deducir, para instalar una versión especifica se hace especificando la versión de esta forma `<paquete>==<versión>`.

### Eligiendo un IDE

Siempre un buen IDE es excelente para acelerar el proceso de desarrollo y la experiencia del desarrollador (DX). Para crear una aplicación con Django podemos hacerlos desde el bloc de notas o cualquier otro editor de texto, pero para que malgastarnos la vida 🤔. Según mis gustos [Pycharm](https://www.jetbrains.com/pycharm) debe ocupar el primer puesto en los IDEs para desarrollo en Python y por “transitividad”, en Django 😁. Pycharm tiene un excelente soporte para Python, de eso no cabe duda alguna. Pero en el caso de Django, solo Pycharm Profesional tiene buen soporte (muy bueno) no siendo así en la versión gratis para la comunidad. Aunque la versión profesional es muy buena, [no es barata](https://www.jetbrains.com/pycharm/buy), pero para todo aquel que pueda, se la recomiendo, no creo que se arrepienta.

Otro “IDE” es [Visual Studio Code](https://code.visualstudio.com/), muy bueno y gratis, aunque hay que instalarle algunas extensiones para darle un poco de *súper poderes* si no queremos volvernos locos. Otras buenas elecciones son: [Atom](https://atom.io/), [Sublime Text](https://www.sublimetext.com/),[Visual Studio](https://visualstudio.microsoft.com/) que trae un excelente soporte para Python y para Django también, entre otros.

Elegir un IDE es algo complejo y que depende mucho de tus gustos y necesidades. ¿Mi recomendación? Utiliza varios hasta que encuentres uno con el que te sientas cómodo.


## Creando el proyecto

¡La hora de la verdadera diversión ha llegado! Llegados a este punto ya tenemos nuestro entorno preparado: tenemos Python instalado, un ambiente virtual activado, Django instalado y un IDE listo para escribir código. 

Para crear nuestro proyecto, abrimos una consola y nos movemos con `cd` hasta el directorio donde queremos crear el proyecto. Luego ejecutamos el comando `django-admin startproject todo_project` para crearlo. Esto habrá creado un directorio `todo_project` que es el nombre que le puse al proyecto, pero le puedes llamar como desees, aunque recomiendo no utilizar caracteres extraños, puede que de algunos problemas en integraciones con otras herramientas/softwares con los que puedas integrarlo en el futuro. El directorio `todo_project` tendrá la siguiente estructura:

```sln
manage.py
todo_project
  __init__.py
  settings.py
  urls.py
  asgi.py
  wsgi.py
```

Estos archivos son:
- **manage.py**: Una utilidad de la línea de comandos que le permite interactuar con este proyecto.
- ** todo_project**: En este directorio se encuentran los ficheros principales de configuración del proyecto. El nombre de este directorio varia en dependencia de nombre del proyecto.
- **__init__.py**: Un fichero vacío que indica que este directorio debe ser considerado como un [paquete Python](https://docs.python.org/3/tutorial/modules.html#tut-packages). 
- **settings.py**: En este fichero se almacenan todos los ajustes y configuraciones del proyecto.
- **urls.py**: Aquí es donde declaramos todas las URLs del proyecto. Más adelante vamos a verlo en acción 😉.
- **asgi.py** y **wsgi.py**: Estos ficheros son los puntos de entrada para que los servidores de [ASGI](https://readthedocs.org/projects/asgi/downloads/pdf/latest/) o [WSGI](https://en.wikipedia.org/wiki/Web_Server_Gateway_Interface) puedan servir el proyecto.

Podemos comprobar que el proyecto funciona iniciando el servidor de desarrollo que tiene Django incluido, que aunque no está preparado para funcionar en un ambiente de producción, nos es muy útil durante el desarrollo del proyecto. Para ello, ejecute el siguiente comando:

```bash
python manage.py runserver
```

Al abrir en el navegador la ruta `http://localhost:8000` obtendremos una vista como la siguiente indicando que la creación del proyecto se hizo correctamente.

![Proyecto corriendo en el navegador](runserver.jpg)

Bien, ¡ya creamos nuestro proyecto!

### Guardando las dependencias

Guardar las dependencias del proyecto es algo importante. Normalmente en cualquier proyecto puedes tener varias decenas de dependencias, o quizás más. Por lo que si necesitas pasar el proyecto a un compañero de equipo, o lo despliegas en otra computadora, o simplemente reinstalas tu computadora y necesitas instalarlas de nuevo necesitarás una forma sencilla de instalarlas todas y aprender de memoria todos los paquetes que has instalado solo funcioná si es este proyecto introductorio que solo hemos instalado Django.

En python se utiliza el comando `freeze` de `pip` para listar todos los paquetes instalados en el ambiente actual (he aquí otra importancia de tener un ambiente virtual). Por tanto podemos utilizar el comando `pip freeze` y redireccionar el flujo hacia un fichero y así guardar todas las dependencias. Sería de esta forma:

```bash
pip freeze > requirements.txt
```

Ahora en el fichero `requirements.txt` estará una lista con todas las dependencias que necesita el proyecto. Si vemos el contenido del fichero nos daremos cuenta que hay más paquetes de los que instalamos, esto es porque aquí se listan todas las dependencias de nuestros paquetes:

```yaml{2}
asgiref==3.2.7
Django==3.0.5
pytz==2019.3
sqlparse==0.3.1
```

Si en el futuro queremos instalar todas las dependencias basta con activar el ambiente virtual y ejecutar el comando `pip install -r requirements.txt`.

## Creando la primera App

Cuando inicié con Django una de las primeras preguntas que me hice fue: ¿Cuál es la diferencia entre un proyecto y una aplicación? En mi cabeza “una aplicación era el resultado de hacer un proyecto”.

En Django, un proyecto es todo el sitio web, con todas sus partes. Una aplicación es un módulo dentro del proyecto. Es autosuficiente y no debe tener dependencias con las otras aplicaciones en el proyecto, de modo que, en teoría, podría copiarla y colocarla en otro proyecto sin ninguna modificación para reutilizar partes de un proyecto en otros. Aunque para hacer esto último hay que seguir ciertas normas para que las aplicaciones sean lo más reutilizable posibles, pero puede que no sea posible, o necesario.

Conocida la diferencia entre un proyecto y una aplicación, vamos a crear nuestra primara aplicación ejecutando el siguiente comando:

```bash
python manage.py startapp todo
```

Después de ejecutar el comando anterior, dentro del directorio del proyecto habrá un nuevo directorio con el nombre `todo`, que fue el que elegí para esta aplicación, pero puedes llamarla como desees. Este directorio tendrá la siguiente estructura:

```
todo
  migrations/
    __init__.py
  __init__.py
  admin.py
  apps.py
  models.py
  tests.py
  urls.py
  views.py
```

En la estructura de la aplicación los ficheros significan:
- **__init__.py**: Ambos ficheros indican que el directorio donde están es un paquete Python.
- **migrations**: En este directorio se almacenarán todas las migraciones generadas de nuestro modelo. Las migraciones son el mecanismo que utiliza Django para mantener actualizada la estructura (o datos) de la base de datos.
- **admin.py**: Django tiene por defecto un panel de administración que se genera automáticamente con muy poco código y permite hacer las [CRUD](https://es.wikipedia.org/wiki/CRUD) de nuestro modelo de una forma muy sencilla y elegante. En este fichero se deben ubicar los mecanismos necesarios para hacer funcionar este panel.
- **apps.py**: Este archivo se crea para ayudar al usuario a incluir cualquier [configuración de la aplicación](https://docs.djangoproject.com/en/3.0/ref/applications/#application-configuration). Con esto, puede configurar algunos de los atributos de la aplicación.
- **models.py**: Aquí se almacenan los modelos de la Base de Datos.
- **tests.py**: Este fichero almacena los test de la aplicación.
- **urls.py**: Anteriormente habíamos visto un fichero con el mismo nombre, pero a nivel de proyecto. 
- **views.py**: En este fichero se almacenan las *vistas*. Como mencioné al principio, Django es un framework que sigue el patrón MTV, es muy parecido a MVC con algunas diferencias. Podríamos hacer una analogía entre las Vistas en Django con los Controladores en otro framework MVC. Las diferencias son mínimas. 

### Instalando la aplicación

Cada vez que se crea o se agrega una nueva aplicación hay que instalarla al proyecto. Para instalar una aplicación debemos abrir en fichero de configuración del proyecto ubicado en `<nombre_del_proyecto>/settings.py`. En la lista de aplicaciones instaladas `INSTALLED_APPS` se agrega el nombre de la aplicación que deseamos instalar o la ruta hasta la clase de configuraciones de la aplicación quedando de la siguiente forma:

```py{10}
INSTALLED_APPS = [
  'django.contrib.admin',
  'django.contrib.auth',
  'django.contrib.contenttypes',
  'django.contrib.sessions',
  'django.contrib.messages',
  'django.contrib.staticfiles',
  
  # new apps
  'todo'
]
``` 

### Primera página

No hay un programador que no comience haciendo un **”Hola mundo”**, así que eso será lo que vamos a hacer ahora. Crearemos una página simple que solo mostrará el famoso mensaje. En Django siempre que vayamos a crear una página nueva, tendremos que hacerlo en 3 pasos (no necesariamente en el mismo orden):

- Crear la plantilla, ya sea una página HTML, un JSON u otro elemento
- Crear una vista que reciba la petición y envíe una respuesta (View)
- Crear la ruta en la que se mostrará la página

Para entender un mejor como funciona Django analicemos la siguiente imagen:

![Modelo Petición/Respuesta](django-arch.jpg)

Cuando un usuario hace una petición al servidor, esta es atendida por una vista (View). Las vistas en Django son las encargadas de construir la respuesta al usuario, respuesta que al terminar de procesar todo lo que necesita, enviará al usuario. ¡Toda petición debe tener una respuesta!

Las vistas pueden, en caso que sea necesario, interactuar con el modelo (Base de datos) para buscar, insertar, editar o eliminar información. La información que pueda pedir a la Base de Datos comúnmente es enviada a las plantillas (template) con el objetivo de mostrarla posteriormente. Finalmente, las vistas deben responder al usuario.

Entendido como funciona el modelo Peticion/Respuesta en Django, hagamos el primer paso para crear una página: crear la plantilla.

Todas las plantillas deben almacenarse dentro del directorio `templates` en la aplicación, por tanto, crearemos un fichero dentro con el nombre `hello.html` con el siguiente contenido:

```django
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Hola Mundo</title>
</head>
<body>
    <h1>Hola Mundo</h1>
</body>
</html>
```

El siguiente paso es crear la vista que recibirá la petición y enviará como respuesta el documento HTML creado arriba. Hay dos formas de crear una vista: basada en una función o basada en una clase. Veamos cómo se implementan:

```py{6, 12}
from django.shortcuts import render
from django.views import View

# function based view
def hello_page(request):
  if request.method == 'GET':
    return render(request, 'hello.html')

# class based view
class HelloView(View):
    
  def get(self, request):
    return render(request, 'hello.html')
```

Muchos desarrolladores prefieren las vistas basadas en funciones (VBF en lo adelante), sobre todos los que llevan muchos años debido a que, en las primeras versiones de Django, no existían las vistas basadas en clases (VBC en lo adelante). Cada desarrollador puede tomar un camino diferente, en mi caso, prefiero las vistas basadas en clases ya que me gusta más la Programación Orientada a Objetos, además de que las encuentro más sencillas, ahorran mucho código y son más claras para mí. En este tutorial y en todo el mi Blog, siempre verás vistas basadas en clases, pero eso no significa que tengas que crearlas de esa forma, puedes tomar tu propio camino si así lo deseas y crear tus vistas basadas en funciones.

Entendamos ahora cómo funcionan las vistas que acabamos de ver. Ambas vistas devolverán una respuesta solo cuando se llame por el verbo HTTP **GET**, en el caso de las VBF esto se especifica comprobando en la petición por cuál método es enviada (`request.method == ‘GET’`); en el caso de las VBC, al heredar de `View` podemos sobrescribir los métodos HTTP por los cuales queremos responder. En las VBC existe un método para cada verbo. Django crea un objeto de tipo `HttpRequest` con toda la información de la petición que siempre es accesible en el primer parámetro de las vistas independientemente del verbo que se esté utilizando.

Las vistas siempre deben devolver una respuesta de tipo `HttpResponse`, de lo contrario Django lanzará una excepción de tipo `ValueError` si el valor `None` es devuelto u otras excepciones como `AttributeError` o `NameError` dependiendo del valor que se devuelva.

En el caso de las vistas anteriores, se utiliza un atajo llamado `render` que permite devolver una respuesta a partir de un documento (html, json, js, css, etc) ubicado en el directorio `templates`. Este atajo será una excelente arma para evitar tener que hacer trabajo repetitivo que podría causar errores. ¡Gracias Django! Aunque `render` tiene varios parámetros, por ahora solo veremos los dos que usamos: el primero es la petición que hace el usuario y el segundo es la dirección del documento que queremos presentar. Esta dirección siempre debe ser relativa al directorio `templates` de la aplicación.

El último paso para poder ver el gran “Hola Mundo” en el navegador, es crear una ruta para nuestra página. Para crear la ruta, primero crearemos un fichero `urls.py` en nuestra aplicación con el siguiente contenido:

```py{6}
from django.urls import path

from todo.views import HelloView, hello_page

urlpatterns = [
    path('', HelloView.as_view(), name='hello'),
]
```

Cada vez que se cree una página nueva en esta aplicación, se deberá agregar la ruta en la lista `urlpatterns` de este fichero. Cara ruta se creará invocando la función `path`, donde el primer parámetro es la dirección de la ruta que, en este caso, es la propia raíz, así que ponemos una cadena vacía. El segundo parámetro es la vista que se encargara de atender las peticiones que se envían por esa ruta, si la vista es una VBC, se debe llamar al método `as_view` de esta; si es una VBF, solo se pone el nombre de la función, por ejemplo: `hello_page`. El tercer parámetro es el nombre de la ruta. El nombre de la ruta debe ser único y será con el cual referenciaremos a la ruta en otras partes de la aplicación en el futuro.

Con el fichero `todo_project/todo/urls.py` logramos configurar todas las rutas de la aplicación `todo`. Ahora tenemos que agregar las rutas de esta aplicación a las rutas del proyecto. ¿Recuerdas cuando veíamos los ficheros que había cuando se creaba un proyecto? Pues había uno que también se llamaba `urls.py`, pues como se podría suponer, ahí es donde se configuran las rutas a nivel de proyecto. Para agregar las rutas de la aplicación al proyecto tenemos que poner `path('', include('todo.urls'))` en la lista de rutas del proyecto, nos quedaría de así:

```py{7}
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
  path('admin/', admin.site.urls),
  # todo app routes
  path('', include('todo.urls'))
]
```

¿Parecido a lo que hicimos antes eh? La única diferencia es que, en el segundo parámetro en vez de utilizar una vista, ahora utilizamos la función `include` que nos ayuda a incluir todas las rutas de una aplicación (entre otras cosas 😉). Como parámetro a ` include` se le pasa la ruta hacia el fichero `urls` de la aplicación, pero en vez de slashes usamos puntos.

Ahora solo nos queda iniciar el servidor de desarrollo `python manage.py runserver` y abrir el proyecto en un [navegador](http://localhost:8000/) y ¡boom! No, no explota, ahí tenemos nuestro “Hola Mundo”

![Hola Mundo](page.jpg)

Puedes clonar el proyecto de [GitHub](https://github.com/cabyas/Todo)