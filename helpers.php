<?php

    function dbConnect()
    {
        try
        {
            $db = new PDO('mysql:host=localhost;dbname=Pacman;charset=utf8', 'root', '', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        }
        catch (Exception $exception) //$exception contiendra les éventuels messages d’erreur
        {
            die( 'Erreur : ' . $exception->getMessage() );
        }

        return $db;
    }

//la fonction die arrête le script et peut afficher un message
//le catch n’est appelé que si une erreur survient au try
