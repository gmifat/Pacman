const redGhost = document.querySelector('img[id="red-ghost"]');

let redGhostInterval;
let redGhostBlinkBlueTimeout;
let redGhostBlinkBlueInterval;
let currentRedGhostDirection;
let isRedGhostSuperPowerActivated = false;

// Faire bouger le fantôme d'une manière aléatoire avec une fréquence de timeout
const moveRedGhost = (timeout) =>
{
    clearInterval(redGhostInterval);
    const randomInt = Math.floor(Math.random() * 4);
    currentRedGhostDirection = directions[randomInt]; // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'

    redGhostInterval = setInterval(moveRedGhostInterval , timeout)
};

// fonction répétitive de mouvement de fantôme
const moveRedGhostInterval = () =>
{
    // tester à chaque déplacement si on est dans la même position que pac-man
    if (isGameOver() === true)
    {
        return;
    }

    let ghostPosition = getPositionOf(redGhost);

    if (!isTheCharacterBlocked(ghostPosition, currentRedGhostDirection))
    {
        move(redGhost, ghostPosition, currentRedGhostDirection)
    }
    else
    {
        // si le fantôme est bloqué on change de direction
        let randomInt = Math.floor(Math.random() * 4);
        currentRedGhostDirection = directions[randomInt]; // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'
    }
};

// Bouger le fantôme rouge dans la direction de pac-man
const moveRedGhostToPacMan = (timeout) =>
{
    clearInterval(redGhostInterval);
    redGhostInterval = setInterval(() =>
    {
        moveToPacMan(redGhost)
    }, timeout);
};

// Bouger le fantôme rouge loin de pac-man
const moveRedGhostAwayFromPacMan = (speed, timeout) =>
{
    isRedGhostSuperPowerActivated = true;
    clearInterval(redGhostInterval);
    clearInterval(redGhostBlinkBlueTimeout);
    clearInterval(redGhostBlinkBlueInterval);
    redGhost.setAttribute('src', blueGhostImage);
    redGhostInterval = setInterval(() =>
    {
        moveAwayFromPacMan(redGhost)
    }, speed);


    if (timeout > 3000)
    {
        redGhostBlinkBlueTimeout = setTimeout(() =>
        {
            // Permet d'avoir l'animation avant la fin de 3 secondes
            redGhostBlinkBlueInterval = setInterval(() =>
            {
                if (redGhost.getAttribute('src') === blueGhostImage)
                {
                    redGhost.setAttribute('src', './assets/img/game/red-ghost.gif');
                } else
                {
                    redGhost.setAttribute('src', blueGhostImage);
                }

            }, 250);

        }, timeout - 3000)
    }
    else
    {
        // si on fait pause alors qu'il reste moins de 3 secondes on active que le mode alerte de fin
        redGhostBlinkBlueInterval = setInterval(() =>
        {
            if (redGhost.getAttribute('src') === blueGhostImage)
            {
                redGhost.setAttribute('src', './assets/img/game/red-ghost.gif');
            }
            else
            {
                redGhost.setAttribute('src', blueGhostImage);
            }

        }, 250);
    }
};

// arrêter le fantôme avec les options
const stopRedGhost = () =>
{
    clearInterval(redGhostInterval);
    clearInterval(redGhostBlinkBlueTimeout);
    clearInterval(redGhostBlinkBlueInterval);
};

// redémarrer le fantôme
const restartRedGhost = () =>
{
    stopRedGhost();
    setCharacterPosition(redGhost, {top:3, left:4});
    redGhost.setAttribute("src", './assets/img/game/red-ghost.png');
    isRedGhostSuperPowerActivated = false;
};

// Essayer de manger le red ghost si le super pouvoir est encore actif
const tryEatRedGhost = (pacManPos) =>
{

    // Retourner true si la position de Pac-Man coïncide avec celle d’un fantôme
    const redGhostPos = getPositionOf(redGhost);

    if (isRedGhostSuperPowerActivated && isInTheSamePos(pacManPos, redGhostPos))
    {
        // remettre le fantôme dans sa position d'origine
        restartRedGhost();

        // ajouter score
        score+=30;
        scoreElement.textContent = '' + score;

        // le fantôme n'est plus touché par le super pouvoir même s'il reste du temps
        isRedGhostSuperPowerActivated = false;
    }
};