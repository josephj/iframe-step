<?php
sleep(rand(0, 3));
$offset = intval($_GET["offset"]);
?><!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Iframe Step - Prototype</title>
<style>
em {
    font-style: normal;
    color: red;
}
</style>
<body>
    <p>目前的 offset 為 <em><?php echo $offset; ?></em></p>
</body>
</html>
