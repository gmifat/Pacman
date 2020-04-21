<?php

    function GetUserMaxScore($user_id)
    {
        try
        {
            $db = dbConnect();
            $sth = $db->prepare("SELECT MAX(value) FROM scores WHERE id_user = :id");
            if ($sth->execute([':id' => $user_id])) {

                $result = $sth->fetchColumn();
                return $result;
            }

            return '-';
        }
        catch (Exception $e)
        {
            return '-';
        }
    }

    function GetTopScores()
    {
        try
        {
            $db = dbConnect();
            $sth = $db->prepare("SELECT users.username, scores.value FROM scores JOIN users on scores.id_user = users.id ORDER BY value DESC LIMIT 10");
            if ($sth->execute())
            {
                $result = $sth->fetchAll();
                $count = $sth->rowCount();
                for ($i = 1; $i <= $count; $i++)
                {
                    $result[$i - 1]['rank'] = $i;
                }

                return $result;
            }

            return false;
        }
        catch (Exception $e)
        {
            return false;
        }
    }

    function AddScore($user_id, $score)
    {
        try
        {
            $db = dbConnect();
            $sth = $db->prepare("INSERT INTO scores(id_user, value) VALUES(:id_user, :value)");
            if ($sth->execute([
                ':id_user' => $user_id,
                ':value' => $score
            ]))
            {
                return true;
            }

            return false;
        }
        catch (Exception $e)
        {
            return false;
        }
    }
