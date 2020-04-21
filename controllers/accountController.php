<?php

    if (isset($_POST['username']) && isset($_POST['email']) && isset($_POST['password']))
    {
        if (!empty($_POST['username']) && !empty($_POST['email']) && !empty($_POST['password']))
        {
            // insertion du compte dans la bd
            require 'models/User.php';
            $return = AddUser($_POST['username'], $_POST['email'], $_POST['password']);

            if ($return === true) {
                // redirection vers la page login avec message de succès
                header('Location:index.php?op=success');
                exit;
            }
            else
            {
                // affiche message d'erreur
                $error_message = $return;
            }
        }
    }
    // si l'utilisateur est déjà connecté
    else if (isset($_SESSION["username"]) && !empty($_SESSION["username"]))
    {
        header('Location:index.php?p=game');
        exit;
    }

    include 'views/account.php';
