# Canvi - A simple vanilla JavaScript off-canvas navigation

[Official page](https://pineco.de/project/canvi-off-canvas-navigation/)

## Introduction, installation

Canvi is a simple off-canvas navigation with a few parameter to configure. You can init multiple instances, set responsive width, use your style our Canvi's style.

To install Canvi get the JS and the CSS file and insert into your project. You can also customize the Sass to save some byte.

```
// To the head
<link rel="stylesheet" href="canvi.css">
// To the end of the body
<script src="canvi.js"></script>
```

## Basic Usage

To use Canvi first, you have to implement the correct HTML structure which is mean the proper use of the <span class="code-inline">.canvi-navbar</span> and <span class="code-inline">.canvi-content</span>.

```
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
    <div class="canvi-navbar"></div>
    <div class="canvi-content"></div>
</body>
</html>
```

After this you need to call the Canvi constructor and viola you are done!

```
var canvi = new Canvi();
```