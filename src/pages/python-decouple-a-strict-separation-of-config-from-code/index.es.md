---
title: 'Python Decouple: Separando la configuración del código'
date: '2020-12-25'
spoiler: 'Decouple te ayuda a organizar tus configuraciones para que puedas cambiar los parámetros sin tener que volver a desplegar tu aplicación.'
---

Todas las aplicaciones web dependen de parámetros de configuración que son dependientes del ambiente. Por ejemplo, las aplicaciones **Django** tienen algunos de estos parámetros: URL de la base de datos, claves secretas, hosts permitidos, debug, host de correo, etc. La mayoría de esos parámetros no solo son dependientes del ambiente, sino que muchos de ellos son altamente sensibles (como las credenciales de la base de datos, por ejemplo). 
`Python-decouple` es uno de mis paquetes favoritos que uso en cada uno de mis proyectos. Fue concebido para separar los parámetros de configuración del código.

## Cuándo es factible usar `Python-decouple`

Este paquete se puede usar en cualquier proyecto sin importar el tamaño, alcance o donde será desplegado.
Es preferible utilizar `Python-decouple` sobre `os.environ` ya que este último solo retorna `strings` mientras que `decouple` provee soluciones para hacer “cast” de tipos simples e incluso de tipos complejos como `list`, `tuple` y objetos.

## Cómo se usa

El paquete se installa directamente de `pypi` usando `pip` o cualquier otro gestor de paquetes:

```bash
pip install python-decouple
```

Después de instalar el paquete se puede comenzar a usar. Esta es una biblioteca que por lo general solo se usa en `settings.py`, aunque se puede utilizar en cualquier parte del proyecto. Para comenzar a usarla basta con importar `config` y luego obtener los valores de los argumentos:

```python
from decouple import config
CONFIG_VARIABLE = config('ARG_KEY')
```

Los argumentos con sus respectivos valores pueden ser almacenados en dos formatos: `.ini` y `.env`.

Usando `settings.ini`:
```ini
[settings]
DEBUG=True
TEMPLATE_DEBUG=True
SECRET_KEY=ARANDOMSECRETKEY
DATABASE_URL=mysql://myuser:mypassword@myhost/mydatabase
PERCENTILE=90%%
#COMMENTED=42
```
Usando fichero `.env`:
```ini
DEBUG=True
TEMPLATE_DEBUG=True
SECRET_KEY=ARANDOMSECRETKEY
DATABASE_URL=mysql://myuser:mypassword@myhost/mydatabase
PERCENTILE=90%
#COMMENTED=42
```

Es importante saber el orden que sigue `decouple` para buscar los argumentos. Cuando se invoca `config('ARG_KEY')` el valor del argumento `ARG_KEY` es esperado, por lo que `decouple` buscará su valor en el siguiente orden:

1- Variables de entorno. Es importante conocer que donde primero se buscará será en las variables de entorno pues, si hay alguna variable de entorno actualmente configurada tendrá precedencia sobre el argumento de igual nombre en un fichero.

2- Ficheros `.ini` o `.env`

3- Por último si el argumento no se encuentra se utilizará el valor por defecto proporcionado o en casos que no se indique uno `decouple` lanzará la excepción `UndefinedValueError`. Más adelante veremos cómo se utilizan los valores por defecto.

>**ATENCIÓN:** Asegúrese de agregar el fichero que utilice al `.gitignore`. De esta forma no incluirá el fichero al control de versiones y mantendrá protegida la información sensible.

Al estar estos ficheros omitidos del software de control de versiones es buena idea crear un fichero como ejemplo de que parámetros deben configurarse, quizás agregarlo al `readme.md` o algún otro. Personalmente, me gusta crear un fichero `.env.example` con todos los argumentos que uso en el proyecto, de esta forma cuando se va a desplegar por primera vez, ya que el fichero con los parámetros reales no existe, simplemente copio el fichero de ejemplo con el nombre final y cambio su contenido con los valores reales de los argumentos.

## Usos avanzados

Usar solamente `config('ARG_KEY')` es “casi” lo mismo que utilizar `os.environ`, por lo que es necesario usar los *súper poderes* que brinda `python-decouple`.

### Convirtiendo los argumentos

Por defecto tanto `os.environ` como `decouple` retornan los valores de los argumentos como cadenas. Convertir automáticamente el tipo de los argumentos es unas de las características que hace a `decouple` una mejor opción.
Para convertir los argumentos basta con agregar a `config` un parámetro nombrado: `cast` con una función que espera un argumento y retorna el valor del argumento con el tipo al que se desea convertir. Afortunadamente existen funciones para los tipos de datos primitivos: `int`, `float`, `bool`, etc. Veamos un ejemplo:

```python {3}
DEBUG = config('DEBUG', cast=bool)
PORT = config(‘DB_PORT’, cast=int)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])
```

En el caso de `ALLOWED_HOSTS` en `Django` se espera una lista de hosts que están permitidos, pero en los ficheros de configuración no se puede almacenar una lista en si, por lo que hay que almacenar los elementos separados por coma y hacer el `cast` como se muestra en el ejemplo anterior. `decouple` brinda una función para hacer `cast` a este tipo de elementos: `Csv`

``` bash
>>> from decouple import Csv
>>> os.environ['ALLOWED_HOSTS'] = '.localhost, 127.0.0.1, .herokuapp.com'
>>> config('ALLOWED_HOSTS', cast=Csv())
['.localhost', '127.0.0.1', '.herokuapp.com']
```

### Valores por defecto

Adicionalmente, se puede agregar a `config` el argumento nombrado `default` para utilizarlo como valor por defecto cuando este no está presente:

```python
DEBUG = config('DEBUG', default=True, cast=bool)
```

## Usos comunes

Estos son algunos usos que están presentes en casi todos los proyectos, aunque puedes ponerte realmente creativo en como usas `python-decouple`

```python
from decouple import Csv, config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_HOST', default=5432, cast=int),
    }
}

USE_S3 = config('USE_S3', default=False, cast=bool)
if USE_S3:
    # aws settings
    AWS_ACCESS_KEY_ID = config('AWS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_KEY')
    AWS_STORAGE_BUCKET_NAME = config('AWS_S3_BUCKET_NAME')
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
    # s3 static settings
    STATIC_LOCATION = 'static'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
    # s3 public media settings
    PUBLIC_MEDIA_LOCATION = 'media'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'
else:
    STATIC_URL = '/static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')

    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```
