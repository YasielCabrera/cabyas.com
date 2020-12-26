---
title: 'Python Decouple: A strict separation of config from code'
date: '2020-12-25'
spoiler: 'Decouple helps you to organize your settings so that you can change parameters without having to redeploy your app.'
image: image.png
---

All web applications depend on configuration parameters that are environment dependent. For example, **Django** applications have some of these parameters: database URL, secret keys, allowed hosts, debug, mail host, etc. Most of these parameters are not only environment dependent, but many of them are highly sensitive (like database credentials, for example). 
`Python-decouple` is one of my favorite packages that I use in each of my projects. It was designed to separate the configuration parameters from the code.

## When is it practical to use `Python-decouple`?

This package can be used in any project regardless of size, scope or where it will be deployed.
It is preferred to use `Python-decouple` over `os.environ` as the last one only returns `strings` while `decouple` provides solutions to cast simple types and even complex types like `list`, `tuple` and objects.

## How to use

The package is installed directly from `pypi` using `pip` or any other package manager:

```bash
pip install python-decouple
```

After installing the package you can start using it. This is a library that is usually only used in `settings.py`, although it can be used anywhere in the project. To start using it, just import `config` and then get the argument values:

```python
from decouple import config
CONFIG_VARIABLE = config('ARG_KEY')
```

The arguments with their corresponding values can be stored in two formats: `.ini` and `.env`.

Using `settings.ini`:

```ini
[settings]
DEBUG=True
TEMPLATE_DEBUG=True
SECRET_KEY=ARANDOMSECRETKEY
DATABASE_URL=mysql://myuser:mypassword@myhost/mydatabase
PERCENTILE=90%%
#COMMENTED=42
```

Using fichero `.env`:

```ini
DEBUG=True
TEMPLATE_DEBUG=True
SECRET_KEY=ARANDOMSECRETKEY
DATABASE_URL=mysql://myuser:mypassword@myhost/mydatabase
PERCENTILE=90%
#COMMENTED=42
```

It is important to know the order that follows `decouple` to search for the arguments. When `config('ARG_KEY')` is invoked, the value of the `ARG_KEY` argument is expected, so `decouple` will search for its value in the following order:

1- Environment variables. It is important to know that where it will be searched first will be in the environment variables because, if there is any environment variable currently configured will take precedence over the argument of the same name in a file.

2- Files `.ini` o `.env`

3- Finally, if the argument is not found, the default value provided will be used, or in cases where a value is not provided, `decouple` will raise an `UndefinedValueError` exception. We'll see how default values are used later on.

>**WARNING:** Be sure to add the file you use to the `.gitignore`. This way you will not include the file in the version control software and will keep sensitive data protected.

Since these files are omitted from the version control software it is a good idea to create a file as an example of what parameters should be set, perhaps adding it to the `readme.md` or some other. Personally, I like to create a `.env.example` file with all the arguments I use in the project, so when it is going to be deployed for the first time, since the file with the real parameters does not exist yet, I simply copy the example file with the final name and change its content with the real values of the arguments.

## Advanced Uses

Using only `config('ARG_KEY')` is "almost" the same as using `os.environ`, so it is necessary to use the *super powers* provided by `python-decouple`

### Converting arguments

By default both `os.environ` and `decouple` return the argument values as strings. Automatically converting the argument type is one of the features that makes decouple a better option.
In order to convert the arguments you just need to add to `config` a named parameter: `cast` with a function that waits for an argument and returns the argument value with the type you want to convert it to. Fortunately there exist functions for the primitive data types in python: `int`, `float`, `bool`, etc. Let's look at an example:

```python {3}
DEBUG = config('DEBUG', cast=bool)
PORT = config(‘DB_PORT’, cast=int)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])
```

In the case of `ALLOWED_HOSTS` in `Django` a list of hosts that are allowed is expected, but in the configuration files you cannot store a list itself, so you have to store the elements separated by commas and do the `cast` as shown in the example above. `decouple` provides a function to `cast` this kind of elements: `Csv`

``` bash
>>> from decouple import Csv
>>> os.environ['ALLOWED_HOSTS'] = '.localhost, 127.0.0.1, .herokuapp.com'
>>> config('ALLOWED_HOSTS', cast=Csv())
['.localhost', '127.0.0.1', '.herokuapp.com']
```

### Default values

Additionally, you can add to `config` the named argument `default` to use it as a default value when it is not present:

```python
DEBUG = config('DEBUG', default=True, cast=bool)
```

## Common Uses

These are some uses that are present in nearly every project, although you can get really creative in how you use `python-decouple`

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
