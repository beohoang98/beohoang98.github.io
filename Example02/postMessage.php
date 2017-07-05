<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>POST DATA form HTML</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div class="person">
            <div class="info">
                <p class="name"><?php echo $_POST["name"];?></p>
                <p class="age"><?php echo $_POST["age"];?> age</p>
            </div>
        </div>
    </body>
</html>
