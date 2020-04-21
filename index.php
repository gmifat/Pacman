<!Doctype html>
<html lang="fr-FR">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" type="text/css" href="assets/css/style.css"/>
        <script src="https://kit.fontawesome.com/2cf3ba0c41.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="./assets/css/game/style.css">
        <link rel="stylesheet" href="./assets/css/game/landscape.css">
        <link rel="stylesheet" href="./assets/css/game/portrait.css">
        <link rel="stylesheet" href="./assets/css/game/mobile.css">
        <title>Pac-Man JPO</title>
    </head>
    <body>
        <script>
            function showHidePassword()
            {
                let pwd = document.getElementById("password");
                if (pwd.type === "password") {
                    pwd.type = "text";
                } else {
                    pwd.type = "password";
                }
            }
        </script>
        <?php

            session_start();

            require_once ('helpers.php');

            if(isset($_GET['p'])):
                switch ($_GET['p']):
                    case 'account' :
                        require 'controllers/accountController.php';
                        break;

                    case 'game' :
                        require 'controllers/gameController.php';
                        break;

                    case 'ajax':
                        require 'controllers/ajaxController.php';
                        break;
                    default :
                        require 'controllers/indexController.php';
                endswitch;
            else:
                require 'controllers/indexController.php';
            endif;
        ?>
    </body>
</html>