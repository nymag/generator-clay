# generator-clay
A Yeoman generator for Clay

[![Circle CI](https://circleci.com/gh/nymag/generator-clay.svg?style=svg&circle-token=a4c35eb0cccf099844c822d0ac36e8495bd2d1d5)](https://circleci.com/gh/nymag/generator-clay)

## Clay Instance Generator
You can use the main generator to generate an new clay **instance**.

```
yo clay
```

This will add the following files:

* `app.js`
* `package.json`
* `.gitignore`
* `.csscomb.json`
* `.eslintrc`

## Component Generator

You can use the component generator to generate new **components** in your clay repo.

```
yo clay:component <name>
```

This will create a folder in `components/` with the name of your component, and will also add some files:

* `all.css`
* `print.css` (with `display: none` by default)
* `template.<lang>` where `<lang>` is the language of your choice
* `bootstrap.yml`
* `schema.yml`

If you select nunjucks or jade, the template will have a tag (if specified), a class with your component's name, and the `data-uri` attribute used by kiln.

The bootstrap and schema will have fields (text by default) that you've specified.

_Note: Your template language choice will be stored as the default the next time you run this generator, saving you time when creating multiple components._

### --tag

You can pass a `--tag` argument with the name of the tag/element you want to use, rather than using the default of `section`. The acceptable tags are defined in the [tags json](https://github.com/nymag/generator-clay/blob/master/generators/component/tags.json).

```
yo clay:component <name> --tag <tag>
```

### --viewports

In addition to the default `all.css` and `print.css`, you can specify viewports to be created.

```
yo clay:component <name> --viewports <m or mobile>

# would create 0-600.css

yo clay:component <name> --viewports <t or tablet>

# would create 600-1024.css

yo clay:component <name> --viewports <d or desktop>

# would create 1024+.css
```

You can also specify arbitrary viewports by passing in a comma-separated string. For more details on the syntax, see [responsive-filenames](https://github.com/nymag/responsive-filenames#responsive-filenames).

```
yo clay:component <name> --viewports 0-300,300-600,600+,1200+

# would create:

0-300.css
300-600.css
600+.css
1200+.css
```

### --npm

This is useful if you want to quickly scaffold components for release on npm. Their name gets prepended with `clay-`, and they additionally get a `package.json`, `README.md`, and `.eslintrc`. All options and prompts for internal components are available for npm components.

```
yo clay:component <name> --npm
```

Note: It will create a `clay-<name>` folder in the current directory, rather than a `components/<name>` folder.

## Site Generator

You can use the site generator to generate new sites in your clay repo.

```
yo clay:site <name>
```

It will prompt you for the human-readable name, domain, and path. It'll add these files:

* `index.js` with a default route
* `config.yml` with your site config
* `local.yml` pointing to localhost. This allows you to develop quickly and easily
