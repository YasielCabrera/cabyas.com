---
title: Django CRUD
date: '2020-06-04'
spoiler: How to implement CRUD with Django using Class-based Views reusing as much code as possible and without repeating a line of code twice.
image: image.png
---

Django is amazing! If you're still not sure, I won't try to convince you with words but with code.

There are many reasons why Django is my favorite framework, but without a doubt, the number one is because, like the JQuery slogan, I can do more writing less. Django has earned one of the top positions among frameworks that allow rapid application development thanks to the amount of built-in components it has by default, but also because it allows a high level of code reusability.

In this tutorial we will analyze an example where the four basic operations that are never missing in most web applications are used: Create, Read, Update and Delete (CRUD). In the example I created for this tutorial I use Bootstrap 4 for the frontend and Class Based Views (CBV) for all the `Views`.

The example is simple. As there are currently many programming languages out there and we are always learning, we will create a web application where we will store all the languages we know. Useful ehh? Nah, but it's still useful to learn 😜

**The main goals are:**

- Use the CBVs created for each operation.
- Reuse as much of the code as possible.
- Do not repeat the same code twice unless it is necessary (DRY).

## Creating the project

I will name the project as `django_crud_example` (you can choose a different name) and we will only have one `app` that I will name `languages` (you can also choose a different name).

I recommend you to create a [virtual environment](/virtualenv-python/) if you don't have one before you create the project. In this tutorial I will skip the steps to create both, the virtual environment and the project itself. If you still don't know how to create a project from scratch, I recommend you to study first a [tutorial](/starting-a-django-project/) where I explain step by step how to create a project, as well as the meaning of each component.

## The model

For this project we will have only one model: the programming languages. To simplify we will call our model `Languages` and it will have the following fields: the name, if it is compiled or not, when it was learned, the main paradigm (if it is functional, object oriented, etc.) and a field to add our observations about the language.

To keep everything as simple as possible, we'll store our model in the `models.py` module located in the root of the `app` and it will have the following content:

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

In this tutorial I will not focus on the model, so I will only make a few observations about it:

- The `observations` field is a text field that can be up to 500 characters long and it is recommended to use a `TextField` for large texts instead of a `CharField`.
- The `main_paradigm` field is limited to the `PARADIGM_CHOICES` options to prevent users from creating multiple values for what should be a single value. For example, users could enter "Object Oriented", "Object Oriented Language", "OOP", etc. Although these three examples mean the same thing, it is difficult to deduce programmatically that they represent the same thing. Although in this case the `choices` attribute is used to limit the values, also in many cases a separate model can be used and thus make it more dynamic.
- In all the models that you create, you must create the `__str__` method. This method is used to "convert" this object to a text string in some places of the application, for example, in the Django administration module.

After writing the model you have to create the migrations for it and execute them so that they have effects on the configured database.

```bash
python manage.py makemigrations

python manage.py migrate
```

## Required configurations

Before we start with the fun part, we must set up some details so everything works correctly later. We'll start by registering the `Languages` model to the administration module. In this tutorial we won't use the administration module, but it might be useful to you to see the languages you create. To register the model you only need to add the following code fragment in the `admin.py` file located in the root of the `app`.

```py
from django.contrib import admin
from languages import models

admin.site.register(models.Language)
```

Configure the URLs is a step that must be done every time an app is created. Of course, if the app won't be hosting any pages or URLs then this step isn't necessary (in this case it is, as we'll be creating a page for each CRUD). First we need to create the module where the URLs will be added when they are created, this module will be named `urls.py` and will be placed in the root of the `app` with the following content:

```py

from django.urls import path
from languages import views

urlpatterns = [
    # All the URLs will live here
]
```

In order to make the URLs of the application available, they must be [included](https://docs.djangoproject.com/en/3.0/topics/http/urls/#including-other-urlconfs) in the URLs module of the project, that is in the `urls.py` file located in the directory where the `settings.py` module is located, which has the same name of the project.

```py {5}
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include(('languages.urls', 'languages'), namespace='languages')),
    path('admin/', admin.site.urls),
]
```

In the previous code a [namespace](https://docs.djangoproject.com/en/3.0/topics/http/urls/#url-namespaces) is used when we include the URLs of the `app`, this is a practice that I recommend to avoid collisions between the names of the URLs. In small projects they are unlikely to occur, but in large projects with many `apps' it is very common to find them.

Finally, we'll add three lines to the project configuration that will allow the `statics` to work properly:

```py
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
```

## Creating the "layout"

As long as the code can be reused, we should do it. Fortunately, Django helps a lot in terms of reusing code and not repeating it (DRY). 

One of the features of the template language used by Django ([DTL](https://docs.djangoproject.com/en/3.0/ref/templates/language/)) is [inheritance](https://docs.djangoproject.com/en/3.0/ref/templates/language/#template-inheritance). Yes, you can inherit from other templates and extend them. This is because they allow you to create a kind of "holes" that can be filled when you inherit from the template that has them, these holes are called `block`.

A common practice is to create a "base" for all pages that look alike, so we put all the common structure between those pages into a template which we then extend to "put" the changing content on each page. We must leave some "holes" where the content can change. Let's see how the base of our site looks like:

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

For this example only two blocks are needed: one for the title of the page and another for the content.

In more complex projects it is common to have more blocks. Blocks are commonly created to add page-specific styles or JavaScript or to add metadata.

## Displaying information: Read

For this example we will have two pages that respond to the **"R"** of *CRUD*, in other words, two pages that will show information. One of these pages will be the main page, which is where all the languages we know (or at least those we enter into the database) will be displayed. The second page will be the one that will show a specific language and that is where all the details of a language will be shown.

Django comes with several generic `Views` by default, which by inheriting from them you can drastically reduce the amount of code and development time used to create a `View`. A `ListView` can be used for the home page, because that's exactly what it does: it displays a list of objects. Let's look at the code first:

```py
from django.views.generic.list import ListView

class HomeView(ListView):
    model = Language
    template_name = 'languages/index.html'
    paginate_by = 10
```

That small piece of code is responsible for rendering the template `languages/index.html`, passing the list of languages as a context variable to the template and paginating the languages, in this case, by 10. It may sound simple, but doing all that without the help of Django can take a lot more time, would be a lot more code and could have errors if we're not careful. But, Django does the dirty work for us!

Actually, the only attribute that is required is the `model`. By default, the template used if is not specified is the name of the model followed by `_list.html`, if the `template_name` attribute were not specified in this case, Django would search for the `language_list.html` template.

Pagination is possible because one of the ancestors of `ListView` is `MultipleObjectMixin`. This mixin allows that if the `paginate_by` attribute is specified then the list of objects (in this case languages) is paginated.

In the `template` the object list is accessible via the `object_list` variable, although this name can be changed using the `context_object_name` attribute in the `View`. The paging object is accessible via the `page_obj` variable. The template code:

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

In order for this page to work properly, the URL through which it will be accessed must be registered:

```py
urlpatterns = [
    path('', views.HomeView.as_view(), name='home')
]
```

> WARNING: If you copy and paste into your project the code shown so far will not work because there are URLs that have not yet been created.

The second page that will display information is the language details page. To create a detail `View` Django also has a generic `View`, in this case it's called `DetailView`.

```py
from django.views.generic.detail import DetailView

class LanguageDetailView(DetailView):
    model = Language
    template_name = 'languages/language_detail.html'
```

As with `ListView` and the others generic `views` that will be seen, the `model` attribute is the only one that is required, the others are used to customize the view. The template that Django tries to use if the `template_name` attribute doesn't exist is the model name followed by the `_detail.html` suffix. In this case it would be `language_detail.html`.

In the templates, the language instance is accessible through the variable `object` or through another variable with the same name of the model, in this case `language`.

The template for this page looks like this:

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

Finally, in order to be displayed correctly the page, a URL must be registered to associate the `View` with the URL. In order to know which language should be displayed it is necessary to add an argument in the URL: `<int:pk>`. This argument is called `pk` and to be valid it can only contain numbers. If the argument is named other than `pk` it must be specified in the `pk_url_kwarg` attribute. More information can be found in the [official documentation](https://docs.djangoproject.com/en/3.0/ref/class-based-views/mixins-single-object/#django.views.generic.detail.SingleObjectMixin).

```py
urlpatterns = [
    # ...
    path('language/<int:pk>/', views.LanguageDetailView.as_view(), name='language_detail')
]
```

## Creating new languages: Create

To create new objects you need to create forms. In all the frameworks I've worked on so far using forms is a real headache, mainly because this is one of the main sources of attacks, SQL injection, etc.

In Django, forms can also become a headache, but only when they are very complex and we don't have a very organized project. When the forms are simple, working with them is extremely easy.

It is usually recommended to create a class for each form, so that the same form can be reused in various parts of the project. For simplicity, in this case we will use another way to create the forms.

```py
from django.views.generic.edit import CreateView

class LanguageCreateView(CreateView):
    model = Language
    template_name = 'languages/language_create.html'
    fields = ['name', 'compiled', 'learned_at', 'main_paradigm', 'observations']
```

In this case, no form is necessary, because when we inherit from `CreateView` Django creates it for us. To create the form you need the `model` and `fields` attributes. The `model` attribute specifies which model the object is to be created from and the `field` attribute lists all the fields that belong to the model specified in `model` and should be included in the form.

By default the template that Django looks for is the name of the model concatenated with `_form.html`. The form is available in the template in the `form` variable.

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

The template for this page will be reused in the language update page. We only change the header `h1` at the beginning depending on which page is being shown, we achieve this with the context variable `edit`.

As before, the last step to create a new page is to register the URL:

```py
urlpatterns = [
    #...
    path('language/create/', views.LanguageCreateView.as_view(), name='language_create'),
]
```

## Updating languages: Update

The update page is very similar to the one we used to create a language. The only difference is that in this case it is inherited from the generic `View`: `UpdateView`.

The form to update an element, unlike the one to create new objects, needs to be started with the current values of the object to be updated, so the user can see the current values of the object's fields. Fortunately, Django does this for us too if we use the `UpdateView` class.

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

For the first time in this tutorial the `get_context_data` method is used. This method is used to pass extra variables into the context. Although it doesn't look like it, generic Views are very extensible and you can easily customize the way they behave.

The template used in this case is the same one used to create new languages. The URL for this page follows the same philosophy of the detail page:

```py
urlpatterns = [
    #...
    path('language/update/<int:pk>/', views.LanguageUpdateView.as_view(), name='language_update'),
]
```

## Deleting information: Delete

Deleting elements is as simple as everything we've seen so far, Django does a lot of work for us... as usual. Let's jump right into the code:

```py
from django.views.generic.edit import DeleteView

class LanguageDeleteView(DeleteView):
    model = Language
    success_url = reverse_lazy('languages:home')
    template_name = 'languages/confirm_language_deletion.html'
```

The flow of `DeleteView` is as follows: When we access the URL via GET it shows a page which can be used, for example, to notify the user that an element is going to be removed (a confirmation page) and if it's accessed via POST the element is removed and redirected to the URL specified in the `success_url` attribute. `reverse_lazy` gets the URL corresponding to the name specified as the argument.

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

In the template the object to be deleted can be accessed by the context variables `object` or by another one with the same name of the model specified in the `model` attribute. This view doesn't create a form, but we does create one so we can access the URL via POST and also pass the `csrf_token`, which is necessary to securely access the URLs via POST.

Finally, the URL for this page is similar to the detail and update page.

```py
urlpatterns = [
    #...
    path('language/delete/<int:pk>/', views.LanguageDeleteView.as_view(), name='language_delete')
]
```

## Conclusions

Creating CRUDs with Class-based Views in Django is extremely simple and saves a lot of time and code compared to when we use Function-based Views.

Django comes by default with a generic view for almost all cases of uses we can have in our projects. The basic use of these is extremely simple and easy to learn, not being so when you have to customize certain behaviors in them, but it's worth learning and using them whenever possible.

To create a page you always need to perform three actions (the order is not important):

- Create a `View`
- Create a `template`
- Register an URL

All code used here can be found at [GitHub](https://github.com/cabyas/django-crud-example)
