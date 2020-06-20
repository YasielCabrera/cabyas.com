---
title: Vistas Basadas en Funciones VS Basadas en Clases con código (CRUD)
date: '2020-06-19'
spoiler: Comparación no opinada del código mínimo necesario para crear CRUDs con Django utilizando Vistas Basadas en Clases y Vistas Basadas en Funciones
---

Hace unas semanas escribí [un artículo](/function-based-views-vs-class-based-views/) donde hablaba sobre las ventajas y desventajas de las vistas (`Views`) basadas en funciones (VBF) y las basadas en clases (VBC); una semana más tarde escribí [otro artículo](/django-crud/) donde mostraba con un proyecto sencillo las CRUDs en Django y el poco código que se necesitaba para hacerlo. El proyecto fue escrito utilizando VBC. Ya he mostrado [mi preferencia](/function-based-views-vs-class-based-views/#personal-preferences) de las VBC sobre las VBF, pero este artículo no será opinado, solo mostraré el código análogo de cada CRUD con VBC y VBF. Dejaré que llegues a una conclusión por ti mismo.

Para este artículo utilizaré el mismo proyecto que utilicé para [el artículo de las CRUDs](/django-crud/), este proyecto puedes encontrarlo en [GitHub](https://github.com/cabyas/django-crud-example). El código mostrado en este artículo se encuentra en la rama `fbv-vs-cbv` del repositorio.

- [Mostrando una lista de elementos](#mostrando-una-lista-de-elementos)
- [Página de detalles](#página-de-detalles)
- [Creando elementos](#creando-elementos)
- [Actualizando información](#actualizando-información)
- [Eliminando información](#eliminando-información)

## Mostrando una lista de elementos

```py
# Class-based View

class HomeView(ListView):
    model = Language
    template_name = 'languages/index.html'
    paginate_by = 10
```

```py
# Function-based View

def home_view(request):
    languages = Language.objects.all()
    paginator = Paginator(languages, 10)
    page_number = request.GET.get('page', 1)

    try:
        page_obj = paginator.page(page_number)
    except (PageNotAnInteger, EmptyPage):
        raise Http404(f'Invalid page {page_number}. That page contains no results')

    context = {
        'object_list': page_obj,
        'page_obj': page_obj
    }
    return render(request, 'languages/index.html', context)
```

## Página de detalles

```py
# Class-based View

class LanguageDetailView(DetailView):
    model = Language
    template_name = 'languages/language_detail.html'
```

```py
# Function-based View

def language_details_view(request, pk):
    language = get_object_or_404(Language, pk=pk)
    context = {
        'language': language
    }
    return render(request, 'languages/language_detail.html', context)
```

## Creando elementos

En este caso para las VBF es necesario crear un formulario (`CreateLanguageForm`). Para las VBC no es obligatorio ya que al heredar de `CreateView`, si se especifica el atributo `fields`, se crea automáticamente un formulario para esos campos.

```py
# Class-based View

class LanguageCreateView(CreateView):
    model = Language
    template_name = 'languages/language_create.html'
    fields = ['name', 'compiled', 'learned_at', 'main_paradigm', 'observations']
```

```py
# Function-based View

def language_create_view(request):
    if request.method == 'POST':
        form = CreateLanguageForm(request.POST)
        if form.is_valid():
            language = form.save()
            return redirect(language.get_absolute_url())
    else:
        form = CreateLanguageForm()

    return render(request, 'languages/language_create.html', {'form': form})
```

## Actualizando información

Para estas vistas, como con las de crear información, también es necesario crear un formulario. Por simplicidad de este ejemplo, se utiliza el mismo formulario utilizado para crear información (`CreateLanguageForm`).

```py
# Class-based View

class LanguageUpdateView(UpdateView):
    model = Language
    template_name = 'languages/language_create.html'
    fields = ['name', 'compiled', 'learned_at', 'main_paradigm', 'observations']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['edit'] = True
        return context
```

```py
# Function-based View

def language_update_view(request, pk):
    if request.method == 'POST':
        form = CreateLanguageForm(request.POST)
        if form.is_valid():
            language = form.save()
            return redirect(language.get_absolute_url())
    else:
        language = get_object_or_404(Language, pk=pk)
        form = CreateLanguageForm(instance=language)

    context = {
        'edit': True,
        'form': form
    }
    return render(request, 'languages/language_create.html', context)
```

## Eliminando información

```py
# Class-based Views

class LanguageDeleteView(DeleteView):
    model = Language
    success_url = reverse_lazy('languages:home')
    template_name = 'languages/confirm_language_deletion.html'
```

```py
# Function-based Views

def language_delete_view(request, pk):
    language = get_object_or_404(Language, pk=pk)
    if request.method == 'POST':
        language.delete()
        return redirect(reverse('languages:home'))
        
    context = {
        'language': language
    }
    return render(request, 'languages/confirm_language_deletion.html', context)
```
