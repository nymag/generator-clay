# <%= folderName %>
A component for [Clay](https://github.com/nymag/amphora/wiki#clay-is-divided-into-components).

## Description
<%= description %>

<% if (isNPM) { %>
## Install

```
npm install --save <%= folderName %>
```

Adds a <%= name %> component.
<% } %>

## Usage
<% if (isNPM) { %>
Once you install it, it will be automatically recognized by `amphora`.
<% } else { %>
This component will be automatically recognized by `amphora`.
<% } %>

To include it, create an instance of it and add a reference to a component list.
