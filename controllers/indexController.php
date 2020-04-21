    <?php

    // afficher message votre compte bien créer avec succees
    $new_account = isset ($_GET['op']) && $_GET['op'] == 'success';


    if (isset($_POST['username']) && isset($_POST['password']))
    {
        if (!empty($_POST['username'])  && !empty($_POST['password']))
        {
            // On ajoute le model car on a besoin d'accéder à la BD et les données du user
            require 'models/User.php';
            $return = FindUser($_POST['username'], $_POST['password']);

            if ($return === false)
            {
                //
                $error_message = "Login ou mot de passe incorrect";
            }
            else
            {
                $_SESSION["username"] = $return["username"];
                $_SESSION["user_id"] = $return["id"];
                $_SESSION["max_score"]= $return['max_score'];
                header('Location:index.php?p=game');
                exit;
            }
        }
    } else if (isset($_GET['disconnect']))
    {
        // remove all session variables
        session_unset();

        // destroy the session
        session_destroy();
    } else if (isset($_SESSION["username"]) && !empty($_SESSION["username"]))
    {
        header('Location:index.php?p=game');
        exit;
    }


     include 'views/index.php';

