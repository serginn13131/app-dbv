const SUPABASE_URL =
    "https://iibdvkxztgrlrwzqbfrg.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_qMjvqXKJW_5onSUZjymiSw_0KfZi44D";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =====================================================
   SAIR DA CONTA
===================================================== */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener("click", async function () {

        logoutButton.disabled = true;

        logoutButton.innerHTML =
            "<span>⏳</span><span>Saindo...</span>";


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

            logoutButton.disabled = false;

            logoutButton.innerHTML =
                "<span>🚪</span><span>Sair da conta</span>";

            return;
        }


        window.location.href =
            "login.html";

    });

}
