<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>SHOW POST</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <?php
            $name = array();
            $club = array();
            $age = array();
            $numberKit = array();
            $country = array();

            $filename = "data.txt";
            $f = fopen($filename, "r") or die("Unable to read ".$filename);
            while (!feof($f)) {
                array_push($name, fgets($f));
                array_push($club, fgets($f));
                array_push($age, fgets($f));
                array_push($numberKit, fgets($f));
                array_push($country, fgets($f));
            }
            fclose($f);
        ?>
        <div class="container">
            <table class="table">
                <tr>
                    <th>NAME</th>
                    <th>CLUB</th>
                    <th>AGE</th>
                    <th>NUMBER KIT</th>
                    <th>COUNTRY</th>
                </tr>
                <?php
                    $num = count($name);
                    echo "<p>$num</p>";
                    for ($i = 0; $i < $num; $i++) {
                        echo "<tr>";
                            echo "<td>".$name[$i]."</td>";
                            echo "<td>".$club[$i]."</td>";
                            echo "<td>".$age[$i]."</td>";
                            echo "<td>".$numberKit[$i]."</td>";
                            echo "<td>".$country[$i]."</td>";
                        echo "</tr>";
                    }
                ?>
            </table>
            <a href="index" id="return">RETURN</a>
        </div>
    </body>
</html>
