---
title: Generando datos falsos para etapas de prueba o desarrollo
date: '2020-12-20'
spoiler: Generar datos para ver la aplicación como la vería un usuario consume demasiado, mejor automatizar el proceso.
---

> Si te toma más de 90 segundos hacer una tarea automatízala.

Casi todas las aplicaciones modernas manejan datos y tienen interfaces gráficas que dependen de estos datos. Por tanto, es necesario durante el proceso de desarrollo de estas aplicaciones insertar datos para ver las funcionalidades dinámicas que dependen de ellos. Pero algunas veces la cantidad de datos que tenemos que insertar para poder ver algunas funcionalidades es mucha. Otras veces, tenemos que crear una base de datos desde cero, iniciamos nuevos en un proyecto o cualquier otra razón, en cualquier caso: ¡Necesitamos “llenar” de datos la aplicación para verla como la vería nuestros usuarios!

Insertar datos a manos puede ser tedioso así que existen varias bibliotecas para crear “fake data” en Django y en este artículo vamos a ver una de ellas: `django-seed`. Existen muchas otras, pero `django-seed` es una de mis favoritas, es muy simple utilizarla, hay bastante documentación, es flexible, tiene soporte para `Python 3` y `Django 3+` y aún es mantenida por la comunidad lo que garantiza que posibles errores en el futuro serán solucionados.

## Instalación

Es muy simple instalar `django-seed` en `django`, solo hay que instalar el paquete desde `pip` y luego agregar `django_seed` en las aplicaciones instaladas de nuestro proyecto, de esta forma es posible ejecutar el comando `seed` que veremos más adelante.

1- Instalar el paquete:
```bash
pip install django-seed
```

2- Agregar `django_seed` a las aplicaciones installadas (`INSTALLED_APPS`) del proyecto en el fichero `settings.py`:

```python
INSTALLED_APPS = (
    # ...
    'django_seed',
)
```

**Nota:** Observar que el paquete se llama `django-seed` pero la aplicación se llama `django_seed` (con undersore)

## Cómo se usa

`django-seed` es muy fácil de usar. Hay dos formas: usando un comando o escribiendo código.

Cualquier método que se use hay que tener en cuenta que para los modelos que tiene campos `ForeignKey` se debe asegurar que el modelo foráneo debe “sembrarse” antes que el modelo que tiene el `ForeignKey`. Supongamos que se tiene un modelo `User` con un campo `ForeignKey` hacia otro modelo llamado `Profile`; para este caso el modelo `Profile` debe “sembrarse” antes que `User` de lo contrario ocurrirá un error.

### Usando el comando `seed`

Con este comando es extremadamente fácil insertar información en la base de datos, basta con ejecutarlo y decir cuántas instancias de cada modelo se quieren:

```bash
python manage.py seed app --number=15
```

El único parámetro que tiene este comando es `number`, el cual indica cuantas instancias de cada modelo se quieren. El valor por defecto es 10.

### “Sembrando” datos con código

`django-seed` también provee métodos para fácilmente generar datos a partir de los modelos. Veamos un ejemplo:

```python
from django_seed import Seed
from myapp.models import Game, Player

seeder = Seed.seeder()
seeder.add_entity(Game, 5)
seeder.add_entity(Player, 10)

inserted_pks = seeder.execute()
```

En el ejemplo anterior se crean datos falsos para los modelos `Game` y `Player`. Siempre el primer paso es crear con `Seed.seeder` una instancia. Con esta instancia `seeder` se puede utilizar el método `add_entity` para crear la información. `add_entity` tiene tres parámetros, el primero es la clase del modelo que se desea “sembrar”, es decir, crear datos. El segundo parámetro es la cantidad de instancias de la clase que se desean crear. El tercer parámetro permite personalizar el tipo de información de cada campo del modelo. 

Solamente con `add_entity` no es suficiente para crear los datos, es necesario invocar el método `execute` del `seeder` para así crearlas en la base de datos. Este método retorna un diccionario donde las claves son las clases que se “sembraron” y los valores una lista de enteros donde cada entero representa el `id` de cada instancia que se creó. Para el ejemplo anterior si se desea obtener la lista de los `id` de las instancias de `Game` que se crearon accedemos a ella de la siguiente forma: `inserted_pks[Game]`.

`django-seed` utiliza el nombre y el tipo de columna para inferir el tipo de información que debe generar para cada campo. En el [código fuente](https://github.com/Brobin/django-seed/blob/master/django_seed/guessers.py) se puede observar los nombres de columnas (`NameGuesser`) y tipos de campos (`FieldTypeGuesser`) que puede deducir. Hay muchos casos en los que el nombre o el tipo del campo no es suficiente para deducir que tipo de datos debe generar, para estos casos se utiliza el tercer parámetro, el cual es un diccionario donde las claves son el nombre del campo y los valores son funciones que retornan el valor que se desea asignar al campo.

Supongamos que los campos del modelo `Player` `score` y `nickname` necesitan ciertas restricciones que no se infieren a partir de los nombres y tipos de campo. `score` solo puede ser un valor entero entre 0 y 1000 y `nickname` es un correo:

```python
seeder.add_entity(Player, 10, {
    'score':    lambda x: random.randint(0,1000),
    'nickname': lambda x: seeder.faker.email(),
})
```

Para generar los campos se puede usar el `faker` de `django-seed` o cualquier otro método que retorne un valor acorde con el tipo de campo (si el campo es un `IntegerField` no se le puede asignar una cadena o se obtendrá un error)

## Python faker

En el ejemplo anterior se utiliza `seeder.faker` para generar el `nickname`, este “`faker`” es una instancia del “faker” proporcionado por la biblioteca [Faker](https://faker.readthedocs.io/en/master/). Todos los métodos de esa biblioteca pueden ser utilizados y por defecto todos los [providers estándares](https://faker.readthedocs.io/en/master/providers.html) son utilizables.

Veamos un ejemplo:

```python {1,3-5,8}
seeder = Seed.seeder(locale='es_ES')

def get_user(arg):
    query = User.objects.all()
    return seeder.faker.random_element(elements=query)

seeder.add_entity(Log, 500, {
    'user': get_user,
    'created_at': lambda _: seeder.faker.date_time_this_month(),
    'ip': lambda _: seeder.faker.ipv4(),
    'user_agent': lambda _: seeder.faker.user_agent(),
})

seeder.execute()
```

En el ejemplo anterior la función `get_user` es utilizada para generar el campo `user` de la entidad `Log`. `django-seed` “siembra” los campos foráneos obteniendo aleatoriamente una instancia de las generadas en el modelo foráneo, pero, si el modelo foráneo no es sembrado anteriormente entonces no habrá ningún elemento que seleccionar ya que los existentes en la base de datos no son elegibles. Para hacer los datos existentes elegibles hay que hacerlo explícitamente seleccionándolos con una `query`, es esta la razón de la existencia del método `get_user`.

## Conclusiones

`Django-seed` es una de las bibliotecas que es buena idea tener en el arsenal ya que puede ser usada en cualquier proyecto, es extremadamente útil y ahorra gran cantidad de tiempo.

Esta biblioteca tiene abundante documentación y no debe tomar más de 30 minutos aprenderla y comenzar a utilizarla como un profesional.