// Variables globales
const map = document.querySelector('.map');
const pause = document.querySelector('.pause');
const pauseImage = document.querySelector('img[id="pause-image"]');
const gameOver = document.querySelector('.game-over');
const gameOverScore = document.querySelector('.game-over-score');
const topTenStart = document.querySelector('.top-ten-start');
const topTenElement = document.querySelector('.top-ten');
const helpContent = document.querySelector('.help-content');
const numberOfLifeElement = document.querySelector('span[id="number-of-life"]');
const joystick = document.querySelector('.joystick');
const bestScore = document.querySelector('span[id="best-score"]');
const tableContainer = document.querySelector('.top-ten-table-score')

console.log('jeu lancé'); 
const maxSize = 1050;
const headerSize = 0.5;
const mqlMaxWidth = window.matchMedia(`(max-width: ${ maxSize }px)`);
const mqlMaxHeight = window.matchMedia(`(max-height: ${ maxSize }px)`);
const mqlOrientation = window.matchMedia('(orientation: portrait)');

// Permet de savoir si le jeu est chargé
let isGameLoaded = false;

// Permet de savoir si le jeu est en cours
let isGameInProgress = false;

// Permet de savoir si le jeu est en pause
let isGamePaused = false;

// Définit le niveau de jeu
let gameLevel = 1;

// Définit le nombre de vies restantes
let numberOfLife = 3;

/*****************************************/
/************ PACGOMMES *******************/
/*****************************************/
// Permet d'afficher les pacgommes
const displayDots = () =>
{
    const isPortrait = isPortraitOrientation();
    const isMax = !mqlMaxHeight.matches && !mqlMaxWidth.matches;
    for (let col = 0; col < 10; col++)
    {
        for (let row = 0; row < 10; row++)
        {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.dataset.top = row.toString();
            dot.dataset.left = col.toString();

            if (isPortrait === true)
            {
                let pos = calcPortraitPos(col, row, isMax);
                dot.style.left = pos.left;
                dot.style.top = pos.top;
            }
            else
            {
                let pos = calcLandscapePos(col, row, isMax);
                dot.style.left = pos.left;
                dot.style.top = pos.top;
            }

            map.insertBefore(dot, pacMan)
        }
    }

    // Mettre les pac-gommes magiques
    magicDot(0, 0);
    magicDot(0, 9);
    magicDot(9, 0);
    magicDot(9, 9);

    // Reste à faire disparaître les 10 pac-gommes superflues
    removeDot(3, 0);
    removeDot(3, 1);
    removeDot(3, 8);
    removeDot(3, 9);
    removeDot(4, 4);
    removeDot(4, 5);
    removeDot(5, 0);
    removeDot(5, 1);
    removeDot(5, 5);
    removeDot(5, 8);
    removeDot(5, 9);
};

const removeDot = (top, left) => {
    // Supprimer un pac-gomme du DOM en fonction de son top et de son left
    const dot = map.querySelector('div[data-top="'.concat(top, '"][data-left="',left,'"]'));
    map.removeChild(dot);
};

const magicDot  = (top, left) => {
    // cherche un pac-gomme du DOM en fonction de son top et de son left
    const dot = map.querySelector('div[data-top="'.concat(top, '"][data-left="',left,'"]'));
    dot.className = 'magicDot';
};

/*****************************************/
/************ GAME OVER *******************/
/*****************************************/

// Permet de voir si PAC-MAN et un fantomes sont dans la même position
const isGameOver = () => 
{
    // Si le super pouvoir est activé
    if (isSuperPowerActivated === true)
    {
        tryEatGhosts();
        return false;
    }


    const pacManPos = getPositionOf(pacMan);
    const redGhostPos = getPositionOf(redGhost);
    const yellowGhostPos = getPositionOf(yellowGhost);
    const pinkGhostPos = getPositionOf(pinkGhost);

    // Si la position de Pac-Man coïncide avec celle d’un fantôme
    if (isInTheSamePos(pacManPos, redGhostPos) || isInTheSamePos(pacManPos, pinkGhostPos) || isInTheSamePos(pacManPos, yellowGhostPos))
    {
        // Le jeu n'est plus en cours
        isGameInProgress = false;
        numberOfLife --;
        numberOfLifeElement.textContent = '' + numberOfLife;
        // Si le joueur n'a plus de vie
        if (numberOfLife === 0)
        {
            // On affiche le fin de jeu + score
            gameOver.style.display = 'block';
            gameOverScore.textContent = '' + score;
            topTenStart.style.display = 'none';
            // On arrête les fantômes et Pac-man
            stopRedGhost();
            stopPinkGhost();
            stopYellowGhost();
            stopPacMan();
            // Envoyer le score du joueur à la base de donnée
            window.fetch(`controllers/ajaxController.php?action=add_score&user_id=${user_id}&score=${score}`).then(
                result => {
                    return result.json()
                }
            ).then(
                json => {
                    console.log(json);
                    let score_data = json;
                    // ré afficher son meilleur score
                    bestScore.innerHTML = score_data.best_score;
                }
            ).catch(
                error => console.log(error)
            );

            // afficher le classement des joueurs
            // pseudo - score
            showTopTenScores();
        }
        else
        {
            // si le joueur a encore de vie, on continue à jouer
            // en initialisant les positions
            restartRedGhost();
            restartPinkGhost();
            restartYellowGhost();
            prepareForNextRound();
            // Démarrer le jeu
            start();
        }

        return true;
    }

    return false;
};


// Démarrer un nouveau jeu après la fin du jeu en cours
const restartGame = () =>
{
    numberOfLife = 3;
    numberOfLifeElement.textContent = '' + numberOfLife;
    restartPacMan();
    restartRedGhost();
    restartPinkGhost();
    restartYellowGhost();


    if (!NodeList.prototype.forEach && Array.prototype.forEach)
    {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    // On supprime les points en place
    map.querySelectorAll('.dot').forEach(dot => map.removeChild(dot));
    map.querySelectorAll('.magicDot').forEach(magicDot => map.removeChild(magicDot));

    isGameLoaded = false;
    start();
};

/*****************************************/
/************ PAUSE *******************/
/*****************************************/
const pauseOrResumeGame = () =>
{
    // si le jeu n'est pas en cours ne pas faire de pause
    if (isGameInProgress === false)
    {
        return;
    }

    // On inverse l'état de jeu
    isGamePaused = !isGamePaused;
    if (isGamePaused)
    {
        // afficher le panneau pause
        pause.style.visibility = "visible";
        pauseImage.setAttribute('src', './assets/img/game/play.png');

        // arrêter les fantômes
        stopRedGhost();
        stopPinkGhost();
        stopYellowGhost();

        // mettre pac-man en pause
        pausePacMan();
    }
    else
    {
        // cacher le panneau pause
        pause.style.visibility = "hidden";
        pauseImage.setAttribute('src', './assets/img/game/pause.png');
        // reprendre le jeu
        resumePacMan();
        if (isSuperPowerActivated === false)
        {
            // faire bouger les fantômes uniquement si on est en mode normal
            moveGhosts(gameLevel);
        }
    }
};

/*****************************************/
/******** DÉPLACEMENT FANTÔMES ***********/
/*****************************************/
let actualSpeed = 900;
const moveGhosts = (gameLevel) =>
{
    switch (gameLevel)
    {
        // tous aléatoires
        case 1:
            moveRedGhost(500);
            movePinkGhost(500);
            moveYellowGhost(500);
            break;
        // 1 suit pac-man et 2 aléatoires
        case 2:
            moveRedGhostToPacMan(1000);
            movePinkGhost(500);
            moveYellowGhost(500);
            break;
        // 2 suivent pac-man et 1 aléatoire
        case 3:
            moveRedGhostToPacMan(1000);
            movePinkGhostToPacMan(1000);
            moveYellowGhost(500);
            break;
        // les 3 suivent pac-man
        case 4:
            moveRedGhostToPacMan(1000);
            movePinkGhostToPacMan(1000);
            moveYellowGhostToPacMan(1000);
            break;
        default:
			// vitesse et nombre de fantômes selon niveau
			// LVL					   	(gameLevel + 1) % 3
			// 5 	1 rapide 	2 lents 0
			// 6 	2 rapides 	1 lent	1
			// 7 	3 rapides 	0 lent	2
			// 8 	1 rapide 	2 lents 0
			// 9 	2 rapides 	1 lent	1
			// 10 	3 rapides 	0 lent	2
			let rest = gameLevel % 3;
			if (rest === 2)
			{
				moveRedGhostToPacMan(actualSpeed);
				movePinkGhostToPacMan(actualSpeed + 100);
				moveYellowGhostToPacMan(actualSpeed + 100);
			}
			else if (rest === 0)
			{
				moveRedGhostToPacMan(actualSpeed);
				movePinkGhostToPacMan(actualSpeed);
				moveYellowGhostToPacMan(actualSpeed + 100);
			}
			else
            {
				moveRedGhostToPacMan(actualSpeed);
				movePinkGhostToPacMan(actualSpeed);
				moveYellowGhostToPacMan(actualSpeed);
                if (actualSpeed > 100)
                {
                    actualSpeed -= 100;
                }
                else
                {
                    actualSpeed = 50;
                }
			}
				
            break;
    }
};

/*****************************************/
/************* ÉVÈNEMENTS ****************/
/*****************************************/

// évènement de gestion des touches de clavier
addEventListener('keydown', e =>
{
    // Si le tableau des scores est affiché ou le jeu n'est pas en cours ou
    // le jeu en pause en n'accepte que l'espace
    if (topTenElement.style.visibility === 'visible' ||  helpContent.style.visibility === 'visible'  || isGameInProgress === false || (isGamePaused === true && e.keyCode !== 32))
    {
        return;
    }

    switch (e.keyCode)
    {
        case 37:
            movePacMan('toLeft');
            break;
        case 39:
            movePacMan('toRight');
            break;
        case 38:
            movePacMan('toTop');
            break;
        case 40:
            movePacMan('toBottom');
            break;
        case 32:
            pauseOrResumeGame();
            break;
    }
});

// Si l'orientation de l'écran change, on recalcule les positions des pac-gommes
mqlOrientation.addEventListener("change", (event) =>
{
    const isMax = !mqlMaxHeight.matches && !mqlMaxWidth.matches;
    const dots = map.querySelectorAll('.dot, .magicDot');

    // si l'affichage est portrait
    if(event.matches)
    {
        for (let i = 0; i < dots.length; ++i)
        {
            calcPortraitPosElement(dots[i], isMax);
        }

        calcPortraitPosElement(pacMan, isMax);
    }
    else
    {
        for (let i = 0; i < dots.length; ++i)
        {
            calcLandscapePosElement(dots[i], isMax);
        }

        calcLandscapePosElement(pacMan, isMax);
    }
});

mqlMaxWidth.addEventListener("change", (event) =>{
    const isMax = !mqlMaxHeight.matches && !mqlMaxWidth.matches;
});

mqlMaxHeight.addEventListener("change", (event) =>{
    const isMax = !mqlMaxHeight.matches && !mqlMaxWidth.matches;
});

// Joystick de mobile
joystick.addEventListener("click",(event) =>{
    let xPosition = event.clientX - joystick.offsetLeft;
    let yPosition = event.clientY- joystick.offsetTop;
    let direction;

    if (xPosition >= yPosition) {
        if (xPosition <= 80 - yPosition) {
            direction = 'toTop';
        }
        else {
            direction = 'toRight';
        }
    }
    else {
        if (xPosition <= 80 - yPosition) {
            direction = 'toLeft';
        }
        else {
            direction = 'toBottom';
        }
    }

    movePacMan(direction);
});

/*****************************************/
/******** Démarrage de jeu ***********/
/*****************************************/

const start = () =>
{
    if (isGameLoaded === false) {
        displayDots();
    }
    pacMan.className = "";
    movePacMan('toRight');
    moveGhosts(gameLevel);
    isGameLoaded = true;
    isGameInProgress = true;
};

// Afficher les meilleurs score
let gameStateBeforeShowTopTen = false;
const showTopTenScores = () =>
{
    topTenElement.style.visibility = 'visible';

    // On garde l'état de jeu avant affichage top ten
    gameStateBeforeShowTopTen = isGamePaused;
    // si le jeu n'est pas en pause, on l'arrête
    if (isGamePaused === false)
    {
        pauseOrResumeGame();
    }

    // Cacher la joystick et les boutons pauses/play
    joystick.style.display = 'none';
    pauseImage.style.display = 'none';

    // récupérer les informations à partir de la base de données
    const tableStart = '<table><caption><span>Tableau des scores</span></caption><thead><tr><th scope="col">N°</th><th scope="col">Pseudo</th><th scope="col">Score</th></tr></thead><tbody>';
    const tableEnd = '</tbody></table>';
    tableContainer.innerHTML = tableStart + '<tr><td colspan="3"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></td></tr>' + tableEnd;
    let tableContent = '<tr><td colspan="3">PAS DE SCORE</td></tr>'
    window.fetch(`controllers/ajaxController.php?action=top_ten&user_id=${user_id}`).then(
        result =>
        {
            return result.json()
        }
    ).then(
        json =>
        {
            let score_data = json;
            bestScore.innerHTML = score_data.best_score;
            tableContent = '';

            const scoresList = score_data.scores.map(score =>
            {
                tableContent += `<tr><th scope="row">${score.rank}</th><td>${score.username}</td><td>${score.value}</td></tr>`;
            });

            tableContainer.innerHTML = tableStart + tableContent + tableEnd;
        }
    ).catch(
        error => console.log(error)
    );

    // afficher le résultat
    tableContainer.innerHTML = tableStart + tableContent + tableEnd;
};

// Suite à la fermeture du tableau des scores
const closeTopTenScore = () =>
{
    // cacher le tableau et afficher le bouton pause play
    topTenElement.style.visibility = 'hidden';
    pauseImage.style.display = 'block';
    helpContent.style.visibility = 'hidden';

    // si on est en mobile on affiche le joystick
    if (window.matchMedia('(min-width: 481px) and (max-width: 767px), (min-width: 320px) and (max-width: 480px)').matches === true)
    {
        joystick.style.display = 'block';
    }

    // Si c'est la première fois on charge le jeu
    if (isGameLoaded === false)
    {
        start();
    }
    // affichage suite à un game over
    else if (isGameInProgress === false)
    {
        gameOver.style.display = 'none';
        topTenStart.style.display = 'block';
        restartGame();
    }
    else
    {
        if (gameStateBeforeShowTopTen === false)
        {
            // resume game, l'utilisateur à cliquer sur le lien en cours de jeu
            pauseOrResumeGame();
        }
    }
};

// Affichage du tableau des scores
showTopTenScores();

const displayHelp = () =>
{
    helpContent.style.visibility = 'visible';

    // On garde l'état de jeu avant affichage top ten
     gameStateBeforeShowTopTen = isGamePaused;
    // si le jeu n'est pas en pause, on l'arrête
     if (isGamePaused === false)
     {
        pauseOrResumeGame();
     }

    // Cacher la joystick et les boutons pauses/play
    joystick.style.display = 'none';
    pauseImage.style.display = 'none';


};

const closeHelp = () =>
{
    helpContent.style.visibility = 'hidden';

    if (isGameLoaded === true)
    {
        pauseImage.style.display = 'block';

        // si on est en mobile on affiche le joystick
        if (window.matchMedia('(min-width: 481px) and (max-width: 767px), (min-width: 320px) and (max-width: 480px)').matches === true)
        {
            joystick.style.display = 'block';
        }

        if (gameStateBeforeShowTopTen === false)
        {
            // resume game, l'utilisateur à cliquer sur le lien en cours de jeu
            pauseOrResumeGame();
        }
    }
};