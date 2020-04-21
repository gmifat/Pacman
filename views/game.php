    <header>
        <img src="./assets/img/game/username.png" alt="username logo">
        <div class="header-container">
            <div class="username">
                <?= $username ?>
            </div>
            <div class="game-level">
                LEVEL : <span id="level">1</span>
            </div>
            <div class="game-live">
                LIVES : <span id="number-of-life">3</span>
            </div>
            <div class="game-score">
                SCORE : <span id="score">0</span>
            </div>
            <div class="game-best-score">
                BEST SCORE : <span id="best-score"><?= $max_score ?></span>
            </div>
            <div class="game-top-ten">
                <a href="#"  onclick="showTopTenScores();">TOP 10</a>
            </div>
        </div>
    </header>
    <div class="container">
        <div class="map">
            <img src="./assets/img/game/pacman.gif" class="character pac-man" id="pac-man" alt="Pac-Man" data-top="5" data-left="5">
            <img src="./assets/img/game/red-ghost.gif" class="character red-ghost" id="red-ghost" alt="Red ghost" data-top="3" data-left="4">
            <img src="./assets/img/game/pink-ghost.png" class="character pink-ghost" id="pink-ghost" alt="Pink ghost" data-top="4" data-left="5">
            <img src="./assets/img/game/yellow-ghost.png" class="character yellow-ghost" id="yellow-ghost" alt="Yellow ghost" data-top="4" data-left="4">
            <img src="./assets/img/game/background.svg" alt="Labyrinthe">
            <div class="pause">
                <div class="pause-content">
                    <p onclick="pauseOrResumeGame();">PAUSE ...</p>
                    <span style="font-size: 8px">Appuyer sur espace ou clicker sur play pour reprendre</span>
                </div>
            </div>
        </div>
        <div class="top-ten">
            <div class="top-ten-content">
                <div class="game-over">
                    <p>GAME OVER</p>
                    Score : <span class="game-over-score">0</span>
                    <a class="game-over-retry" href="#" onclick="closeTopTenScore();">RESSAYER</a>
                    <hr>
                </div>

                <div class="top-ten-table-score">
                    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </div>
                <a class="top-ten-start" href="#" onclick="closeTopTenScore();">COMMENCER</a>
            </div>
        </div>
    </div>
    <div class="helper">
        <a>
            <img src="./assets/img/game/help.png" alt="help icon">
        </a>
    </div>
    <div class="logout">
        <a href="index.php?disconnect">
            <img src="./assets/img/game/logout.png" alt="logout">
        </a>
    </div>
    <div class="pause-resume">
        <img onclick="pauseOrResumeGame();" id="pause-image" src="./assets/img/game/pause.png">
    </div>
    <div class="joystick"></div>
    <script type="text/javascript">
        const user_id = '<?php echo $user_id;?>';
    </script>
    <script src="./assets/js/game/common.js"></script>
    <script src="./assets/js/game/pacman.js"></script>
    <script src="./assets/js/game/red-ghost.js"></script>
    <script src="./assets/js/game/pink-ghost.js"></script>
    <script src="./assets/js/game/yellow-ghost.js"></script>
    <script src="./assets/js/game/main.js"></script>