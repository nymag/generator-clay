# generator-clay
A Yeoman generator for Clay

[![Circle CI](https://circleci.com/gh/nymag/generator-clay.svg?style=svg&circle-token=a4c35eb0cccf099844c822d0ac36e8495bd2d1d5)](https://circleci.com/gh/nymag/generator-clay)

## Component Generator

You can use the component generator to generate new components in your clay repo.

```
yo clay:component <name>
```

This will create a folder in `components/` with the name of your component, and will also add `all.css`, `print.css`, and a template of your choosing.

_Note: Your template language choice will be stored as the default the next time you run this generator, saving you time when creating multiple components._

### --tag

You can pass a `--tag` argument with the name of the tag/element you want to use, rather than using the default of `section`. These are the options:

```
yo clay:component --tag section
yo clay:component --tag article
yo clay:component --tag nav
yo clay:component --tag aside
yo clay:component --tag figure
yo clay:component --tag p
yo clay:component --tag div
```

### --viewports

In addition to the default `all.css` and `print.css`, you can specify viewports to be created.

```
yo clay:component --viewports m
yo clay:component --viewports mobile

# would create 0-600.css

yo clay:component --viewports t
yo clay:component --viewports tablet

# would create 600-1024.css

yo clay:component --viewports d
yo clay:component --viewports desktop

# would create 1024+.css
```

You can also specify arbitrary viewports by passing in a comma-separated string. For more details on the syntax, see [responsive-filenames](https://github.com/nymag/responsive-filenames#responsive-filenames).

```
yo clay:component --viewports 0-300,300-600,600+,1200+

# would create:

0-300.css
300-600.css
600+.css
1200+.css
```
