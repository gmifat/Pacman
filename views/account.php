
    <div class="logon-bg-container">

    </div>
    <form  action="index.php?p=account" method="post">
        <div class="logon-main-container">

            <div class="logon-username">
                <label class="logon-label" for="username">Username</label>
                <input class="logon-input" type="text" name="username" id="username">
            </div>
            <div class="logon-username">
                <label class="logon-label" for="email">Email</label>
                <input class="logon-input" type="text" name="email" id="email">
            </div>
            <div class="logon-password">
                <label class="logon-label" for="password">Password</label>
                <input class="logon-input-password" type="password" name="password" id="password">
                <input id="trigger" type="checkbox" onclick="showHidePassword()">
                <label for="trigger" class="checker"></label>
            </div>
            <div class="logon-actions account-actions">
                <input class="account-submit" type="submit" value="Créer compte">
            </div>
            <?php if (isset($error_message)) :?>
                <div class="account-error-message">
                    <?= $error_message ?>
                </div>
            <?php endif ;?>
        </div>
    </form>

    <a class="logon-lost-password" href="index.php?p=login">Se connecter</a>


<?php
