---
title: Django CRUD
date: '2020-06-04'
spoiler: Cómo implementar CRUD con Django utilizando Vistas Basadas en Clases reutilizando la mayor cantidad de código posible y sin repetir una línea de código dos veces.
image: image.png
---

¡Django es increíble! Si aún no estás seguro de ello, no intentaré convencerte con palabras sino con código.

Hay muchas razones por la cual Django es mi framework favorito, pero sin duda, la número 1 es porque, como el slogan de JQuery, puedo hacer más escribiendo menos. Django se ha ganado una de las primeras posiciones entre los frameworks que permiten desarrollo rápido de aplicaciones gracias a la cantidad componentes con los que cuenta por defecto, pero también porque permite un alto nivel de reutilización de código.

En este tutorial se analizará un ejemplo donde se utilizan las cuatro operaciones básicas que nunca faltan en la mayoría de las aplicaciones web: Crear, Leer, Actualizar y Eliminar (CRUD por sus siglas en inglés). En el ejemplo se utiliza Bootstrap 4 para el frontend y Vistas Basadas en Clases (VBC) para crear todas las `Views`.

El ejemplo es sencillo. Como actualmente existen muchos lenguajes de programación y siempre estamos aprendiendo, vamos a crear una aplicación web donde almacenaremos todos los lenguajes que conocemos. ¿Útil ehh? Nah, pero igual nos sirve para aprender 😜

**Los objetivos principales son:**

- Utilizar las VBC creadas para cada operación.
- Reutilizar todo el código que se pueda.
- No repetir el mismo código dos veces a menos que sea necesario (DRY).

## Creando el proyecto

Nombraré el proyecto como `django_crud_example` (puedes elegir un nombre distinto) y solo tendremos una `app` que la nombraré `languages` (también puedes elegir un nombre distinto).

Te recomiendo crear un [ambiente virtual](/virtualenv-python/) si no lo tienes antes de crear el proyecto. En este tutorial omitiré los pasos para crear tanto el ambiente virtual como el proyecto mismo. Si aún no sabes cómo crear un proyecto desde cero, te recomiendo estudiar primero un [tutorial](/starting-a-django-project/) donde explico paso a paso como crear un proyecto, así como el significado de cada componente.

## El modelo

Para este proyecto solo se tendrá un modelo: los lenguajes de programación. Para simplificar llamaremos a nuestro modelo `Languages` y tendrá campos: el nombre, si es compilado o no, cuando lo aprendimos, el paradigma principal (si es funcional, orientado a objetos, etc.) y un campo para agregar observaciones nuestras sobre el lenguaje.

Para mantener todo lo más simple posible, almacenaremos nuestro modelo en el módulo `models.py` ubicado en la raíz de la `app` y tendrá el siguiente contenido:

```py
from django.db import models

class Language(models.Model):
    name = models.CharField(null=False, blank=False, max_length=30)
    compiled = models.BooleanField(
        default=False, 
        help_text='Compiled or interpreted'
    )
    learned_at = models.DateField(
        null=True, 
        blank=True, 
        help_text='When you learned the language'
    )
    observations = models.TextField(max_length=500, blank=True)

    PROCEDURAL_PARADIGM = 'procedural'
    DECLARATIVE_PARADIGM = 'declarative'
    FUNCTIONAL_PARADIGM = 'functional'
    OBJECT_ORIENTED_PARADIGM = 'OOP'
    PARADIGM_CHOICES = (
        (PROCEDURAL_PARADIGM, 'Procedural'),
        (DECLARATIVE_PARADIGM, 'Declarative'),
        (FUNCTIONAL_PARADIGM, 'Functional'),
        (OBJECT_ORIENTED_PARADIGM, 'Object Oriented'),
    )
    main_paradigm = models.CharField(
        choices=PARADIGM_CHOICES, 
        default=PROCEDURAL_PARADIGM, 
        blank=False, 
        max_length=20
    )

    class Meta:
        verbose_name = 'Language'
        verbose_name_plural = 'Languages'

    def __str__(self):
        return self.name
```

En este tutorial no me centraré en el modelo, por lo que solo haré unas pocas observaciones sobre este:

- El campo `observations` es un campo de texto que podrá llegar hasta 500 caracteres y se recomendada utilizar un `TextField` para textos grandes en vez de un `CharField`.
- El campo `main_paradigm` se limita a las opciones `PARADIGM_CHOICES` para evitar que los usuarios creen varios valores para lo que debería ser un solo valor. Por ejemplo, los usuarios podrían introducir "Orientado a objetos", "Lenguaje Orientado a Objetos", "POO", etc. Aunque estos tres ejemplos significan lo mismo, es difícil programáticamente deducir que representan lo mismo. Aunque en este caso se utiliza el atributo `choices` para limitar los valores, también en muchos casos se puede utilizar un modelo separado y de esta forma hacerlo más dinámico.
- En todos los modelos que se creen se debe crear el método `__str__`. Este método es utilizado para "convertir" a este objeto a una cadena de texto en algunos lugares de la aplicación, por ejemplo, en el módulo de administración de Django.

Luego de escribir el modelo hay que crear las migraciones para el mismo y ejecutarlas para que tengan efectos en la base de datos configurada.

```bash
python manage.py makemigrations

python manage.py migrate
```

## Configuraciones necesarias

Antes de comenzar con la parte divertida, debemos configurar algunos detalles para que todo funcione correctamente después. Comenzaremos registrando el modelo `Languages` al módulo de administración. En este tutorial no se usará el módulo de administración, pero podría serte útil para ver los lenguajes que vas creando. Para registrar el modelo solo es necesario agregar el siguiente fragmento de código en el fichero `admin.py` ubicado en la raíz de la `app`.

```py
from django.contrib import admin
from languages import models

admin.site.register(models.Language)
```

Configurar las URLs es un paso que cada vez que se cree una app se debe hacer. Por supuesto, si la `app` no alojará ninguna página (o URL) entonces este paso no es necesario (en este casi si lo es, pues crearemos una página para cada CRUD). Primero debemos crear el módulo donde se agregarán las URLs cuando sean creadas, este módulo se llamará `urls.py` y se ubicará en la raíz de la `app` con el siguiente contenido:

```py

from django.urls import path
from languages import views

urlpatterns = [
    # Todas las URLs irán aquí
]
```

Para que las URLs de la aplicación estén disponibles hay que [incluirlas](https://docs.djangoproject.com/en/3.0/topics/http/urls/#including-other-urlconfs) en el módulo de URLs del proyecto, es decir, el fichero `urls.py` ubicado en el directorio donde se encuentra el módulo `settings.py` el cual tiene el mismo nombre que el proyecto.

```py {5}
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include(('languages.urls', 'languages'), namespace='languages')),
    path('admin/', admin.site.urls),
]
```

En el código anterior se utiliza un [namespace](https://docs.djangoproject.com/en/3.0/topics/http/urls/#url-namespaces) al incluir las URLs de la `app`, esta es una práctica que recomiendo para evitar colisiones entre los nombres de las URLs. En proyectos pequeños es poco probable que ocurran, pero en proyectos grandes con muchas `apps` es muy común encontrarlos.

Finalmente, agregaremos a la configuración del proyecto tres líneas que permitirán que los `statics` funcionen correctamente:

```py
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
```

## Creando el "layout"

Siempre que se pueda reutilizar código, debemos hacerlo. Afortunadamente, Django ayuda bastante en cuanto a reutilizar código y no repetirlo (DRY). 

Una de las características del lenguaje de plantillas utilizado por Django ([DTL](https://docs.djangoproject.com/en/3.0/ref/templates/language/)) es [la herencia](https://docs.djangoproject.com/en/3.0/ref/templates/language/#template-inheritance). Sí, se puede heredar de otras plantillas y extenderlas. Esto es gracias a que permiten crear una especie de "huecos" que pueden ser llenados cuando se hereda de la plantilla que los tiene, estos huecos se llaman `block`.

Una práctica común es crear una "base" para todas las páginas que se parecen, así juntamos toda la estructura común entre esas páginas en una plantilla la cual extenderemos luego para "poner" el contenido que cambia en cada página. Debemos dejar algunos "huecos" donde el contenido puede cambiar. Veamos cómo queda la base de nuestro sitio:

```django {6,32,33}
{% load static %}

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{% block title %}Django CRUD{% endblock %}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="{% static 'css/main.css' %}">
  </head>
  <body>
    <nav class="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="{% url 'languages:home' %}">Django CRUD</a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{% url 'languages:language_create' %}">➕ Add Language</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container main-content">
        {% block content %}
        {% endblock  %}
    </main>

    <footer class="footer">
        <div class="container">
            Django Example made with ❤ by <a href="https://twitter.com/yasiel9506">Yasiel Cabrera</a>
        </div>
    </footer>
  </body>
</html>
```

Para este ejemplo solo es necesario dos bloques: uno para el título de la página y otro para el contenido de cada página.

En proyectos más complejos es común tener más bloques. Comúnmente se crean bloques para agregar estilos o JavaScript específicos de cada página o para agregar metadatos.

## Mostrando información: Read

Para este ejemplo tendremos dos páginas que responden a la **"R"** de *CRUD*, es decir, dos páginas que mostrarán información. Una de estas páginas será la principal, que es donde se mostrarán todos los lenguajes que conocemos (o al menos los que introducimos en la base de datos). La segunda página será la que mostrará un lenguaje específico y será ahí donde se verán todos los detalles de un lenguaje.

Django trae por defecto varias `Views` genéricas que heredando de ellas se puede reducir drásticamente la cantidad de código y la velocidad de desarrollo empleada para crear una `View`. Para la página principal se puede utilizar una `ListView` ya que es exactamente lo que hace: muestra una lista de objetos. Veamos primero el código:

```py
from django.views.generic.list import ListView

class HomeView(ListView):
    model = Language
    template_name = 'languages/index.html'
    paginate_by = 10
```

Esa pequeña porción de código se encarga de renderizar la plantilla `languages/index.html`, pasar la lista de lenguajes como una variable del contexto al template y paginar los lenguajes, en este caso, de 10 en 10. Quizás suene sencillo, pero hacer todo eso sin la ayuda de Django puede tomar mucho más tiempo, sería mucho más código y podría tener errores si no somos cuidadosos. Pero, ¡Django hace el trabajo sucio por nosotros!

En realidad, el único atributo que es requerido es el `model`. Por defecto el template utilizado si no se especifica es el nombre del modelo seguido por `_list.html`, es decir, si no se especificara en este caso el atributo `template_name`, Django buscaría por el template `language_list.html`.

La paginación es posible gracias a que uno de los ancestros de `ListView` es `MultipleObjectMixin`. Este mixin permite que si el atributo `paginate_by` es especificado la lista de objetos (en este caso lenguajes) es paginada.

En el `template` la lista de objetos es accesible mediante la variable `object_list`, aunque este nombre puede ser cambiado utilizando el atributo `context_object_name` en la `View`. El objeto de paginación es accesible mediante la variable `page_obj`. El código del template:

```django
{% extends 'languages/layout/base.html' %}

{% block content %}
    {% if object_list %}
        <h2 class="mb-4">Programming Languages I have learned 😎</h2>
    {% endif %}
    
    {% for language in object_list %}
        <div class="mb-3">
            👉 {{ language.name }} 
            - 
            <a href="{% url 'languages:language_detail' language.pk %}">👁 See</a>
            |
            <a href="{% url 'languages:language_update' language.pk %}">✏ Edit</a>
            |
            <a href="{% url 'languages:language_delete' language.pk %}">✏ Delete</a>
        </div>
    {% empty %}
        <div class="empty-languages">You haven't learned any Programming Language yet 😥</div>
    {% endfor %}

    {% if page_obj.has_previous or page_obj.has_next %}
        <nav class="mt-4">
            <ul class="pagination">
                {% if page_obj.has_previous %}
                    <li class="page-item">
                        <a class="page-link" href="?page=1">First</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="?page={{ page_obj.previous_page_number }}">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                {% endif %}
                <li class="page-item disabled"><a class="page-link">Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}</a></li>
                {% if page_obj.has_next %}
                    <li class="page-item">
                        <a class="page-link" href="?page={{ page_obj.next_page_number }}">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="?page={{ page_obj.paginator.num_pages }}">Last</a>
                    </li>
                {% endif %}
            </ul>
        </nav>
    {% endif %}
{% endblock  %}
```

Para que funcione correctamente esta página se debe registrar la URL mediante la cual se accederá a ella:

```py
urlpatterns = [
    path('', views.HomeView.as_view(), name='home')
]
```

> NOTA: Si usted copia y pega en su proyecto el código presentado hasta el momento no funcionará debido a que hay URLs que aún no se han creado.

La segunda página que mostrará información es la de los detalles de los lenguajes. Para crear una `View` de detalles Django también tiene una `view` genérica, en este caso se llama `DetailView`.

```py
from django.views.generic.detail import DetailView

class LanguageDetailView(DetailView):
    model = Language
    template_name = 'languages/language_detail.html'
```

Igual que con `ListView` y las demás `views` genéricas que se verán, el atributo `model` es el único que es requerido, los demás son utilizados para personalizar la vista. La plantilla que Django intenta utilizar si el atributo `template_name` no existe es el nombre del modelo seguido por el sufijo `_detail.html`. Para este caso sería `language_detail.html`.

En los templates la instancia del lenguaje es accesible mediante a variable `object` o mediante otra variable con el mismo nombre del modelo, en este caso `language`.

El template para esta página queda de la siguiente forma:

```django
{% extends 'languages/layout/base.html' %}

{% block content %}
    <h1 class="mb-3">Language: {{ language.name }}</h1>
    <a href="{% url 'languages:home' %}">👈 Back</a>
    •
    <a href="{% url 'languages:language_update' language.pk %}">✏ Edit</a>
    •
    <a href="{% url 'languages:language_delete' language.pk %}">😥 Delete</a>
    <hr />

    <p>
        🦄 This programming language is 
        {% if language.compiled %}compiled{% else %}interpreted{% endif %}.
    </p>

    <p>
        📅
        {% if language.learned_at %}
            I learned {{ language.name }} at {{ language.learned_at | date:'SHORT_DATE_FORMAT'}}
        {% else %}
            I think I don't remeber when I learned this language 🤔🤔
        {% endif %}
    </p>

    <p>
        🐱🏍 The main paradigm of this language is {{ language.main_paradigm }}
    </p>

    {% if language.observations %}
        <h4 class="mt-5">👀 Observations:</h4>        
        <p>{{ language.observations }}</p>
    {% endif %}
    
{% endblock  %}
```

Finalmente, para que la página se muestre correctamente se debe registrar una URL que asocie la `View` con una URL. Para poder conocer cuál lenguaje se debe mostrar es necesario agregar un argumento en la URL: `<int:pk>`. Este argumento se llama `pk` y para que sea válido solo puede contener números. Si el argumento se nombra de otra forma que no sea `pk` se debe especificar en atributo `pk_url_kwarg`. Para más información se puede consultar la [documentación oficial](https://docs.djangoproject.com/en/3.0/ref/class-based-views/mixins-single-object/#django.views.generic.detail.SingleObjectMixin).

```py
urlpatterns = [
    # ...
    path('language/<int:pk>/', views.LanguageDetailView.as_view(), name='language_detail')
]
```

## Creando nuevos lenguajes: Create

Para crear nuevos objetos es necesario crear formularios. En todos los framework que he trabajado hasta el momento utilizar formularios es un verdadero dolor de cabeza, principalmente porque este es uno de las principales fuentes de ataques, inyección SQL, etc.

En Django también puede llegar a convertirse en un dolor de cabeza los formularios, pero solo cuando son muy complejos y no tenemos muy organizado el proyecto. Cuando los formularios son sencillos, trabajar con ellos es extremadamente fácil. 

Normalmente se recomienda crear una clase para cada formulario, así puede ser reutilizado el mismo formulario en varias partes del proyecto. Por simplicidad, en este caso utilizaremos otra vía para crear los formularios.

```py
from django.views.generic.edit import CreateView

class LanguageCreateView(CreateView):
    model = Language
    template_name = 'languages/language_create.html'
    fields = ['name', 'compiled', 'learned_at', 'main_paradigm', 'observations']
```

En este caso no es necesario ningún formulario ya que al heredar de `CreateView` Django lo crea por nosotros. Para crear el formulario es necesario los atributos `model` y `fields`. El atributo `model` especifica de que modelo se va a crear el objeto y el atributo `fields` lista todos los campos que pertenecen al modelo especificado en `model` y que deben incluirse en el formulario.

Por defecto el template que Django busca es el nombre del modelo concatenado con `_form.html`. El formulario está disponible en el template en la variable `form`.

```django {5-9}
{% extends 'languages/layout/base.html' %}

{% block content %}
    <h1 class="mb-4">
        {% if not edit %}
            🆕 Add a new Learned Language
        {% else %}
            ✏ Edit a Language
        {% endif %}
    </h1>
    <form method="post">
        {% csrf_token %}
        {{ form.as_p }}

        <div class="float-right">
            <a href="{% url 'languages:home' %}" class="btn btn-secondary">Back</a>
            <button class="btn btn-primary" type="submit">Save</button>
        </div>
    </form>
{% endblock %}
```

El template para esta página lo reutilizaremos para la página de actualizar un lenguaje. Solo se cambia en header `h1` al inicio dependiendo de la página que se está mostrando, eso lo logramos con la variable de contexto `edit`.

Como hasta ahora, el último paso para crear una nueva página es registrar la URL:

```py
urlpatterns = [
    #...
    path('language/create/', views.LanguageCreateView.as_view(), name='language_create'),
]
```

## Actualizando los lenguajes: Update

La página de actualizar es muy parecida a la de crear un lenguaje que analizamos antes. Solo diferencia que en este caso se hereda de la `View` genérica `UpdateView`.

El formulario para actualizar un elemento, a diferencia del de crear nuevos objetos, necesita que sea iniciado con los valores actuales del objeto que se desea actualizar, así de esta forma el usuario puede ver los valores actuales de los campos del objeto. Afortunadamente, Django hace esto por nosotros también si utilizamos la clase `UpdateView`.

```py {10}
from django.views.generic.edit import UpdateView

class LanguageUpdateView(UpdateView):
    model = Language
    template_name = 'languages/language_create.html'
    fields = ['name', 'compiled', 'learned_at', 'main_paradigm', 'observations']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['edit'] = True
        return context
```

Por primera vez en este tutorial se utiliza el método `get_context_data`. Este método es utilizado para pasar variables extras en el contexto. Aunque no lo parece, las `View` genéricas son muy extensibles y se puede personalizar la forma en que se comportan fácilmente.

El template utilizado en este caso es el mismo que para crear nuevos lenguajes. La URL para esta página sigue la misma filosofía de la de la página de detalles:

```py
urlpatterns = [
    #...
    path('language/update/<int:pk>/', views.LanguageUpdateView.as_view(), name='language_update'),
]
```

## Eliminando información: Delete

Eliminar elementos es tan sencillo como todo lo que hemos visto hasta el momento, Django hace un montón de trabajo por nosotros... como siempre. Saltemos directo al código:

```py
from django.views.generic.edit import DeleteView

class LanguageDeleteView(DeleteView):
    model = Language
    success_url = reverse_lazy('languages:home')
    template_name = 'languages/confirm_language_deletion.html'
```

El flujo de `DeleteView` es el siguiente: Cuando accedemos a la URL vía GET muestra una página la cual puede ser utilizada, por ejemplo, para notificar al usuario que se va a eliminar un elemento (una confirmación) y si se accede vía POST el elemento se elimina y se redirecciona a la URL especificada en el atributo `success_url`. `reverse_lazy` obtiene la URL correspondiente al nombre especificado como argumento.

```django {5,6}
{% extends 'languages/layout/base.html' %}

{% block content %}
    <div class="text-center">
        <form method="post">
            {% csrf_token %}

            <p class="delete-msg">Are you sure you want to delete the <b>"{{ language.name }}"</b> language?</p>

            <a href="{% url 'languages:home' %}" class="btn btn-secondary">NO</a>
            <button class="btn btn-primary" type="submit">Si</button>
        </form>
    </div>
{% endblock %}
```

En la plantilla el objeto que se va a eliminar puede ser accedido por las variables de contexto `object` o por otra que lleva el mismo nombre del modelo especificado en el atributo `model`. Esta `View` no crea ningún formulario, pero se crea uno para poder acceder a la URL vía POST y además pasar el `csrf_token`, el cual es necesario para acceder de forma segura a las URLs vía POST.

Finalmente, la URL para esta página es semejante a la de la página de detalle y la de actualizar.

```py
urlpatterns = [
    #...
    path('language/delete/<int:pk>/', views.LanguageDeleteView.as_view(), name='language_delete')
]
```

## Conclusiones

Crear las CRUD con Vistas basadas en Clases en Django es extremadamente sencillo y se ahorra un montón de tiempo y código en comparación a cuando se hace utilizando Vistas basadas en Funciones.

Django trae por defecto una vista genérica para casi todos casos de usos que podemos tener en nuestros proyectos. El uso básico de estas es extremadamente sencillo y fácil de aprender, no siendo así cuando hay que personalizar ciertos comportamientos en ellas, pero vale la pena aprenderlas y usarlas siempre que sea posible.

Para crear una página siempre es necesario realizar tres acciones (el orden no es importante):

- Crear una `View`
- Crear el `template`
- Registrar una URL

Todo el código utilizado aquí puede ser encontrado en [GitHub](https://github.com/cabyas/django-crud-example)
