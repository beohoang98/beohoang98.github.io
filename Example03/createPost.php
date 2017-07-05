<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>CREATE POST</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?php
            $haveData = false;
            if ($_SERVER["REQUEST_METHOD"]==="POST") {
                $name = $_POST["name"];
                $club = $_POST["club"];
                $age = $_POST["age"];
                $numberKit = $_POST["numberKit"];
                $country = $_POST["country"];
                $haveData = ($name && $age && $club && $numberKit && $country);
            }
        ?>
        <div class="container">
            <form class="form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"])?>" method="post">
                <input type="text" name="name" placeholder="Name" required>
                <input type="text" name="club" placeholder="Club" required>
                <input type="number" name="age" placeholder="Age" value="20" required>
                <input type="number" name="numberKit" placeholder="Number Kit" value="10" required>
                <input type="text" name="country" placeholder="Country" required>
                <input type="submit" value="SEND">
            </form>
            <a href="index" id="return">RETURN</a>
        </div>
        <?php
            //append data to file
            if ($haveData) {
                $filename = 'data.txt';
                $f = fopen($filename, "a") or die("Unable to write to ".$filename);
                fputs($f, $name."\n");
                fputs($f, $club."\n");
                fputs($f, $age."\n");
                fputs($f, $numberKit."\n");
                fputs($f, $country."\n");
                fclose($f);
                echo "<script>window.open('index','_self')</script>";
            }
        ?>
    </body>
</html>
