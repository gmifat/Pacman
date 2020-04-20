//*******************************
// /!\ VOIR le fichier reg-ghost pour plus de commentaires
/**************************************/
const yellowGhost = document.querySelector('img[id="yellow-ghost"]');

let yellowGhostInterval;
let yellowGhostBlinkBlueTimeout;
let yellowGhostBlinkBlueInterval;
let currentYellowGhostDirection;
let isYellowGhostSuperPowerActivated = false;
const moveYellowGhost = (timeout) =>
{
    clearInterval(yellowGhostInterval);
    const randomInt = Math.floor(Math.random() * 4);
    currentYellowGhostDirection = directions[randomInt]; // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'

    yellowGhostInterval = setInterval(moveYellowGhostInterval , timeout)
};

const moveYellowGhostInterval = () =>
{
    if (isGameOver() === true){
        return;
    }

    let ghostPosition = getPositionOf(yellowGhost);
    // console.log(ghostPosition);

    if (!isTheCharacterBlocked(ghostPosition, currentYellowGhostDirection))
    {
        // console.log(currentYellowGhostDirection);
        move(yellowGhost, ghostPosition, currentYellowGhostDirection)
    } else {
        // console.log("blocked on " + currentYellowGhostDirection);
        // si le fantôme est bloqué on change de direction
        let randomInt = Math.floor(Math.random() * 4);
        // console.log("move " + currentRandomDirection[ghost.name])
        currentYellowGhostDirection = directions[randomInt] // Soit 'toLeft', 'toRight', 'toTop', 'toBottom'
        // console.log("move to" + currentYellowGhostDirection)
    }
};

const moveYellowGhostToPacMan = (timeout) =>
{
    clearInterval(yellowGhostInterval);
    yellowGhostInterval = setInterval(() =>
    {
        moveToPacMan(yellowGhost)
    }, timeout);
};

const moveYellowGhostAwayFromPacMan = (speed, timeout) =>
{
    isYellowGhostSuperPowerActivated = true;
    clearInterval(yellowGhostInterval);
    clearInterval(yellowGhostBlinkBlueTimeout);
    clearInterval(yellowGhostBlinkBlueInterval);
    yellowGhost.setAttribute('src', blueGhostImage);
    yellowGhostInterval = setInterval(() =>
    {
        moveAwayFromPacMan(yellowGhost)
    }, speed);

    if (timeout > 3000) {
        yellowGhostBlinkBlueTimeout = setTimeout(() => {

            yellowGhostBlinkBlueInterval = setInterval(() => {
                if (yellowGhost.getAttribute('src') === blueGhostImage) {
                    yellowGhost.setAttribute('src', './assets/img/game/yellow-ghost.png');
                } else {
                    yellowGhost.setAttribute('src', blueGhostImage);
                }

            }, 250);

        }, timeout - 3000)
    }
    else{
        yellowGhostBlinkBlueInterval = setInterval(() => {
            if (yellowGhost.getAttribute('src') === blueGhostImage) {
                yellowGhost.setAttribute('src', './assets/img/game/yellow-ghost.png');
            } else {
                yellowGhost.setAttribute('src', blueGhostImage);
            }

        }, 250);
    }
};

const stopYellowGhost = () =>
{
    clearInterval(yellowGhostInterval);
    clearInterval(yellowGhostBlinkBlueTimeout);
    clearInterval(yellowGhostBlinkBlueInterval);
};

const restartYellowGhost = () =>
{
    stopYellowGhost();
    setCharacterPosition(yellowGhost, {top:4, left:4});
    yellowGhost.setAttribute("src", './assets/img/game/yellow-ghost.png');
    isYellowGhostSuperPowerActivated = false;
};

const tryEatYellowGhost = (pacManPos) => {

    // Retourner true si la position de Pac-Man coïncide avec celle d’un fantôme
    const yellowGhostPos = getPositionOf(yellowGhost);

    if (isYellowGhostSuperPowerActivated && isInTheSamePos(pacManPos, yellowGhostPos)) {
        restartYellowGhost();
        score+=30;
        scoreElement.textContent = '' + score;
        isYellowGhostSuperPowerActivated = false;
    }
};