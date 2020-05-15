---
title: Django Management Commands
date: '2020-05-11'
spoiler: 'Complete guide about how and when create, test and customize Django Management Commands.'
---

We've been using Django commands since we started creating a project, an app or started the development server. The commands to perform these operations (`startproject`, `startapp` and `runserver`) are probably the most well known, but there are many more, and we can also write our own commands.

We can see all the commands that exist by default in our project by running the `python manage.py` command without arguments or `python manage.py help`. This is the list of all the available commands:

```bash
python manage.py help

Type 'manage.py help <subcommand>' for help on a specific subcommand.

Available subcommands:

[auth]
    changepassword
    createsuperuser

[contenttypes]
    remove_stale_contenttypes

[django]
    check
    compilemessages
    createcachetable
    dbshell
    diffsettings
    dumpdata
    flush
    inspectdb
    loaddata
    makemessages
    makemigrations
    migrate
    sendtestemail
    shell
    showmigrations
    sqlflush
    sqlmigrate
    sqlsequencereset
    squashmigrations
    startapp
    startproject
    test
    testserver

[sessions]
    clearsessions

[staticfiles]
    collectstatic
    findstatic
    runserver
```

We can also see the help of a specific command: `python manage.py help <command>` where `command` is the name of the command we want to consult.

## When to create a new command

We can write our own commands and there is no limit to how many commands we can create, but when should we create a new one?

We must create a new command when the existing commands do not solve the needs of our project and we need to do a task that is executed occasionally (CRON Jobs, importing data from a CSV, etc) either automatically or manually. For example, if we have a human resources system and we need to pay the workers, we probably need to create a `pay` command that has the logic to make the payment to all the workers in the company. There are probably other ways to solve the previous example but this is one of them.

## Writing the first command

We'll start writing a basic command, it'll be... 🥁 🥁 exactly, a "Hello World" 😊

All the commands must be created inside an `app` in a `management/commands` directory, that is, in the App where you want to create, it must exist or create if it doesn't a directory named `management` and inside another directory named `commands`. Inside the `commands` directory we will create the commands, one by [module](https://docs.python.org/3/tutorial/modules.html) (or file).

The commands will be named the same as the module where they are, in other words, if we create a module called `hello.py`, then to execute this command we must do it in the following way:

```bash
python manage.py hello
```

The directory structure of the project remains as follows:

``` {5}
management_commands/                 <-- project directory
 |-- core/                           <-- app directory
 |    |-- management/
 |    |    +-- commands/
 |    |         +-- hello.py         <-- module where command is going to live
 |    |-- migrations/
 |    |    +-- __init__.py
 |    |-- __init__.py
 |    |-- admin.py
 |    |-- apps.py
 |    |-- models.py
 |    |-- tests.py
 |    +-- views.py
 |-- management_commands /
 |    |-- __init__.py
 |    |-- settings.py
 |    |-- urls.py
 |    |-- wsgi.py
 |    |-- asgi.py
 +-- manage.py
```
 
Let's now look at the contents of the `hello.py` module:

```py
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Displays the text "Hello world"'

    def handle(self, *args, **kwargs):
        self.stdout.write('hello world')
```

Commands must inherit from the `BaseCommand` class and the class must necessarily be called `Command` since Django will search by that name. If we name the class with another name, when we execute the command we'll get an error like this:

```bash {1,15}
python manage.py hello
Traceback (most recent call last):
  File "manage.py", line 21, in <module>
    main()
  File "manage.py", line 17, in main
    execute_from_command_line(sys.argv)
  File "C:\Users\cabyas\Envs\commands\lib\site-packages\django\core\management\__init__.py", line 401, in execute_from_command_line
    utility.execute()
  File "C:\Users\cabyas\Envs\commands\lib\site-packages\django\core\management\__init__.py", line 395, in execute
    self.fetch_command(subcommand).run_from_argv(self.argv)
  File "C:\Users\cabyas\Envs\commands\lib\site-packages\django\core\management\__init__.py", line 244, in fetch_command
    klass = load_command_class(app_name, subcommand)
  File "C:\Users\cabyas\Envs\commands\lib\site-packages\django\core\management\__init__.py", line 38, in load_command_class
    return module.Command()
AttributeError: module 'core.management.commands.hello' has no attribute 'Command'
```

In the `help` attribute we put a text that will describe what the command does and it will be this text that will be shown when the `python manage.py help <command>` command is executed.  The command code must be defined within the `handle` method.

## Arguments

If you're reading this article, you probably created at least one project with Django, so you executed the `startproject` command. The `startproject` command has an argument: the name of the project. When you create a command, it can also accept arguments.

The commands will accept two types of arguments: named and positional. Named arguments are those that have the prefix `--` or `-` and it doesn't matter the order in which they are passed to the command. Positional parameters do not have any prefix and have to be passed in the same order they are specified.

The arguments in the commands are handled with the standard Python library [argparse](https://docs.python.org/3/library/argparse.html) so they have to satisfy its specifications. A method called `add_arguments` must be added to commands to allow arguments in the command.

```py
def add_arguments(self, parser):
    # positional argument
    parser.add_argument('name', type=str, help='A name to greet him')

    # named argument
    parser.add_argument('-l', '--lastname', type=str, help='Lastname to greet him')
```

The `parser` argument is an instance of `argparse` so all operations in this library are available and allowed. In the case of the named arguments we can put "aliases". In the example above the argument can be specified as an `-l` or `--lastname`. To execute a command with the arguments as in the previous example it is done in the following way:

```bash
python manage.py hello Jhon --lastname Doe
```

### Arguments with default values

Sometimes you want that just passing an argument is enough to know what to do, for example, the argument `--noreload` of the `-runserver` command doesn't need to be passed after the argument because it has a default value, in this case it is a boolean so if this argument is present it means that it has as value: `True`, otherwise it will be `None`. In this example the value is a boolean, but it can be any type.

To create an argument with a default value we need to add the `action` parameter when we call the `add_argument` method. The value of the `action` parameter will depend on the type and the default value you want the argument to have, if you want it to be boolean, that means that when it's present it must be `True` or `False`, it should have the value `store_true` or `store_false` respectively:

```py
parser.add_argument('--noreload', action='store_true', help='...')
```

The arguments can also be constant, or do really interesting things. If you consult the [official documentation](https://docs.python.org/3/library/argparse.html#action) of `argparse` you can know everything that can be done with the `action` parameter. This is an example of how we could store a constant by default:

```bash
parser.add_argument('--foo', action='store_const', const=42)
```

### Argument lists

Many times we don't know how much data is going to be passed to us as an argument in a command. To solve this problem, there are parameter lists where we can receive a list of values with just one parameter.

Suppose you are creating a command to delete users, but you want this command to provide the ability to delete several users at once. This is one of the cases where using a list of arguments is useful.

To create a list you must add the parameters `nargs='+'` and `type` when the `add_argument` method is invoked. In the case of the `type` parameter it can be any type accepted by *argparse*.

```py {9,12}
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Delete one or many users'

    def add_arguments(self, parser):
        parser.add_argument('user_id', nargs='+', type=int, help='Users IDs')

    def handle(self, *args, **kwargs):
        users_ids = kwargs['user_id']

        for user_id in users_ids:
            try:
                user = User.objects.get(pk=user_id)
                user.delete()
                self.stdout.write(f'User "{user.username} ({user_id})" deleted with success!')
            except User.DoesNotExist:
                self.stdout.write(f'User with id {user_id} does not exist.')
```

The above command is executed as follows:

```bash
# elimina si existe el usuario con id 5
python manage.py delete_users 5

# elimina si existen los usuarios con id 1, 2, 3 y 4
python manage.py delete_users 1 2 3 4
```

### Output and styles

Printing text by standard Python output from a command is done slightly differently than printing something elsewhere in the application. Instead of using the `print` function we use the `stdout` streams for standard output, and `stderr` for errors. Both `stdout` and `stderr` are attributes of `BaseCommand` so we can use them as follows:

```py
self.stderr.write('error')
self.stdout.write('normal')
```

You can also add "color" to the texts we print using the attribute `style`, so that what is printed has the same meaning both visually and semantically. The [official documentation](https://docs.djangoproject.com/en/3.0/ref/django-admin/#syntax-coloring) explains the role of each of these colors. Let's see an example where each of the variants is used:

```py
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Prints all allowed output syntax coloring'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.ERROR('error - A major error.'))
        self.stdout.write(self.style.NOTICE('notice - A minor error.'))
        self.stdout.write(self.style.SUCCESS('success - A success.'))
        self.stdout.write(self.style.WARNING('warning - A warning.'))
        self.stdout.write(self.style.SQL_FIELD('sql_field - The name of a model field in SQL.'))
        self.stdout.write(self.style.SQL_COLTYPE('sql_coltype - The type of a model field in SQL.'))
        self.stdout.write(self.style.SQL_KEYWORD('sql_keyword - An SQL keyword.'))
        self.stdout.write(self.style.SQL_TABLE('sql_table - The name of a model in SQL.'))
        self.stdout.write(self.style.HTTP_INFO('http_info - A 1XX HTTP Informational server response.'))
        self.stdout.write(self.style.HTTP_SUCCESS('http_success - A 2XX HTTP Success server response.'))
        self.stdout.write(self.style.HTTP_NOT_MODIFIED('http_not_modified - A 304 HTTP Not Modified server response.'))
        self.stdout.write(self.style.HTTP_REDIRECT('http_redirect - A 3XX HTTP Redirect server response other than 304.'))
        self.stdout.write(self.style.HTTP_NOT_FOUND('http_not_found - A 404 HTTP Not Found server response.'))
        self.stdout.write(self.style.HTTP_BAD_REQUEST('http_bad_request - A 4XX HTTP Bad Request server response other than 404.'))
        self.stdout.write(self.style.HTTP_SERVER_ERROR('http_server_error - A 5XX HTTP Server Error response.'))
        self.stdout.write(self.style.MIGRATE_HEADING('migrate_heading - A heading in a migrations management command.'))
        self.stdout.write(self.style.MIGRATE_LABEL('migrate_label - A migration name.'))
```

Result of executing the previous command:

![Syntax Coloring output](syntax_coloring.jpg)

##  Testing

Testing that the written code works properly is something that most developers only do manually, but sometimes they forget to write automated tests. Automated testing ensures that every time a change is made to the project everything continues working as it should.

Here is just a simple example of [how to test if a command works](https://docs.djangoproject.com/en/3.0/topics/testing/tools/#topics-testing-management-commands) correctly based on what it prints on the console with `self.stdout`. We will test the command written earlier to remove users:

```py
from io import StringIO
from django.core.management import call_command
from django.test import TestCase
from django.contrib.auth.models import User


class DeleteUserCommandTest(TestCase):

    def setUp(self):
        User.objects.create(username="jhon")

    def test_command_output(self):
        out = StringIO()
        call_command('delete_users', 1, 2, stdout=out)
        user1 = out.getvalue()
        user2 = out.getvalue()

        self.assertIn('User "jhon (1)" deleted with success!\n', user1)
        self.assertIn('User with id 2 does not exist.\n', user2)
```

In the [official documentation](https://docs.djangoproject.com/en/3.0/ref/django-admin/#django.core.management.call_command) you can consult how to use `call_command`. This function is used to programmatically execute a command. The first parameter is the name of the command and the following parameters are the arguments of the command. Named arguments can also be passed as named function parameters.

In the example above, the test is first configured with the `setUp` method, where a user is created and then tested for successful deletion. With the `call_command` function, the command is executed programmatically and the standard output of the command is redirected to a `StringIO` instance which is then used to read the output of the command line by line. The command will try to remove the users that have ID 1 and 2, there will be a user with ID 1, since in the configuration method it is created, and being the first one, it will have ID 1, but there will not be any user with ID 2. The output of the command is checked in the last lines with `assertIn. If everything is OK, the command will print what is expected and the test will be passed successfully.

## Conclusions

The commands are the perfect mechanism to create reports, maintenance tasks, among other operations that are repeated periodically either manually or through a scheduled tasks. Passing arguments is often one of the most complex tasks when creating commands with many arguments, and the official documentation of [argparse](https://docs.python.org/3/library/argparse.html) is often the ideal place to solve this problem. The Django [official documentation](https://docs.djangoproject.com/en/3.0/howto/custom-management-commands/) for creating commands is also an excellent resource to look at.

The examples shown in this tutorial can be found in [GitHub](https://github.com/cabyas/ManagementCommands)
