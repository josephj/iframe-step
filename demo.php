<?php
$total = rand(5, 15);
//$offset = rand(0, $total - 1);
$offset = 0;
?><!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Iframe Step - Prototype</title>
<link rel="stylesheet" href="http://yui.yahooapis.com/3.8.1/build/cssreset/reset-min.css">
<link rel="stylesheet" href="http://yui.yahooapis.com/3.8.1/build/cssfonts/fonts-min.css">
<link rel="stylesheet" href="http://yui.yahooapis.com/3.8.1/build/cssbutton/cssbutton.css">
<link ref="stylesheet" href="http://a.mimgs.com/lib/mui/cssbutton/assets/skins/miiicasa/cssbutton-skin.css">
<link rel="stylesheet" href="assets/iframe-step.css">
<link rel="stylesheet" href="assets/skins/miiicasa/iframe-step.css">
<script src="http://yui.yahooapis.com/3.8.1/build/yui/yui-min.js"></script>
<script src="iframe-step.js"></script>
<style>
body {
    padding: 10px;
}
form {
    margin-bottom: 20px;
}
form input#offset {
    text-align: center;
    width: 30px;
}
#foo {
    background: #fff;
    border: solid 4px #ccc;
    border-radius: 10px;
    padding: 20px 20px 10px;
    text-align: center;
    width: 500px;
}
#foo ul {
    margin-bottom: 20px;
}
#foo iframe {
    border: none;
    width: 100%;
}
</style>
<script type="text/javascript">
YUI().use("iframe-step", function (Y) {

    var iframeStep,
        formNode;

    formNode = Y.one("form");
    iframeStep = new Y.IframeStep({
        srcNode: "#foo",
        on: {
            offsetChange: function (e) {
                formNode.one("input[name=offset]").set("value", e.newVal);
            },
            end: function (e) {
                alert("end!");
            }
        }
    }).render();

    formNode.on("submit", function (e) {
        e.preventDefault();
        var offset = formNode.one("input[name=offset]").get("value");
        iframeStep.move(parseInt(offset));
    });

});
</script>
</head>
<body class="yui3-skin-miiicasa">

    <form>
        <label for="offset">offset:</label>
        <input type="text" name="offset" value="<?php echo $offset; ?>" id="offset"> / <span class="total"><?php echo $total - 1; ?></span>
        <input type="submit" value="Set" class="yui3-button">
    </form>

    <div id="foo">
        <ul>
<?php for ($i = 0, $j = $total; $i < $j; $i++):
          $class = ($i === $offset) ? ' class="yui3-iframestep-selected"': "";
?>
            <li<?php echo $class; ?>>
                <a href="iframe.php?offset=<?php echo $i; ?>">第 <?php echo $i + 1; ?> 頁</a>
            </li>
<?php endfor; ?>
        </ul>
    </div>

</body>
</html>
