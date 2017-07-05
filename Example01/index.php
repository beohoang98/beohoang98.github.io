<!DOCTYPE html>
<html>
    <head>
        <title>Example PHP 1</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>WONDERS OF THE WORLD</h1>
        <div class="post-container"><?php
            $post1 = array(array("Ha Long Bay","img/halongbay.jpg","Vietnam"),
                        array("The Great Wall","img/thegreatwall.jpg","China"),
                        array("Pyramid of Giza","img/pyramid.jpg","Egypt"));
            $post2 = array(array("Lionel Messi","img/messi.jpg","Argentina"),
                        array("Johan Cruyff","img/cruyff.jpg","Football"));
            /*creat func*/
            function printPost($post) {
                echo '<div class="post">';

                echo '<img src="' . $post[1] . '"/>';
                echo "<div class=\"title\">";
                    echo '<h3>' . $post[0] . "</h3>";
                    echo "<p>" . $post[2] . "</p>";
                echo "</div>";

                echo "</div>";
            }
            /*creat post*/
            echo "<div class=\"col\">";
                foreach($post1 as $post) {
                    printPost($post);
                }
            echo "</div>";
            echo "<div class=\"col\">";
                foreach($post2 as $post) {
                    printPost($post);
                }
            echo "</div>";
        ?></div>
    </body>
</html>
