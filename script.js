```javascript
/* =========================================================
   DESBRAVA+
   SCRIPT PRINCIPAL
========================================================= */


/* =========================================================
   NAVEGAÇÃO DO MENU
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach((item) => {

        item.addEventListener("click", () => {

            /* Remove ativo de todos */

            menuItems.forEach((button) => {
                button.classList.remove("active");
            });


            /* Ativa o botão clicado */

            item.classList.add("active");


            /* Nome da função */

            const funcao =
                item.querySelector("span:last-child")?.textContent.trim();


            console.log("Função selecionada:", funcao);


            /* Aqui vamos conectar cada tela depois */

            switch (funcao) {

                case "Início":

                    mostrarMensagem("Início");
                    break;


                case "Desafios":

                    mostrarMensagem("Desafios");
                    break;


                case "Ranking":

                    mostrarMensagem("Ranking");
                    break;


                case "Minha Unidade":

                    mostrarMensagem("Minha Unidade");
                    break;


                case "Conquistas":

                    mostrarMensagem("Conquistas");
                    break;


                case "Reuniões":

                    mostrarMensagem("Reuniões");
                    break;


                case "Suporte":

                    mostrarMensagem("Suporte");
                    break;


                case "Perfil":

                    mostrarMensagem("Perfil");
                    break;


                default:

                    console.log(
                        "Função não encontrada."
                    );
            }

        });

    });


});


/* =========================================================
   FUNÇÃO TEMPORÁRIA
========================================================= */

function mostrarMensagem(nome) {

    console.log(
        "Abrindo a função:",
        nome
    );

}
```
