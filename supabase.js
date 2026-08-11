/* =========================================================
   DESBRAVA+ — SUPABASE
========================================================= */

(function () {

    "use strict";

    const SUPABASE_URL =
        "https://iibdvkxztgrlrwzqbfrg.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_qMjvqXKJW_5onSUZjymiSw_0KfZi44D";

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {

        console.error(
            "Supabase JS não foi carregado."
        );

        return;

    }

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "✅ Supabase conectado."
    );

})();
