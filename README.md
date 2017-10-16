# Canvi - A simple vanilla JavaScript off-canvas navigation

[Official page](https://pineco.de/project/canvi-off-canvas-navigation/)

## Introduction, installation

Canvi is a simple off-canvas navigation with a few parameter to configure. You can init multiple instances, set responsive width, use your style our Canvi's style.

To install Canvi get the JS and the CSS file and insert into your project. You can also customize the Sass to save some byte.

```html
// To the head
<link rel="stylesheet" href="canvi.css">
// To the end of the body
<script src="canvi.js"></script>
```

## Basic Usage

To use Canvi first, you have to implement the correct HTML structure which is mean the proper use of the .canvi-navbar and .canvi-content.

```html
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

```js
var canvi = new Canvi();
```

## Multiple Instance

To make multiple instances, you must specify the correct value for the content, navbar and openButton property. Note that the content can be the same on multiple initializations.

```js
var canviLeft = new Canvi({
    content: '.js-canvi-content',
    navbar: '.js-canvi-navbar--left',
    openButton: '.js-canvi-open-button--left'
});

var canviRight = new Canvi({
    content: '.js-canvi-content',
    navbar: '.js-canvi-navbar--right',
    openButton: '.js-canvi-open-button--right'
});
```

## Accessibility

Canvi using aria-hidden="true" when the navigation is hidden. If you want to be more accesible you can use the inert attribute - which is also used by Canvi - but for this you need to use [this polyfill](https://github.com/WICG/inert) because it is quite a new feature. Just simply insert the script into your project.

If you like to know more about inert check out [A11ycats #2 episode](https://youtu.be/fGLp_gfMMGU)!


## Options

### content

**Type:** string

**Default:** '.canvi-content'

This selector defines the content part of the markup. Mostly you need to modify this when you use multiple Canvi.

### isDebug

**Type:** boolean

**Default:** false

Canvi's debugger switch.

### navbar

**Type:** string

**Default:** '.canvi-navbar'

Define the navbar part of the structure. This selector is part of the default markup. Mostly you need to modify it'value when you use multiple Canvi.

### speed

**Type:** string

**Default:** '0.3s'

You can specify here the opening/closing speed of the menu.

### openButton

**Type:** string

**Default:** '.canvi-open-button'

Canvi open button selector.

### position

**Type:** string

**Default:** 'left'

Specify the position of the navigation.

### pushContent

**Type:** boolean

**Default:** true

Set if you don't want the menu to push the content. In this case, it will lay over your page.

### width

**Type:** string

**Default:** '300px'

Set the width of the navbar. You must give string with the correct unit so you can specify any value type like **em**, **%**, **px**.

### responsiveWidths

**Type:** array

**Default:** []

With this option, you can modify the width of the navbar by breakpoints. This is a mobile first approach, and the very first width option will be width parameter's value.

## Methods

Canvi comes with a few method so you can open and close it manually from your code. To use these methods, you must save the Canvi instance in a variable at the declaration like to following:

```js
var canviRight = new Canvi({
    content: '.js-canvi-content',
    navbar: '.js-canvi-navbar--right',
    openButton: '.js-canvi-open-button--right',
    position: 'right',
    pushContent: true,
    width: '300px'
});
```

### open()

Open the Canvi instance.

```js
canviRight.open();
```

### close()

Close the Canvi instance.

```js
canviRight.close();
```

### toggle()

Toggle the Canvi instance.

```js
canviRight.toggle();
```

## Events

Canvi came with custom events which you can use to customize, modify Canvi or your site's specific parts. To catch an event all you have to do is to define an event listener to the body element.

Each event gives back three additional Canvi elements named by **navbar**, **openButton**, **content**. You can access them through the event object like e.detail.navbar.

### canvi.init

This event is triggered when Canvi initialization ready. To catch the initialization event, you have to watch the canvi.init event. **Note that you must declare the following code before the Canvi constructor.**

```js
document.querySelector('body').addEventListener('canvi.init', function(e) {
    console.log('Catch Canvi init event...');
});
```

### canvi.before-open

This event is triggered when you click on the menu open button. To catch the before-open event, you have to watch the canvi.before-open event.

```js
document.querySelector('body').addEventListener('canvi.before-open', function(e) {
    console.log('Catch Canvi before-open event...');
});
```

### canvi.after-open

This event is triggered after the menu opened. To catch the after-open event, you have to watch the canvi.after-open event.

```js
document.querySelector('body').addEventListener('canvi.after-open', function(e) {
    console.log('Catch Canvi after-open event...');
});
```

### canvi.before-close

This event is triggered before you close the menu. To catch the before-close event, you have to watch the canvi.before-close event.

```js
document.querySelector('body').addEventListener('canvi.before-close', function(e) {
    console.log('Catch Canvi before-close event...');
});
```

### canvi.after-close

This event is triggered after the menu closed. To catch the after-close event, you have to watch the canvi.after-close event.

```js
document.querySelector('body').addEventListener('canvi.after-close', function(e) {
    console.log('Catch Canvi after-close event...');
});
```
