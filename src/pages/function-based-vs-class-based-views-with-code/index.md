---
title: Function-based VS Class-based Views with Code (CRUD) 
date: '2020-06-19'
spoiler: Unopinionated comparison of minimum code required to create CRUDs with Django using Class-Based Views and Function-Based Views
---

A few weeks ago I wrote [an article](/function-based-views-vs-class-based-views/) where I explained the pros and cons of function-based (FBV) and class-based (CBV) views; a week later I wrote [another article](/django-crud/) where I presented a simple project showing the CRUDs in Django and the little code needed to do it. The project was written using CBV. I've already demonstrated [my preference](/function-based-views-vs-class-based-views/#personal-preferences) of CBV over FBV, but this article will be unopinionated, I will only show the analog code of each CRUD with CBV and FBV. I'll let you come to a conclusion on your own.

For this article I will use the same project that I used for [the article of the CRUDs](/django-crud/), this project can be found at [GitHub](https://github.com/cabyas/django-crud-example). The code shown in this article can be found in the `fbv-vs-cbv` branch of the repository.

- [Listing Items](#listing-items)
- [Details page](#details-page)
- [Creating elements](#creating-elements)
- [Updating information](#updating-information)
- [Deleting information](#deleting-information)

## Listing Items

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

## Details page

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

## Creating elements

In this case, for the FBVs it is necessary to create a form (`CreateLanguageForm`). For CBV it is not required because when you inherit from `CreateView`, if you specify the `fields` attribute, a form is automatically created for those fields.

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

## Updating information

For these views, as well as those for creating information, it is also necessary to create a form. For simplicity in this example, we are using the same form used to create information (`CreateLanguageForm`).

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

## Deleting information

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
