<?php

    function AddUser($username, $email, $password)
    {
        $db = dbConnect();
        $query = $db->prepare("SELECT COUNT(*) as NbUsers from users WHERE username = :username");

        //address ou username déja utilisé
        if ($query->execute([':username' => $username]))
        {
            $count = $query->fetch();
            $query->closeCursor();
            if ($count['NbUsers'] > 0)
            {
                return "Username existant";
            }
        }
        else
        {
            return "une erreur est survenue veuillez réessayer ultérieurement";
        }

        $query = $db->prepare("SELECT COUNT(*) as NbUsers from users WHERE email = :email");
        if ($query->execute([':email' => $email]))
        {
            $count = $query->fetch();
            $query->closeCursor();
            if ($count['NbUsers'] > 0)
            {
                return "Email existant";
            }
        }
        else
        {
            return "une erreur est survenue veuillez réessayer ultérieurement";
        }

        // sinon ajouter l'utilisateur
        $query = $db->prepare("INSERT INTO users (username, email, password) VALUES(:username, :email, :password) ");
        if($query->execute([
            ':username' => $username,
            ':email' => $email,
            ':password' => password_hash($password, PASSWORD_BCRYPT)
        ]))
        {
            return true;
        }

        return "une erreur est survenue veuillez réessayer ultérieurement";

    }

    //vérifier existance utilisateur et son mot de passe
    function FindUser($username, $password)
    {
        $db = dbConnect();
        $query = $db->prepare("SELECT id, username, email, dateCreate, password from users WHERE   username = :username ");
        if($query->execute([
            ':username' => $username
        ])) {

            $result = $query->fetch();

            if ($result === false)
            {
                return false;
            }

            if (password_verify($password, $result['password']))
            {
                // si l'utilisateur est connu, on récupère son max score s'il y on a
                $sth = $db->prepare("SELECT MAX(value) FROM scores WHERE id_user = :id");
                $sth->execute([':id' => $result['id']]);
                $result['max_score'] = $sth->fetchColumn();
                return $result;
            }
        }

        return false;

    }
