<?php

    if (isset($_SESSION["username"]) && !empty($_SESSION["username"]))
    {
        $username = $_SESSION["username"];
        $user_id = $_SESSION["user_id"];
        $max_score = $_SESSION["max_score"];
        if ($max_score == null) {
            $max_score = "-";
        }
        include 'views/game.php';
    }
    else
    {
        header('Location:index.php?login');
        exit;
    }


