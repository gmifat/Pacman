
// Collection des murs axe horizontal droite-gauche
const blockedSquaresToLeft = [
    {top:3, left:2},{top:5, left:2},{top:7, left:2},{top:2, left:3},{top:3, left:3},{top:5, left:3},{top:8, left:3},
    {top:0, left:5}, {top:2, left:5}, {top:6, left:5}, {top:8, left:5}, {top:4, left:6}, {top:2, left:7}, {top:3, left:7},
    {top:5, left:7}, {top:8, left:7}, {top:7, left:8},
//ligne en left 0
    {top:0, left:0}, {top:1, left:0}, {top:2, left:0}, {top:6, left:0}, {top:7, left:0}, {top:8, left:0},{top:9, left:0}
];
// Collection des murs axe horizontal gauche-droite
const blockedSquaresToRight = [
    {top:7, left:1}, {top:2, left:2}, {top:3, left:2}, {top:5, left:2}, {top:8, left:2}, {top:4, left:3},
    {top:0, left:4}, {top:2, left:4}, {top:6, left:4}, {top:8, left:4}, {top:2, left:6}, {top:3, left:6},
    {top:5, left:6}, {top:8, left:6}, {top:3, left:7}, {top:5, left:7}, {top:7, left:7},
//ligne en left 9
    {top:0, left:9}, {top:1, left:9}, {top:2, left:9}, {top:6, left:9}, {top:7, left:9},
    {top:8, left:9}, {top:9, left:9}
];
// Collection des murs axe vertical bas-haut
const blockedSquaresToTop = [
    {top:4, left:0}, {top:6, left:0}, {top:8, left:0}, {top:1, left:1}, {top:2, left:1}, {top:4, left:1}, {top:6, left:1},
    {top:4, left:1}, {top:7, left:1}, {top:9, left:1}, {top:9, left:2}, {top:1, left:3}, {top:3, left:3},
    {top:7, left:3}, {top:9, left:3}, {top:2, left:4}, {top:5, left:4}, {top:6, left:4}, {top:8, left:4},
    {top:2, left:5}, {top:5, left:5}, {top:6, left:5}, {top:8, left:5}, {top:1, left:6}, {top:3, left:6},
    {top:7, left:6}, {top:9, left:6}, {top:9, left:7}, {top:1, left:8}, {top:2, left:8}, {top:4, left:8},
    {top:6, left:8}, {top:7, left:8}, {top:9, left:8}, {top:4, left:9}, {top:6, left:9}, {top:8, left:9} ,
//ligne en top 0
    {top:0, left:0}, {top:0, left:1}, {top:0, left:2}, {top:0, left:3}, {top:0, left:4}, {top:0, left:5}, {top:0, left:6},
    {top:0, left:7}, {top:0, left:8}, {top:0, left:9}
];
// Collection des murs axe vertical haut-bas
const blockedSquaresToBottom = [
    {top:2, left:0}, {top:4, left:0}, {top:7, left:0}, {top:0, left:1}, {top:1, left:1}, {top:2, left:1}, {top:4, left:1},
    {top:6, left:1}, {top:8, left:1}, {top:8, left:2}, {top:0, left:3}, {top:2, left:3}, {top:6, left:3}, {top:8, left:3},
    {top:1, left:4}, {top:3, left:4}, {top:5, left:4}, {top:7, left:4}, {top:1, left:5}, {top:3, left:5}, {top:5, left:5},
    {top:7, left:5}, {top:0, left:6}, {top:2, left:6}, {top:6, left:6}, {top:8, left:6}, {top:8, left:7}, {top:0, left:8},
    {top:1, left:8}, {top:2, left:8}, {top:4, left:8}, {top:6, left:8}, {top:8, left:8}, {top:2, left:9}, {top:4, left:9},
    {top:7, left:9},
//ligne en top 9
    {top:9, left:0}, {top:9, left:1}, {top:9, left:2}, {top:9, left:3}, {top:9, left:4}, {top:9, left:5}, {top:9, left:6},
    {top:9, left:7}, {top:9, left:8}, {top:9, left:9}
];

const directions = [ 'toLeft', 'toRight', 'toTop', 'toBottom' ];

// Permet de récupérer la position d'un element
const getPositionOf = (element) =>
{
    const top = Number(element.dataset.top);
    const left = Number(element.dataset.left);
    return { top, left }
};

// Si on est en mode portrait
const isPortraitOrientation = () =>
{
    const mql = matchMedia('(orientation: portrait)');

    return mql.matches;
};

// si le personnage est bloqué
const isTheCharacterBlocked = (characterPositon, movingDirection) =>
{
    let blockedSquares;
    switch (movingDirection)
    {
        case 'toLeft':
            blockedSquares = blockedSquaresToLeft;
            break;
        case 'toRight':
            blockedSquares = blockedSquaresToRight;
            break;
        case 'toTop':
            blockedSquares = blockedSquaresToTop;
            break;
        case 'toBottom':
            blockedSquares = blockedSquaresToBottom;
            break
    }

    return blockedSquares.some(square =>
    {
        const topsAreEquals = characterPositon.top === square.top;
        const leftsAreEquals = characterPositon.left === square.left;
        return topsAreEquals && leftsAreEquals
    })
};

// Déplace un element selon la direction
const move = (character, from, to) =>
{
    const isMax = !mqlMaxHeight.matches && !mqlMaxWidth.matches;
    switch (to)
    {
        case 'toLeft':
            character.dataset.left = from.left === 0 ? 9 : from.left - 1;
            break;
        case 'toRight':
            character.dataset.left = from.left === 9 ? 0 : from.left + 1;
            break;
        case 'toTop':
            character.dataset.top = (from.top - 1);
            break;
        case 'toBottom':
            character.dataset.top = (from.top + 1);
            break
    }

    if (isPortraitOrientation() === true)
    {
        calcPortraitPosElement(character, isMax);
    }
    else
    {
        calcLandscapePosElement(character, isMax);
    }
};

// Positionner un personnage dans la grille
const setCharacterPosition = (character, to) =>
{

    character.dataset.left = to.left;
    character.dataset.top = to.top;
    const isMax = !mqlMaxHeight.matches && !mqlMaxWidth.matches;
    if (isPortraitOrientation() === true)
    {
        calcPortraitPosElement(character, isMax);
    }
    else
    {
        calcLandscapePosElement(character, isMax);
    }
};

// Si deux éléments dans la même position
const isInTheSamePos = (position1, position2)  =>
{
    return position1.left === position2.left && position1.top === position2.top
};

// Déplacer un fantôme dans la direction de pac-man
const moveToPacMan = (ghost) =>
{
    // Le fantôme suit Pac-Man
    const pacManPos = getPositionOf(pacMan);
    const ghostPos = getPositionOf(ghost);

    const topdiff = pacManPos.top - ghostPos.top;
    const leftdiff = pacManPos.left - ghostPos.left;

    if (topdiff === 0)
    {
        let direction = leftdiff > 0 ? 'toRight' : 'toLeft';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
    else if (leftdiff === 0)
    {
        let direction = topdiff > 0 ? 'toBottom' : 'toTop';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
    else if (Math.abs(topdiff) > Math.abs(leftdiff))
    {
        let direction = leftdiff > 0 ? 'toRight' : 'toLeft';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
    else
    {
        let direction = topdiff > 0 ? 'toBottom' : 'toTop';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
};

// Fuire de pac-amn
const moveAwayFromPacMan = (ghost) =>
{
    // Le fantôme s'enfuit de Pac-Man
    const pacManPos = getPositionOf(pacMan);
    const ghostPos = getPositionOf(ghost);

    const topdiff = pacManPos.top - ghostPos.top;
    const leftdiff = pacManPos.left - ghostPos.left;

    if (topdiff === 0)
    {
        let direction = leftdiff < 0 ? 'toRight' : 'toLeft';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
    else if (leftdiff === 0)
    {
        let direction = topdiff < 0 ? 'toBottom' : 'toTop';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
    else if (Math.abs(topdiff) < Math.abs(leftdiff))
    {
        let direction = leftdiff > 0 ? 'toRight' : 'toLeft';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
    else
    {
        let direction = topdiff < 0 ? 'toBottom' : 'toTop';
        if (!isTheCharacterBlocked(ghostPos, direction))
        {
            move(ghost, ghostPos, direction);
        }
    }
};

// Calculer la position d'un élément dans (col,row) si l'affichage est paysage
// le "isMax" permet de savoir si on a dépassé le max-height et max-width pour ne pas utiliser le mode responsive
const calcLandscapePos = (col, row, isMax) =>
{
    let top = 0, left = 0;
    if (isMax === true)
    {
        top = (row * 100) + 'px';
        left = (col * 100) + 'px';
    }
    else
    {
        top = (row * 10) + '%';
        left = (col * (10 - headerSize)) + 'vh';
    }

    return { top, left }
};

// Calculer la position d'un élément si l'affichage est paysage
// le "isMax" permet de savoir si on a dépassé le max-height et max-width pour ne pas utiliser le mode responsive
const calcLandscapePosElement = (elt, isMax) =>
{
    let pos = calcLandscapePos(elt.dataset.left, elt.dataset.top, isMax);
    elt.style.top = pos.top;
    elt.style.left = pos.left;
};

// Calculer la position d'un élément dans (col,row) si l'affichage est portrait
// le "isMax" permet de savoir si on a dépassé le max-height et max-width pour ne pas utiliser le mode responsive
const calcPortraitPos = (col, row, isMax) =>
{
    let top = 0, left = 0;
    if (isMax === true)
    {
        top = (row * 100) + 'px';
        left = (col * 100) + 'px';
    }
    else
    {
        top = (row * (10 - (headerSize*2))) + 'vw';
        left = (col * 10) + '%';
    }

    return { top, left }
};

// Calculer la position d'un élément si l'affichage est portrait
// le "isMax" permet de savoir si on a dépassé le max-height et max-width pour ne pas utiliser le mode responsive
const calcPortraitPosElement = (elt, isMax) => {
    let pos = calcPortraitPos(elt.dataset.left, elt.dataset.top, isMax);
    elt.style.top = pos.top;
    elt.style.left = pos.left;
};