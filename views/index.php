
    <div class="logon-bg-container">

    </div>
    <form  action="index.php?p=login" method="post">
        <div class="logon-main-container">

            <div class="logon-username">
                <label class="logon-label" for="username">Username</label>
                <input class="logon-input" type="text" name="username" id="username">
            </div>
            <div class="logon-password">
                <label class="logon-label" for="password">Password</label>
                <input class="logon-input-password" type="password" name="password" id="password">
                <input id="trigger" type="checkbox" onclick="showHidePassword()">
                <label for="trigger" class="checker"></label>
            </div>
            <div class="logon-actions">
                <a href="index.php?p=account">Créer compte</a>
                <input class="logon-actions-connect" type="submit" value="PAC-MAN">
            </div>
            <?php if (isset($error_message)) :?>
                <div class="account-error-message">
                    <?= $error_message ?>
                </div>
            <?php endif ;?>
            <?php if ($new_account === true) :?>
            <div class="message-ok">
                Votre compte est bien créer
            </div>
            <?php endif; ?>
        </div>
    </form>
    <a class="logon-lost-password" href="#">Mot de passe oublié ?</a>


