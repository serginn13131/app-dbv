document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       MENU LATERAL
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
       ABAS DO RANKING
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
       DESAFIO
    ======================================== */

    const challengeButton =
        document.querySelector(".primary-button");

    if (challengeButton) {

        challengeButton.addEventListener("click", () => {

            alert(
                "🔥 Desafio selecionado!\n\n" +
                "Em breve você poderá participar deste desafio."
            );

        });

    }


    /* ========================================
       DETALHES DO DESAFIO
    ======================================== */

    const detailsButton =
        document.querySelector(".secondary-button");

    if (detailsButton) {

        detailsButton.addEventListener("click", () => {

            alert(
                "🎯 DESAFIO DA SEMANA\n\n" +
                "Ajude sua família em uma tarefa de casa.\n\n" +
                "Envie uma foto antes e depois.\n\n" +
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
       INICIALIZAÇÃO
    ======================================== */

    console.log("DESBRAVA+ iniciado 🚀");
    console.log("Desenvolvido por Sérgio");

});
