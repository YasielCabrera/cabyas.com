---
title: Django Shell
date: '2020-05-06'
spoiler: What is the Django Shell, how does it work and what can it be used for
cta: 'django-shell'
---

The interactive console is a tool that allows us to write Python code statements at the same time that they are executed. We can access this useful tool by executing the `python` command in a console and immediately we can write any valid Python statement in it, from declaration of variables to loops and classes. It is a powerful tool to test small portions of code and verify that it behaves exactly as we want.

One problem that arises when we're on a project with Django is that the settings for it aren't loaded so we won't have access to the database, email or other configurable features of Django. Although we can run the Python code that takes care of loading these settings, it's not that simple and... developers don't like spend work, so Django comes with a command that does this for us: `shell`.

The django shell, or interactive console, works exactly the same as Python's only with the difference that we can, for example, query the database and this database will be the one configured in `settings.py`. In this console we can execute any code that can be executed in any part of a Django project.

## Opening the shell

To open the shell we only have to open a console (if we have a virtual environment, we must activate it). Then run the following command:

```bash
python manage.py shell
```

The [prompt](https://www.webopedia.com/TERM/P/prompt.html) is indicated by the symbol `>>>` and as soon as it appears we can start entering code. For each line entered, pressing `Enter` will display the result on the next line. If the line entered requires more lines, for example, in the case of `for` loops, the prompt will change to three points `...` indicating that the new line depends on the previous one, in those cases you must press `Enter` on a blank line to execute all the previous lines:

```python
>>> print('hello world')  # one line
hello world 
>>>
>>> for n in range(1, 3):  # multiple lines 
...	    print(n)
...
1
2
>>>
```

## 4 things you can do in the shell

Although here I introduce you only 4 cases in which using the `shell` is very handy, your imagination is the limit, there are very few things you can't do in the `shell`.

### 1- Working with the database:

This is one of the main uses that developers give to the Django `shell`. Earlier I mentioned that we can execute any code that we could put anywhere in a Django project, so here we can update, delete, create or read information from the database using the ORM.

### 2- Building complex queries:

Creating simple queries is very easy and we are unlikely to make a mistake, but when we create complex queries, they almost never work at first (at least for me). If they don't work it's not a problem, we'll see the error when we open the page or whatever that runs the query, the problem is that to know if it works or not we have to (in most cases): save the file, wait for the development server to load the new changes, open the browser, open the page that runs the query and if it gives an error, fix the query and repeat the process until it works. This process can sometimes be very time consuming. That's why creating the query in the interactive console is a good practice as we'll know if there's something wrong as soon as we press `Enter`.

### 3- Fixing inconsistencies in production:

Let's imagine that for some reason we need to modify some data in production, something simple. We might think of creating a new [command](https://docs.djangoproject.com/en/3.0/howto/custom-management-commands/), but we are going to use it once only! Another way could be to write some code within the project. In both cases, you'd have to add the changes to git, probably create a [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests), deploy the changes, and once you deploy the project with the new changes, if the code doesn't run automatically, you'd have to run it manually. A lot of work! With the `shell` we just need to connect to the production server, open the `shell`, and run the code we need to make the changes we want.

### 4- Sending emails

The main idea of the `shell` is to run code using the project settings so we can [send emails](https://docs.djangoproject.com/en/3.0/topics/email/) easily using the settings from the` shell`:

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

## Conclusions

The `shell` is the perfect place to test "stuffs" on the project, especially when we're creating or testing database queries.
