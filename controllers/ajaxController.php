<?php
require_once ('../helpers.php');

if(isset($_GET['user_id']) && !empty($_GET['user_id'])){
    require '../models/Score.php';

    if(isset($_GET['action'])) {

        $data = array();

        switch ($_GET['action'])
        {
            case 'top_ten':
                $data['scores'] = GetTopScores();
                break;
            case 'add_score':

                if (isset($_GET['score']) && !empty($_GET['score'])) {
                    $data['add_score'] = AddScore($_GET['user_id'], intval($_GET['score']));
                }
                break;
        }

        // récupérer le score de l'utilisateur
        $data['best_score'] = GetUserMaxScore($_GET['user_id']);

        //returns data as JSON format
        echo json_encode($data);
    }
}