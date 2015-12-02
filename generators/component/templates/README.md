<% if (isNPM) { %>
# <%= folderName %>
A component for [Clay](https://github.com/nymag/amphora/wiki#clay-is-divided-into-components).

## Install

```
npm install --save <%= folderName %>
```

Adds a <%= name %> component.

## Usage

Once you install it, it will be automatically recognized by `amphora`.

To include it, create an instance of it and add a reference to a component list.

<% } else { %>
# <%= folderName %>

A non-public component for [Clay](https://github.com/nymag/amphora/wiki#clay-is-divided-into-components).

## Usage

This component will be automatically recognized by `amphora`.

To include it, create an instance of it and add a reference to a component list.
<% } %>
