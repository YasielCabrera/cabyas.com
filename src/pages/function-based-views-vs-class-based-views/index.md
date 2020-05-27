---
title: Function-Based Views VS Class-Based Views
date: '2020-05-26'
spoiler: Pros and cons of Function Based Views and Class Based Views. Which is better?
---

Like any other web framework, one of Django's main functions is to receive HTTP requests and respond to them. It does this through what Django calls `Views`. A `View` is nothing more than a "function" that returns a response to a request. In Django, requests are represented by a `HttpRequest` object and responses by `HttpResponse`.

Unlike many of the modern frameworks, Django uses a MVT (Model - View - Template) architecture instead of MVC. These two architectures are very similar and many people tend to confuse them. If you're not familiar with MVT, for now let's say that the "V" (Views) in Django is the analogous part to MVC's Controllers.

Django's official documentation quickly introduces what we know as Function-Based Views (FBV). FBV are functions like any other function that can be written in Python, except that it accepts at least one `HttpRequest` parameter and returns an instance of `HttpResponse` or some subclass. Let's look at an example:

```py
from django.http import HttpResponse

def index_view(request):
    if request.method == 'GET':
        return HttpResponse('Hello get!')
    elif request.method == 'POST':
        return HttpResponse('Hello post!')
```

The example above shows how simple the `Views` in Django can be. The example shows a `View` called `index_view`, when it is invoked by a `GET` HTTP verb, the response is `Hello get!` while if it is invoked by the `POST` verb  the response is `Hello post!`.

Let's look at the same example now, but with a Class-Based View:

```py
from django.views.generic import View
from django.http import HttpResponse

class IndexView(View):

    def get(self, request):
        return HttpResponse('Hello get!')

    def post(self, request):
        return HttpResponse('Hello post!')
```

Both examples presented above do exactly the same thing, the only difference between them is that the first is implemented as a Function Based View (FBV) and the second with a Class Based View (CBV). At this point you may be asking yourself: What are the CBVs needed for? When should I use one and when should I use the other? Which one is better? 

Let's see how they works and their pros and cons to answer those questions.

## Function Based View

**Pros:**
- Easy to implement
- Easy to read (when they are small)
- Explicit code flow. We explicitly see all the code that will be executed in the view.

**Cons:**
- Hard to extend and reuse the code.
- Handling of HTTP verbs through conditions. 
- There are few cases in which the views are kept small and simple so they can become difficult to read and understand when they are large.

FBVs have been part of Django since its beginning and there are still more developers than you might imagine who prefer them. As seen in previous examples, these `Views` are easy to implement and read, but Web projects tend to have a lot in common that could be reused and save code (Don't Repeat Youself - DRY) but this type of `Views` does not allow it. This is one of the main reasons why CBVs were created.

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

The above example is probably the most recurrent case in all types of projects, as almost all projects have forms. We'll see how this is done with CBV later on.

## Class Based View

**Pros:**
- Can be extended and the code can be easily reused.
- HTTP verbs can be handled using separate methods.
- Variety of generic built-in classes for the most common tasks.
- Complex tasks can be done with very little code. 

**Cons:**
- Can be difficult to read, especially for beginners or developers who are not familiar with Object-Oriented Programming.
- Hidden code in parent classes.
- Many of the generic `Views` are so abstract that they seem to do their job "magically" (they just work).

Let's look at the previous example, this time written as a CBV:

```py
class ContactView(FormView):
    template_name = 'my_template.html'
    form_class = MyForm
    success_url = '/thanks/'
```

This example does "exactly" the same thing as the one written with FBV. As we can see, much less code is needed and although it doesn't look like it, is allowed to modify the code flow and add certain custom behaviors by overriding some methods. Is it harder to understand? YES, is it easier to implement (if you know how they work)? ABSOLUTELY YES! 

The CBVs were added to Django to complement the FBVs, not to replace them, and both ways of creating `Views` have pros and cons. There are times when it is better to use a FBV and times when using a CVB is more useful.

`FormView` is not the only class that can be used to create CBVs, there is at least one for almost every use case that we can have in any project. A list of all built-in generic `Views` classes can be found in the [official documentation](https://docs.djangoproject.com/en/3.0/ref/class-based-views/).

## Personal preferences

After several years working with Django, I have a deep preference for CBV. I use them whenever I can and so far in only a few (insignificant) cases it has been more convenient to use FBVs.

Using CBV requires extra study and understanding about how each one works, as well as what methods to override to modify their behavior. Once you understand when and how to use them correctly, creating `Views` becomes very simple and often help to develop faster.

Using classes is sometimes complex, especially because of the Object-Oriented paradigm that many people don't understand, but if you haven't already learned the OOP and you want to dedicate yourself to the world of programming, I think it's time you start learning it!