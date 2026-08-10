document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       NAVEGAÇÃO DO MENU
    ========================================================= */

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const funcao = item.querySelector("span:last-child");

            if (!funcao) {
                return;
            }

            const nome = funcao.textContent.trim();

            /* Sair da conta */
            if (nome === "Sair da conta") {
                sairDaConta();
                return;
            }

            /* Ativa o item */
            menuItems.forEach(function (button) {
                button.classList.remove("active");
            });

            item.classList.add("active");

            console.log("Função selecionada:", nome);
        });

    });


    /* =========================================================
       MOSTRAR / ESCONDER SENHA
    ========================================================= */

    const togglePassword =
        document.getElementById("togglePassword");

    const passwordInput =
        document.getElementById("password");

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";
                togglePassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";
                togglePassword.textContent = "👁️";

            }

        });

    }

});


/* =========================================================
   SAIR DA CONTA
========================================================= */

async function sairDaConta() {

    const confirmar = confirm(
        "Tem certeza que deseja sair da sua conta?"
    );

    if (!confirmar) {
        return;
    }

    try {

        if (
            typeof supabaseClient === "undefined"
        ) {

            alert(
                "O Supabase não foi carregado nesta página."
            );

            return;
        }


        const { error } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            alert(
                "Não foi possível sair da conta."
            );

            return;
        }


        window.location.href = "login.html";


    } catch (error) {

        console.error(error);

        alert(
            "Ocorreu um erro ao sair da conta."
        );

    }

}
