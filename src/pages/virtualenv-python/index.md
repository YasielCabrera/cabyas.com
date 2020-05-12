---
title: Virtual Environments in Python
date: '2020-03-22'
spoiler: Insolate your environments.
---

Virtual environment are mechanisms used in python to isolate all the environments you could have in your PC. Then, dependencies you have in them doesn't have collisions between them. 

Others platforms like Node install all their dependencies (packages) in a folder relative to the project (node_modules) where them are being used. In that way, any dependence have collisions with, maybe, the same dependence but different version in other project. Now imagine that all the dependencies in Node are globals, it's highly probable that you will have the same dependence with different version in two or more projects since even the most simple project with Node have thousands of packages.

With python happens the same, except that every package is installed "globally". If you try to install the same package, only the latest version will be available since it override the others one.

To solve this problem, guess... yeah, you need a virtual environment!

- [Create and use](#create-and-use)
  - [python -m venv](#python--m-venv)
      - [Activate the env in windows](#activate-the-env-in-windows)
      - [Activate the env in Posix platforms](#activate-the-env-in-posix-platforms)
  - [virtualenv](#virtualenv)
  - [virtualenvwrapper-win](#virtualenvwrapper-win)
- [Deactivate the environment](#deactivate-the-environment)
- [Delete the environments](#delete-the-environments)


## Create and use

I'll cover three ways to create virtual environments in windows. (The last one is which I use and prefer)

Every virtual environment created will be a copy of your global installation and will have the python binaries and all the packages previously installed.

### python -m venv

This is a built-in way to create virtual environments available since python 3.3. Nothing more than python is required.

```console
python -m venv myenv
```

After type the above line in a console and execute it, a new folder called `myenv` will be created in the same directory where it was executed. You can name you virtual environment folder as you want. Common names are: `venv` or `env`

Now you created the environment, the next step is activate and use it. If you install a package before activate the environment it will be installed globally.

##### Activate the env in windows

To activate the environment in the `cmd` console run:

```bash
myenv\Scripts\activate
```

To activate the environment in PowerShell run:

```bash
.\myenv\Scripts\Activate.ps1
```

##### Activate the env in Posix platforms

Run:

```bash
$ source myenv/bin/activate
```

Remember that all these path starting with `myenv` is because that is the name we choose. It depends on the name you choose!


After the activation, we'll know it's activate because in the console the name of the environment will be appear between parenthesis:

```bash
(myenv) $
```

### virtualenv

This is a third party package to create virtual environments and it works very similar to `python -m venv`. Before use it, we need to install it!

```bash
pip install virtualenv
```

Now it's installed, we can check it out by running `virtualenv --version`. But, how can we create new environments? Easy! 😁

```bash
virtualenv myenv
```

The environment is created, to activate it you can do exactly the same of you did if you use `python -m venv` [above](#activate-the-env-in-windows) (`myenv\Scripts\activate`)

*Note: "myenv" is just the name I choose but you can name your environments as you want!*

You can find the docs of `virtualenv` [here](https://virtualenv.pypa.io/).

### virtualenvwrapper-win

This is my favorite way to create and use my environments since I use Windows 10 😎. It use a very straightforward way to use environments. Under the hood, it uses `virtualenv` but provides some scripts to create, activate and delete environments that make easier our life.

It works only in windows, all windows distributions are supported, well which you must use, or you use Windows 95 🤓. It's supported from Windows XP to Windows 10! As a third party package, we need to install it.

```bash
pip install virtualenvwrapper-win
```

Pip will take care of their dependencies (virtualenv) for us, as it always do 😊.

To create a new virtual environment just run:

```bash
mkvirtualenv venv
```

Automatically it will activate the new environment. But if you want to activate yourself later, just run:

```bash
workon venv
```

*Note: Again, "venv" is the name I had been using in the whole post, but you can name it as you wish. In real world app, probably you will prefer a more descriptive name*

You can find the docs of `virtualenvwrapper-win` [here](https://pypi.org/project/virtualenvwrapper-win/).

## Deactivate the environment

Well, deactivate the environment, whatever way you're using, it's the same. Just run: `deactivate`. Yeah, that easy!

## Delete the environments

Just delete the folder of the environment, nothing more 😏. 

