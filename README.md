Iframe Step
============

A iframe step control provides a widget for browsing among frames horizontally in an overloaded page region.

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
            <a href="iframe.php?offset=0">第 1 頁</a>
        </li>
        <li>
            <a href="iframe.php?offset=1">第 2 頁</a>
        </li>
        <li>
            <a href="iframe.php?offset=2">第 3 頁</a>
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
