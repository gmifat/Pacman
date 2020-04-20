const invalidFruitsPositions = [
    // les 10 pac-gommes superflues
    {top:3, left:0},{top:3, left:1},{top:3, left:8},{top:3, left:9},
    {top:4, left:4},{top:4, left:5},
    {top:5, left:0},{top:5, left:1},{top:5, left:8},{top:5, left:9}
    ];

const pacMan = document.querySelector('img[id="pac-man"]');
const blueGhostImage = './assets/img/game/blue-ghost.png';
const gameLevelElement = document.querySelector('span[id="level"]');
const scoreElement = document.querySelector('span[id="score"]');
const superPowerDelay = 10000;
const bonusFruitDelay = 10000;
let pacManInterval;

// super pouvoir après avoir mangé un magic dot
let isSuperPowerActivated = false;
let superPowerTimeout;
let superPowerStartTime;
// permet de gérer le temps restant si l'utilisateur fait pause
let superPowerRemainingTime = superPowerDelay;

let isBonusFruitActivated = false;
let bonusFruitTimeout;
let bonusFruitStartTime;
// permet de gérer le temps restant si l'utilisateur fait pause
let bonusFruitRemainingTime = bonusFruitDelay;

let score = 0;

const numberOfDots = 89;
let   numberOfEatenDots = 0;

const movePacMan = (to) =>
{
    // Si pacMan essaye de continuer dans la même direction ne rien faire.
    if (pacMan.className === to )
    {
        return;
    }

    // Si pacMan essaye de changer de direction vers un endroit bloqué ne rien faire
    let pacManPosition = getPositionOf(pacMan);
    if (isTheCharacterBlocked(pacManPosition, to))
    {
        return;
    }
    // arrêter le déplacement en cours
    clearInterval(pacManInterval);

    // activer le déplacement dans la nouvelle direction
    pacManInterval = setInterval(pacManFunctionInterval, 250, to);

    // changer la direction de pacMan immédiatement pour plus de fluidité de jeu
    pacManFunctionInterval(to);
};

// la fonction periodique de déplacement de pac-man
const pacManFunctionInterval = (to) => {

    // on teste à chaque déplacement si la position de pac-man coincide un fantôme
    if (isGameOver() === true) {
        return;
    }

    let pacManPosition = getPositionOf(pacMan);

    if (!isTheCharacterBlocked(pacManPosition, to))
    {
        pacMan.className = to;
        move(pacMan, pacManPosition, to);
        tryEatObjects(pacMan.dataset.top, pacMan.dataset.left)
    }
};

// voir s'il y a un objet dans la position de pac-man et le supprimer en ajoutant du score
const tryEatObjects = (top, left) =>
{
    // Supprimer un dot du DOM en fonction de son top et de son left
    const obj = map.querySelector('div[data-top="'.concat(top, '"][data-left="',left,'"]'));
    if (obj !== null)
    {

        switch (obj.className)
        {
            case 'dot':
                score++;
                numberOfEatenDots ++;
                // si pac-man a mangé tous les pac-gommes
                if (numberOfEatenDots === numberOfDots)
                {
                    scoreElement.textContent = '' + score;
                    map.removeChild(obj);
                    // on  reinit le nombre de pac-gomme
                    numberOfEatenDots = 0;
                    // on passe au level suivant
                    gameLevel++;
                    gameLevelElement.textContent = '' + gameLevel;

                    // on redémarre le jeu
                    isGameLoaded = false;
                    isGameInProgress = false;
                    restartRedGhost();
					restartPinkGhost();
					restartYellowGhost();
                    prepareForNextRound();
                    start();
                    return;
                }

                if (numberOfEatenDots === 65)
                {
                    // On affiche un fruit si le joueur a réussi à manger 65 pac-gommes
                    displayFruit();
                }
                break;

            case 'magicDot':
                numberOfEatenDots ++;
                if (numberOfEatenDots === numberOfDots)
                {
                    scoreElement.textContent = '' + score;
                    map.removeChild(obj);
                    numberOfEatenDots = 0;
                    gameLevel++;
                    gameLevelElement.textContent = '' + gameLevel;
                    isGameLoaded = false;
                    isGameInProgress = false;
                    restartRedGhost();
					restartPinkGhost();
					restartYellowGhost();
                    prepareForNextRound();
                    start();
                    return;
                }

                if (numberOfEatenDots === 65)
                {
                    displayFruit();
                }
                activateMagicDot();
                break;

            case 'fruit':
                score += Number(obj.dataset.score);
                break;

            default:
                break;

        }

        scoreElement.textContent = '' + score;
        map.removeChild(obj);
    }
};

// Pemret d'activer le super pouvoir
const activateMagicDot = (timeout = superPowerDelay) =>
{
    // S'il y a un encore, on l'arrête
    clearTimeout(superPowerTimeout);
    isSuperPowerActivated = true;
    // Permet de sauvegarder le moment de démarrage de super pouvoir : permet de gérer pause et resume
    superPowerStartTime = Date.now();
    superPowerRemainingTime = timeout;

    // les fantômes s'enfuient de pac-man à vitesse réduite
    moveRedGhostAwayFromPacMan(1000, timeout);
    movePinkGhostAwayFromPacMan(1000, timeout);
    moveYellowGhostAwayFromPacMan(1000, timeout);

    // configurer un timeout de 10 secondes après le quel on  remet le jeu dans son état d'origine
    superPowerTimeout = setTimeout(() =>
    {
        isSuperPowerActivated = false;
        superPowerStartTime = null;
        superPowerRemainingTime = superPowerDelay;
        // on arrête les fantômes
        stopRedGhost();
        stopPinkGhost();
        stopYellowGhost();

        // on les relance selon le niveau de jeu
        moveGhosts(gameLevel);
    }, timeout)
};

// Pause pac-man et ses options
const pausePacMan = () => {
    // si le super pouvoir est activé, on sauvegarde le temps restant dans la variable superPowerRemainingTime
    if (isSuperPowerActivated === true)
    {
        let diff = Date.now() - superPowerStartTime;
        superPowerRemainingTime = superPowerRemainingTime - diff;
    }

    // pareil pour le bonus fruité
    if (isBonusFruitActivated === true)
    {
        let diff = Date.now() - bonusFruitStartTime;
        bonusFruitRemainingTime = bonusFruitRemainingTime - diff;
    }

    // on arrête tout
    clearInterval(pacManInterval);
    clearTimeout(superPowerTimeout);
    clearTimeout(bonusFruitTimeout);
};

// Permet de relancer pac-man et ses options
const resumePacMan = () => {
    pacManInterval = setInterval(pacManFunctionInterval, 250, pacMan.className);

    // si le super pouvoir est activé on le relance avec le temp restant
    if (isSuperPowerActivated === true)
    {
        activateMagicDot(superPowerRemainingTime);
    }

    // si le bonus fruit est activé on le relance avec le temp restant
    if (isBonusFruitActivated === true)
    {
        bonusFruitStartTime = Date.now();
        bonusFruitTimeout = setTimeout(bonusFruitTimeoutHandler, bonusFruitRemainingTime);
    }
};

// Permet d'arrêter pac-man et ses options
const stopPacMan = () =>
{
    clearInterval(pacManInterval);

    clearTimeout(superPowerTimeout);
    isSuperPowerActivated = false;
    superPowerStartTime = null;
    superPowerRemainingTime = superPowerDelay;
    
    clearTimeout(bonusFruitTimeout);
    isBonusFruitActivated = false;
    bonusFruitStartTime = null;
    bonusFruitRemainingTime = bonusFruitDelay;
};

// Permet de préparer le jeu pour la vie suivante
const prepareForNextRound = () =>
{
    stopPacMan();
    
    // supprimer le fruit s'il y on a
    let fruit = map.querySelector('.fruit');
    if (fruit)
    {
        map.removeChild(fruit);
    }

    setCharacterPosition(pacMan, {top:5, left:5});
};

// relancer le jeu après game over
const restartPacMan = () =>
{
    numberOfEatenDots = 0;
    score = 0;
    scoreElement.textContent = '' + score;
    gameLevel = 1;
    gameLevelElement.textContent = '' + gameLevel;
    
    // supprimer le fruit s'il y on a
    let fruit = map.querySelector('.fruit');
    if (fruit)
    {
        map.removeChild(fruit);
    }

    setCharacterPosition(pacMan, {top:5, left:5});
};

// Permet de manger les fantômes si le super pouvoir est activé
const tryEatGhosts = () =>
{
    const pacManPos = getPositionOf(pacMan);

    tryEatRedGhost(pacManPos);
    tryEatPinkGhost(pacManPos);
    tryEatYellowGhost(pacManPos);
};

// Afficher un fruit dans un endroit aléatoire disponible
const displayFruit = (timeout = bonusFruitDelay) =>
{
    clearTimeout(bonusFruitTimeout);
    let occupiedPoints = [];

    // Pour des raisons de compatibilité IE/Edge
    if (!NodeList.prototype.forEach && Array.prototype.forEach)
    {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

    map.querySelectorAll('.dot').forEach(dot => occupiedPoints.push(getPositionOf(dot)));
    map.querySelectorAll('.magicDot').forEach(magicDot => occupiedPoints.push(getPositionOf(magicDot)));

    const fruit = document.createElement('div');
    fruit.className = 'fruit';

    // vu q'on a que 7 images de fruits, on tourne 1 --> 7
    let idImage = (gameLevel % 7) + 1;
    fruit.style.backgroundImage = "url('./assets/img/game/fruits/"+idImage+".png')";

    // score du fruit 10, 30, 50 , 70 => ça augmente de 20 à chaque niveau
    // fruit.dataset.score = 10 + (20 * (gameLevel - 1));
    fruit.dataset.score = (20 * gameLevel) - 10;
    let row,col;
    do
    {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
    }while (invalidFruitsPositions.some(square => row === square.top && col === square.left) ||
    occupiedPoints.some(square => row === square.top && col === square.left));

    fruit.dataset.top = row.toString();
    fruit.dataset.left = col.toString();

    if (isPortraitOrientation() === true)
    {
        let pos = calcPortraitPos(col, row, !mqlMaxWidth.matches && !mqlMaxHeight.matches);
        fruit.style.left = pos.left;
        fruit.style.top = pos.top;
    }
    else
    {
        let pos = calcLandscapePos(col, row, !mqlMaxWidth.matches && !mqlMaxHeight.matches);
        fruit.style.left = pos.left;
        fruit.style.top = pos.top;
    }

    map.insertBefore(fruit, pacMan);

    isBonusFruitActivated = true;
    bonusFruitRemainingTime = timeout;
    bonusFruitStartTime = Date.now();
    bonusFruitTimeout = setTimeout(bonusFruitTimeoutHandler, timeout);
};

const bonusFruitTimeoutHandler = () =>
{
    isBonusFruitActivated = false;
    bonusFruitStartTime = null;
    bonusFruitRemainingTime = bonusFruitDelay;
    // supprimer le fruit s'il y on a
    let fruit = map.querySelector('.fruit');
    if (fruit)
    {
        map.removeChild(fruit);
    }
};