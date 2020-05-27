---
title: Vistas Basadas en Funciones VS Vistas Basadas en Clases
date: '2020-05-26'
spoiler: Aspectos positivos y negativos de las Vistas Basadas en Funciones y las Vistas Basadas en Clases. ¿Cuál es mejor?
---

Como cualquier otro framework web, una de las principales funciones de Django es recibir peticiones HTTP y responderlas. Esto lo hace mediante lo que Django llama `Views`. Una `View` no es más que una “función” que devuelve una respuesta a una petición. En Django las peticiones se representan mediante un objeto de tipo `HttpRequest` y las respuestas mediante un objeto de tipo `HttpResponse`.

A diferencia de muchos de los frameworks modernos, Django utiliza una arquitectura MVT (Model - View - Template) en vez de MVC. Estas dos arquitecturas son muy parecidas y muchas personas tienden a confundirlas. Si no conoces MVT, por el momento digamos que la “V” (Views) en Django es la parte análoga a los Controladores de MVC.

En la documentación oficial de Django se introduce rápidamente lo que conocemos como Vistas Basadas en Funciones (FBV por sus siglas en inglés). Las FBV son funciones como cualquier otra que se pueda escribir en Python, con la diferencia de que acepta al menos un parámetro de tipo `HttpRequest` y retorna una instancia de  `HttpResponse` o alguna subclase. Veamos un ejemplo:

```py
from django.http import HttpResponse

def index_view(request):
    if request.method == 'GET':
        return HttpResponse('Hola get!')
    elif request.method == 'POST':
        return HttpResponse('Hola post!')
```

El ejemplo anterior muestra lo sencillo que pueden ser las `Views` en Django. El ejemplo muestra una `View` llamada `index_view`, cuando es invocada mediante el verbo HTTP `GET`, la respuesta es `Hola get!` mientras que si se invoca mediante el verbo `POST` la respuesta es `Hola post!`.

Veamos ahora el mismo ejemplo, pero con una Vista Basada en Clases:

```py
from django.views.generic import View
from django.http import HttpResponse

class IndexView(View):

    def get(self, request):
        return HttpResponse('Hola get!')

    def post(self, request):
        return HttpResponse('Hola post!')
```

Ambos ejemplos presentados anteriormente hacen exactamente lo mismo, la única deferencia entre ellos es que el primero esta implementado como una Vista Basada en una Función (FBV) y el segundo como una Vista Basada en una Clase (CBV por sus siglas en inglés). En este punto puedes estar preguntándote: ¿Para qué se necesitan las CBV? ¿Cuándo debo utilizar una y cuando la otra? ¿Cuál es mejor? 

Veamos cómo funcionan y sus aspectos positivos y negativos para responder esas preguntas.

## Vistas Basadas en Funciones

**Aspectos positivos:**
- Fáciles de implementar
- Fáciles de leer (cuando son pequeñas)
- Flujo de código explicito ya que vemos explícitamente todo el código que se ejecutará en la vista.

**Aspectos negativos:**
- No se puede extender o reutilizar código.
- Manejo de verbos HTTP mediante condiciones. 
- Son pocos los casos en los que las vistas se mantienen pequeñas y simples por lo que se pueden tornar difíciles de leer y entender cuando son extensas.

Las FBV son parte de Django desde su creación y aún existen más desarrolladores de los que podrías imaginar que las prefieren. Como se ha visto en ejemplos anteriores, estas `Views` son fáciles de implementar y de leer, pero los proyectos Web tienden a tener muchos puntos en común que podrían reutilizarse y ahorrar código (Don’t Repeat Youself – DRY) pero este tipo de `Views` no lo permite. Esta es una de las razones principales por las que se crean las CBVs.

```py
def create_view(request):
    if request.method == 'POST':
        form = MyForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/thanks/')
    else:
        form = MyForm()

    return render(request, 'my_template.html', {'form': form})
```

El ejemplo anterior es probablemente el caso más recurrente en todo tipo de proyecto, pues casi todos los proyectos manejan formularios. Más adelante veremos cómo se hace esta tarea con CBV.

## Vistas Basadas en Clases

**Aspectos positivos:**
- Pueden ser extendidas y se puede reutilizar código fácilmente.
- Se puede manejar los verbos HTTP utilizando métodos separados.
- Variedad de clases genéricas por defecto para las tareas más comunes.
- Se pueden hacer tareas complejas con muy poco código.  

**Aspectos negativos:**
- Puede ser difícil de leer, sobre todo para principiantes o desarrolladores que no están familiarizados con la Programación Orientada a Objetos.
- Funcionalidades ocultas en las clases padres.
- Muchas de las `Views` genéricas son tan abstractas que parece que hacen su trabajo “mágicamente” (simplemente funcionan).

Veamos el ejemplo anterior, esta vez escrito como una CBV:

```py
class ContactView(FormView):
    template_name = 'my_template.html'
    form_class = MyForm
    success_url = '/thanks/'
```

Este ejemplo hace “exactamente” lo mismo que el escrito con FBV. Como podemos ver, se necesita mucho menos código y aunque no parece, se permite modificar el flujo de la clase y agregar ciertos comportamientos personalizados. ¿Es más difícil de entender? SI. ¿Es más fácil de implementar (si conoces como funcionan)? ¡ABSOLUTAMENTE SI! 

Las CBV fueron agregadas a Django para complementar las FBV, no para sustituirlas y ambas formas de crear `Views` tienen aspectos positivos y negativos. Hay momentos en los que es mejor utilizar una FBV y otros donde utilizar una CBV es más provechoso.

`FormView` no es la unica clase que se puede utilizar para crear CBVs, existe una para casi cada caso de uso que podamos tener en cualquier proyecto. En la [documentación oficial](https://docs.djangoproject.com/en/3.0/ref/class-based-views/) se puede encontrar una lista de todas las clases despinibles.

## Preferencias personales

Después de varios años trabajando con Django, tengo una fuerte inclinación por las CBV. Las uso siempre que puedo y hasta ahora en solo unos pocos casos (insignificantes) ha sido más conveniente utilizar FBVs.

Utilizar CBV requiere estudio extra y entender cómo funciona cada una, así como cuales métodos sobrescribir para modificar su comportamiento. Una vez que se entiende cuándo y cómo utilizarlas correctamente, crear `Views` se hace muy sencillo y en muchas ocasiones ayudada a desarrollar más rápido.

Utilizar clases a veces suele ser complejo, sobre todo por el paradigma Orientado a Objetos que muchos no dominan, pero si aún no dominas la POO y deseas dedicarte al mundo de la programación, ¡creo que es hora de que comiences a aprenderlo!
