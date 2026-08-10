/* ========================================
   DESBRAVA+ — SCRIPT PRINCIPAL
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       MENU
    ======================================== */

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach((item) => {

        item.addEventListener("click", () => {

            menuItems.forEach((menu) => {
                menu.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    /* ========================================
       MENU MOBILE
    ======================================== */

    const mobileItems = document.querySelectorAll(".mobile-item");

    mobileItems.forEach((item) => {

        item.addEventListener("click", () => {

            mobileItems.forEach((mobile) => {
                mobile.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    /* ========================================
       RANKING — ABAS
    ======================================== */

    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            tabs.forEach((button) => {
                button.classList.remove("active");
            });

            tab.classList.add("active");

            console.log(
                "Ranking selecionado:",
                tab.textContent.trim()
            );

        });

    });


    /* ========================================
       BOTÃO DO DESAFIO
    ======================================== */

    const challengeButton =
        document.querySelector(".primary-button");

    if (challengeButton) {

        challengeButton.addEventListener("click", () => {

            alert(
                "🔥 Desafio selecionado!\n\n" +
                "Na próxima etapa vamos criar a página completa do desafio."
            );

        });

    }


    /* ========================================
       BOTÃO VER DETALHES
    ======================================== */

    const detailsButton =
        document.querySelector(".secondary-button");

    if (detailsButton) {

        detailsButton.addEventListener("click", () => {

            alert(
                "🎯 Detalhes do desafio\n\n" +
                "Ajude sua família em uma tarefa de casa.\n\n" +
                "Recompensa: +50 pontos."
            );

        });

    }


    /* ========================================
       ANIMAÇÃO DO PROGRESSO
    ======================================== */

    const progress =
        document.querySelector(".progress-fill");

    if (progress) {

        progress.style.width = "0%";

        setTimeout(() => {

            progress.style.width = "80%";

        }, 300);

    }


    /* ========================================
       ANIMAÇÃO DOS CARDS
    ======================================== */

    const cards =
        document.querySelectorAll(".card, .hero-card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(12px)";

        setTimeout(() => {

            card.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            card.style.opacity = "1";
            card.style.transform = "translateY(0)";

        }, 100 + index * 80);

    });


    /* ========================================
       CONSOLE
    ======================================== */

    console.log(
        "%cDESBRAVA+",
        "font-size: 24px; font-weight: 900;"
    );

    console.log(
        "Sistema iniciado com sucesso 🚀"
    );

});
