/* ============================================
   DESBRAVA+
   CONFIGURAÇÃO SUPABASE
============================================ */

const SUPABASE_URL =
    "https://iibdvkxztgrlrwzqbfrg.supabase.co";

const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpYmR2a3h6dGdybHJ3enFiZnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMTcxMDgsImV4cCI6MjEwMTg5MzEwOH0.qotf9MTLi7YBfKgHWuH5qd3Wrb0_BEsATM6AGeqsEes";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* ============================================
   LOGIN
============================================ */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        if (!email || !password) {

            alert("Preencha seu e-mail e sua senha.");

            return;
        }


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        if (error) {

            console.error(error);

            alert(
                "Não foi possível entrar.\n\n" +
                error.message
            );

            return;
        }


        console.log("Usuário autenticado:", data.user);

        window.location.href = "index.html";

    });

}


/* ============================================
   MOSTRAR / ESCONDER SENHA
============================================ */

const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "👁️";

        }

    });

}


/* ============================================
   VERIFICAR USUÁRIO LOGADO
============================================ */

async function verificarUsuario() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();


    return user;

}


/* ============================================
   PROTEGER INDEX
============================================ */

async function protegerPagina() {

    const usuario =
        await verificarUsuario();


    if (!usuario) {

        window.location.href = "login.html";

        return null;
    }


    return usuario;

}


/* ============================================
   EXECUTAR PROTEÇÃO
============================================ */

if (
    window.location.pathname.endsWith("index.html")
    ||
    window.location.pathname === "/"
) {

    protegerPagina();

}
