Iframe Step
============

A iframe step control provides a widget for browsing among frames horizontally in an overloaded page region.

[API Documentation](http://josephj.github.com/iframe-step/)

## Dependencies

```html
<link rel="stylesheet" href="assets/iframe-step.css">
<script src="http://yui.yahooapis.com/3.8.1/build/yui/yui-min.js"></script>
<script src="iframe-step.js"></script>
```

## HTML Markup

```html
<div id="foo">
    <ul>
        <li>
            <a href="iframe.php?offset=0">Page 1</a>
        </li>
        <li>
            <a href="iframe.php?offset=1">Page 2</a>
        </li>
        <li>
            <a href="iframe.php?offset=2">Page 3</a>
        </li>
    </ul>
</div>
```

## JavaScript


```js
YUI().use("iframe-step", function (Y) {

    new Y.IframeStep({
        srcNode: "#foo"
    }).render();

});
```
