//*******************************
// /!\ VOIR le fichier reg-ghost pour plus de commentaires
/**************************************/
const pinkGhost = document.querySelector('img[id="pink-ghost"]');

let pinkGhostInterval;
let pinkGhostBlinkBlueTimeout;
let pinkGhostBlinkBlueInterval;
let currentPinkGhostDirection;
let isPinkGhostSuperPowerActivated = false;
const movePinkGhost = (timeout) =>
{
    clearInterval(pinkGhostInterval);
    const randomInt = Math.floor(Math.random() * 4);
    currentPinkGhostDirection = directions[randomInt]; // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'

    pinkGhostInterval = setInterval(movePinkGhostInterval , timeout)
};

const movePinkGhostInterval = () =>
{
    if (isGameOver() === true){
        return;
    }

    let ghostPosition = getPositionOf(pinkGhost);
    // console.log(ghostPosition);

    if (!isTheCharacterBlocked(ghostPosition, currentPinkGhostDirection))
    {
        // console.log(currentPinkGhostDirection);
        move(pinkGhost, ghostPosition, currentPinkGhostDirection)
    } else {
        // console.log("blocked on " + currentPinkGhostDirection);
        // si le fantôme est bloqué on change de direction
        let randomInt = Math.floor(Math.random() * 4);
        // console.log("move " + currentRandomDirection[ghost.name])
        currentPinkGhostDirection = directions[randomInt] // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'
        // console.log("move to" + currentPinkGhostDirection)
    }
};

const movePinkGhostToPacMan = (timeout) =>
{
    clearInterval(pinkGhostInterval);
    pinkGhostInterval = setInterval(() =>
    {
        moveToPacMan(pinkGhost)
    }, timeout);
};

const movePinkGhostAwayFromPacMan = (speed, timeout) =>
{
    isPinkGhostSuperPowerActivated = true;
    clearInterval(pinkGhostInterval);
    clearInterval(pinkGhostBlinkBlueTimeout);
    clearInterval(pinkGhostBlinkBlueInterval);
    pinkGhost.setAttribute('src', blueGhostImage);
    pinkGhostInterval = setInterval(() =>
    {
        moveAwayFromPacMan(pinkGhost)
    }, speed);

    if (timeout > 3000) {
        pinkGhostBlinkBlueTimeout = setTimeout(() => {

            pinkGhostBlinkBlueInterval = setInterval(() => {
                if (pinkGhost.getAttribute('src') === blueGhostImage) {
                    pinkGhost.setAttribute('src', './assets/img/game/pink-ghost.png');
                } else {
                    pinkGhost.setAttribute('src', blueGhostImage);
                }

            }, 250);

        }, timeout - 3000)
    }
    else{
        pinkGhostBlinkBlueInterval = setInterval(() => {
            if (pinkGhost.getAttribute('src') === blueGhostImage) {
                pinkGhost.setAttribute('src', './assets/img/game/pink-ghost.png');
            } else {
                pinkGhost.setAttribute('src', blueGhostImage);
            }

        }, 250);
    }
};

const stopPinkGhost = () =>
{
    clearInterval(pinkGhostInterval);
    clearInterval(pinkGhostBlinkBlueTimeout);
    clearInterval(pinkGhostBlinkBlueInterval);
};

const restartPinkGhost = () =>
{
    stopPinkGhost();
    setCharacterPosition(pinkGhost, {top:4, left:5});
    pinkGhost.setAttribute("src", './assets/img/game/pink-ghost.png');
    isPinkGhostSuperPowerActivated = false;
};

const tryEatPinkGhost = (pacManPos) => {

    // Retourner true si la position de Pac-Man coïncide avec celle d’un fantôme
    const pinkGhostPos = getPositionOf(pinkGhost);

    if (isPinkGhostSuperPowerActivated && isInTheSamePos(pacManPos, pinkGhostPos)) {
        restartPinkGhost();
        score+=30;
        scoreElement.textContent = '' + score;
        isPinkGhostSuperPowerActivated = false;
    }
};