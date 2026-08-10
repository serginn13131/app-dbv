/* =========================================================
   DESBRAVA+
   CONFIGURAÇÃO DO SUPABASE
========================================================= */

(function configurarSupabase() {

    const SUPABASE_URL =
        "https://iibdvkxztgrlrwzqbfrg.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_qMjvqXKJW_5onSUZjymiSw_0KfZi44D";


    /* Verifica se o SDK foi carregado */

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {

        console.error(
            "O SDK do Supabase não foi carregado."
        );

        return;
    }


    /* Cria o cliente */

    try {

        window.supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        console.log(
            "Supabase conectado com sucesso."
        );


    } catch (error) {

        console.error(
            "Erro ao conectar ao Supabase:",
            error
        );

    }

})();
