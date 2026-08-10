/* DESBRAVA+ — autenticação e comportamento global do frontend */

(function () {
    "use strict";

    const clienteSupabase = () => window.supabaseClient;

    function mostrarMensagem(mensagem) {
        window.alert(mensagem);
    }

    function redirecionarParaLogin() {
        if (!window.location.pathname.endsWith("/login.html")) {
            window.location.replace("login.html");
        }
    }

    async function protegerPagina() {
        const cliente = clienteSupabase();

        if (!cliente) {
            console.error("O cliente Supabase não foi inicializado.");
            mostrarMensagem("Não foi possível carregar a autenticação.");
            redirecionarParaLogin();
            return;
        }

        try {
            const { data, error } = await cliente.auth.getSession();

            if (error || !data.session) {
                redirecionarParaLogin();
                return;
            }

            const usuario = data.session.user;
            const { data: perfil, error: erroPerfil } = await cliente
                .from("profiles")
                .select("id, nome, email, avatar, cargo, unidade_id, ativo")
                .eq("id", usuario.id)
                .maybeSingle();

            if (erroPerfil) {
                console.error("Erro ao carregar perfil:", erroPerfil);
                mostrarMensagem("Não foi possível carregar seu perfil.");
                await cliente.auth.signOut();
                redirecionarParaLogin();
                return;
            }

            if (!perfil || perfil.ativo === false) {
                mostrarMensagem("Seu perfil ainda não está ativo ou não foi encontrado.");
                await cliente.auth.signOut();
                redirecionarParaLogin();
                return;
            }

            window.desbravaUsuario = usuario;
            window.desbravaPerfil = perfil;
            preencherDadosDoDashboard(perfil, usuario);
        } catch (erro) {
            console.error("Erro inesperado ao verificar sessão:", erro);
            redirecionarParaLogin();
        }
    }

    function preencherDadosDoDashboard(perfil, usuario) {
        const nome = perfil.nome || usuario.user_metadata?.nome || usuario.email || "Desbravador";
        const elementoNome = document.getElementById("userName");

        if (elementoNome) {
            elementoNome.textContent = nome.split(" ")[0];
        }

        document.querySelectorAll("[data-user-email]").forEach((elemento) => {
            elemento.textContent = perfil.email || usuario.email || "";
        });
    }

    async function sairDaConta() {
        if (!window.confirm("Tem certeza que deseja sair da sua conta?")) {
            return;
        }

        const cliente = clienteSupabase();

        try {
            if (!cliente) {
                redirecionarParaLogin();
                return;
            }

            const { error } = await cliente.auth.signOut();

            if (error) {
                console.error("Erro ao sair:", error);
                mostrarMensagem("Não foi possível sair da conta.");
                return;
            }

            window.location.replace("login.html");
        } catch (erro) {
            console.error("Erro inesperado ao sair:", erro);
            mostrarMensagem("Ocorreu um erro ao sair da conta.");
        }
    }

    function configurarMenu() {
        const itensMenu = document.querySelectorAll(".menu-item, .mobile-item");

        itensMenu.forEach((item) => {
            item.addEventListener("click", () => {
                const texto = item.querySelector("span:last-child, small")?.textContent.trim();

                if (texto === "Sair da conta") {
                    sairDaConta();
                    return;
                }

                itensMenu.forEach((outroItem) => outroItem.classList.remove("active"));
                item.classList.add("active");
            });
        });
    }

    function configurarAlternanciaSenha() {
        const pares = [
            ["togglePassword", "password"],
            ["toggleCadastroPassword", "password"]
        ];

        pares.forEach(([idBotao, idCampo]) => {
            const botao = document.getElementById(idBotao);
            const campo = document.getElementById(idCampo);

            if (!botao || !campo) {
                return;
            }

            botao.addEventListener("click", () => {
                const visivel = campo.type === "text";
                campo.type = visivel ? "password" : "text";
                botao.textContent = visivel ? "👁️" : "🙈";
                botao.setAttribute("aria-label", visivel ? "Mostrar senha" : "Esconder senha");
            });
        });
    }

    async function carregarUnidades() {
        const cliente = clienteSupabase();
        const campoClube = document.getElementById("clube");
        const campoUnidade = document.getElementById("unidade");
        const campoCargo = document.getElementById("cargo");

        if (!campoClube || !campoUnidade || !campoCargo) {
            return;
        }

        campoClube.innerHTML = '<option value="default">Clube de Desbravadores</option>';
        campoClube.value = "default";
        campoUnidade.disabled = false;
        campoCargo.innerHTML = '<option value="Desbravador">Desbravador (definido pelo clube)</option>';
        campoCargo.value = "Desbravador";
        campoCargo.disabled = true;

        if (!cliente) {
            return;
        }

        const { data: unidades, error } = await cliente
            .from("units")
            .select("id, nome, simbolo")
            .eq("ativo", true)
            .order("nome");

        if (error) {
            console.warn("Não foi possível carregar as unidades:", error);
            campoUnidade.innerHTML = '<option value="">Unidades serão definidas pelo clube</option>';
            return;
        }

        campoUnidade.innerHTML = '<option value="">Selecione sua unidade (opcional)</option>';
        (unidades || []).forEach((unidade) => {
            const option = document.createElement("option");
            option.value = unidade.id;
            option.textContent = `${unidade.simbolo ? `${unidade.simbolo} ` : ""}${unidade.nome}`;
            campoUnidade.appendChild(option);
        });
    }

    async function configurarCadastro() {
        const formulario = document.getElementById("cadastroForm");
        if (!formulario) {
            return;
        }

        await carregarUnidades();

        formulario.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const cliente = clienteSupabase();
            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim().toLowerCase();
            const senha = document.getElementById("password").value;
            const confirmacao = document.getElementById("passwordConfirm").value;
            const unidadeId = document.getElementById("unidade").value || null;
            const botao = formulario.querySelector("button[type='submit']");

            if (!cliente) {
                mostrarMensagem("O serviço de autenticação não foi carregado.");
                return;
            }

            if (senha !== confirmacao) {
                mostrarMensagem("As senhas não coincidem.");
                return;
            }

            botao.disabled = true;
            botao.textContent = "Criando conta...";

            try {
                const { data, error } = await cliente.auth.signUp({
                    email,
                    password: senha,
                    options: { data: { nome, cargo: "Desbravador", unidade_id: unidadeId } }
                });

                if (error) {
                    throw error;
                }

                if (!data.user) {
                    throw new Error("O Supabase não retornou o usuário criado.");
                }

                if (data.session) {
                    mostrarMensagem("Conta criada com sucesso!");
                    window.location.replace("index.html");
                } else {
                    mostrarMensagem("Conta criada. Verifique seu e-mail para confirmar o cadastro e depois entre no sistema.");
                    window.location.replace("login.html");
                }
            } catch (erro) {
                console.error("Erro no cadastro:", erro);
                mostrarMensagem(erro.message || "Não foi possível criar a conta.");
            } finally {
                botao.disabled = false;
                botao.textContent = "Criar minha conta";
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        configurarAlternanciaSenha();
        configurarMenu();

        if (document.getElementById("cadastroForm")) {
            configurarCadastro();
        }

        if (document.querySelector(".app")) {
            protegerPagina();
        }
    });
})();
