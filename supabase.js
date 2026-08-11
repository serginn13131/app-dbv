
/* DESBRAVA+ — configuração central do Supabase */

(function configurarSupabase() {

    "use strict";

    const SUPABASE_URL =
        "https://iibdvkxztgrlrwzqbfrg.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_qMjvqXKJW_5onSUZjymiSw_0KfZi44D";

    if (
        !window.supabase ||
        typeof window.supabase.createClient !== "function"
    ) {

        throw new Error(
            "Supabase JS não foi carregado antes de supabase.js."
        );

    }

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

})();
```
