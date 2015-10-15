# generator-clay
A Yeoman generator for Clay

[![Circle CI](https://circleci.com/gh/nymag/generator-clay.svg?style=svg&circle-token=a4c35eb0cccf099844c822d0ac36e8495bd2d1d5)](https://circleci.com/gh/nymag/generator-clay)

## Component Generator

You can use the component generator to generate new components in your clay repo.

```
yo clay:component <name>
```

This will create a folder in `components/` with the name of your components, and will also add `all.css`, `print.css`, and a template of your choosing.

Note: Your template language choice will be stored as the default the next time you run this generator, saving you time when creating multiple components.

### --tag

You can pass a `--tag` argument with the name of the tag/element you want to use, rather than using the default of `section`. These are the options:

```
--tag section
--tag article
--tag nav
--tag aside
--tag figure
--tag p
--tag div
```

### --viewports

In addition to the default `all.css` and `print.css`, you can specify viewports to be created.

```
--viewports m
--viewports mobile

# would create 0-600.css

--viewports t
--viewports tablet

# would create 600-1024.css

--viewports d
--viewports desktop

# would create 1024+.css
```

You can also specify arbitrary viewports by passing in a comma-separated string. For more details on the syntax, see [responsive-filenames](https://github.com/nymag/responsive-filenames#responsive-filenames).

```
--viewports 0-300,300-600,600+,1200+

# would create:

0-300.css
300-600.css
600+.css
1200+.css
```
