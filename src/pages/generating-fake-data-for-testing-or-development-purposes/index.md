---
title: Generating fake data for testing or development purposes
date: '2020-12-20'
spoiler: Generate data to see the application as an user would see it consumes too much, better to automate the process.
image: image.png
---

> If a task takes more than 90 seconds, automate it.

Almost all modern applications handle data and have user interfaces that depend on these data. Therefore, it is necessary during the development process of these applications to insert data to see the dynamic features that depend on them. But sometimes the amount of data we have to insert in order to see some features is too much. Other times, we have to create a database from scratch, we start new in a project or any other reason, in any case: We need to "fill" the database in order to see it as our users would see it!

Inserting data by hand can be tedious so there are several libraries for creating "fake data" in Django and in this article we'll look at one of them: `django-seed`. There are many others, but `django-seed` is one of my favorites, it's very simple to use, there's a lot of documentation, it's flexible, it has support for `Python 3` and `Django 3+` and it's still maintained by the community which guarantees that possible errors in the future will be fixed.

## Installation

It is very simple to install `django-seed` in `django`, just install the package from `pip` and then add `django_seed` in the installed applications of our project, this way it is possible to execute the `seed` command that we will see later.

1- Install the package:
```bash
pip install django-seed
```

2- Add `django_seed` to the installed applications (`INSTALLED_APPS`) of the project in the `settings.py` file:

```python
INSTALLED_APPS = (
    # ...
    'django_seed',
)
```

**Note:** Note that the package is called `django-seed` but the application is called `django_seed` (with undersore)

## How to use

`django-seed` is very easy to use. There are two ways: using a command or writing code.

Whichever method is used, it should be noted that for models that have `ForeignKey` fields, it must be guaranteed that the foreign model must be "seeded" before the model that has the `ForeignKey`. Suppose you have a `User` model with a `ForeignKey` field to another model called `Profile`; for this case the `Profile` model must be "seeded" before `User` otherwise an error will occur.

### Using the `seed` command

With this command it is extremely easy to insert data into the database, just run it and say how many instances of each model you want:

```bash
python manage.py seed app --number=15
```

The only parameter this command has is `number`, which indicates how many instances of each model you want. The default value is 10.

### "Seeding" data with code

`django-seed` also provides an API to easily generate data from the models writing code.  Let's look at an example:

```python
from django_seed import Seed
from myapp.models import Game, Player

seeder = Seed.seeder()
seeder.add_entity(Game, 5)
seeder.add_entity(Player, 10)

inserted_pks = seeder.execute()
```

In the example above, fake data is created for the `Game` and `Player` models. The first step is always to create an instance with `Seed.seeder`. With this `seeder` instance you can use the `add_entity` method to create the data. `add_entity` has three parameters, the first is the class of the model you want to "seed", in other words, create data. The second parameter is the number of instances of the class that you want to create. The third parameter allows you to customize the type of information in each field of the model. 

Just with `add_entity` is not enough to create the data, it is necessary to invoke the `execute` method of the `seeder` to create them in the database. This method returns a dictionary where the keys are the classes that were "seeded" and the values a list of integers where each integer represents the "id" of each instance that was created. For the previous example if you want to get the list of the `id` of the `Game` instances that were created we access it in the following way: `inserted_pks[Game]`.

`django-seed` uses the name and type of column to infer the type of information to be generated for each field. In the [source code](https://github.com/Brobin/django-seed/blob/master/django_seed/guessers.py) you can see the column names (`NameGuesser`) and field types (`FieldTypeGuesser`) that it can infer. There are many cases in which the name or type of the field is not enough to deduce what type of data should be generated, for these cases we use the third parameter, which is a dictionary where the keys are the name of the field and the values are functions that return the value you want to assign to the field.

Suppose that the fields of the `Player` model: `score` and `nickname` need certain restrictions that are not inferred from the field names and types. `score` can only be an integer value between 0 and 1000 and `nickname` is a mail:

```python
seeder.add_entity(Player, 10, {
    'score':    lambda x: random.randint(0,1000),
    'nickname': lambda x: seeder.faker.email(),
})
```

To generate the fields you can use the `django-seed` faker or any other method that returns a value according to the field type (if the field is an `IntegerField` you cannot assign it a string or you will get an error)

## Python faker

In the previous example, `seeder.faker` is used to generate the `nickname`, this `faker` is an instance of the `faker` provided by the [Faker](https://faker.readthedocs.io/en/master/) library. All methods from that library can be used and by default all [standard providers](https://faker.readthedocs.io/en/master/providers.html) are usable.

Let's see an example:

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

In the previous example the function `get_user` is used to generate the `user` field of the entity `Log`. `django-seed` "seeds" the foreign fields obtaining randomly an instance of those previously generated in the foreign model, but, if the foreign model is not seeded previously then there will be no element to select since the existing ones in the database are not eligible. To make the existing data eligible, it must be done explicitly by selecting it with a query, which is the reason for the existence of the `get_user` method.

## Conclusions

`Django-seed` is one of those libraries that is a good idea to have in the arsenal since it can be used in any project, is extremely useful and saves a lot of time.

This library has a lot of documentation and it should not take more than 30 minutes to learn it and start using it like a pro.