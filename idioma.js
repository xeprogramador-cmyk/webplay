/* WebPlay – idioma (automático ou escolhido). Um só arquivo para index.php, index.html (admin) e baixar.php.
   - "Auto" usa o idioma do aparelho/navegador; se não houver tradução, usa inglês.
   - Escolha guardada no aparelho (localStorage "webplay_idioma"). Ao mudar, a página recarrega no novo idioma.
   - Na 1ª vez dentro do app, pergunta o idioma.
   - Traduz os textos da interface por dicionário (abaixo). Texto que não estiver no dicionário fica em português.
     Para traduzir mais: acrescente uma linha  ["texto em português","English","Español","Français"].
   - <script src="idioma.js" data-ui="auto|flutuante|nenhuma">  (auto = procura a busca e o perfil do catálogo) */
(function(){
  var LS = "webplay_idioma";
  var NOMES = { pt:"Português", en:"English", es:"Español", fr:"Français" };
  var LOCALE = { pt:"pt-BR", en:"en-US", es:"es-ES", fr:"fr-FR" };
  var ORDEM = ["pt","en","es","fr"];
  var me = document.currentScript, UI = (me && me.getAttribute("data-ui")) || "auto";

  function guardado(){ try{ return localStorage.getItem(LS); }catch(e){ return null; } }
  function detectar(){
    var l = ((navigator.languages && navigator.languages[0]) || navigator.language || "pt").slice(0,2).toLowerCase();
    return NOMES[l] ? l : "en";
  }
  function escolha(){ return guardado() || "auto"; }
  function lang(){ var e = escolha(); return e === "auto" ? detectar() : (NOMES[e] ? e : "pt"); }
  var L = lang();

  /* ===== dicionário: [pt, en, es, fr] ===== */
  var ROWS = [
["Adicionar aos favoritos","Add to favorites","Añadir a favoritos","Ajouter aux favoris"],
["Adicionar à minha lista","Add to my list","Añadir a mi lista","Ajouter à ma liste"],
["Borda","Border","Borde","Bordure"],
["Buscar filmes, séries, animes, doramas...","Search movies, series, anime, dramas...","Buscar películas, series, anime, doramas...","Rechercher films, séries, animes, dramas..."],
["Cabeçalho","Header","Cabecera","En-tête"],
["Como o site se mostra","How the site looks","Cómo se ve el sitio","Apparence du site"],
["Cronograma de lançamentos","Release schedule","Calendario de estrenos","Calendrier des sorties"],
["Editar perfil","Edit profile","Editar perfil","Modifier le profil"],
["Escreve o que achaste...","Write what you thought...","Escribe lo que pensaste...","Écris ce que tu en as pensé..."],
["Estilo do site","Site style","Estilo del sitio","Style du site"],
["Favorito","Favorite","Favorito","Favori"],
["Fechar","Close","Cerrar","Fermer"],
["Feed","Feed","Feed","Fil d'actualité"],
["Forma da borda","Border shape","Forma del borde","Forme de la bordure"],
["Ir para o próximo episódio","Go to next episode","Ir al siguiente episodio","Aller à l'épisode suivant"],
["Mais","More","Más","Plus"],
["Meu perfil","My profile","Mi perfil","Mon profil"],
["Minha lista","My list","Mi lista","Ma liste"],
["Minha lista e favoritos","My list and favorites","Mi lista y favoritos","Ma liste et favoris"],
["Mostrar ou ocultar o cabeçalho","Show or hide the header","Mostrar u ocultar la cabecera","Afficher ou masquer l'en-tête"],
["Mostrar sinopse","Show synopsis","Mostrar sinopsis","Afficher le synopsis"],
["Mínimo 6 caracteres","At least 6 characters","Mínimo 6 caracteres","6 caractères minimum"],
["O teu nome","Your name","Tu nombre","Ton nom"],
["Opções do site","Site options","Opciones del sitio","Options du site"],
["Partilhar","Share","Compartir","Partager"],
["Partilhar a app","Share the app","Compartir la app","Partager l'app"],
["Pesquisar","Search","Buscar","Rechercher"],
["Servidores em inglês","English servers","Servidores en inglés","Serveurs en anglais"],
["Tamanho e alinhamento do texto","Text size and alignment","Tamaño y alineación del texto","Taille et alignement du texte"],
["Texto","Text","Texto","Texte"],
["Velocidade","Speed","Velocidad","Vitesse"],
["Ver histórico de pesquisas","View search history","Ver historial de búsquedas","Voir l'historique de recherche"],
["Voltar","Back","Volver","Retour"],
["o-teu@email.com","your@email.com","tu@email.com","ton@email.com"],
["A carregar…","Loading…","Cargando…","Chargement…"],
["Abrir ›","Open ›","Abrir ›","Ouvrir ›"],
["Animes","Anime","Anime","Animes"],
["Avaliar","Rate","Valorar","Noter"],
["Avaliações","Ratings","Valoraciones","Évaluations"],
["Baixar","Download","Descargar","Télécharger"],
["Baixar episódio","Download episode","Descargar episodio","Télécharger l'épisode"],
["Caro usuário,","Dear user,","Estimado usuario,","Cher utilisateur,"],
["Claro","Light","Claro","Clair"],
["Comentários recentes","Recent comments","Comentarios recientes","Commentaires récents"],
["Como baixar","How to download","Cómo descargar","Comment télécharger"],
["Como baixar (1DM)","How to download (1DM)","Cómo descargar (1DM)","Comment télécharger (1DM)"],
["Conteúdo servido pela nossa API · dados de capas/títulos via TMDB","Content served by our API · cover/title data via TMDB","Contenido servido por nuestra API · datos de portadas/títulos vía TMDB","Contenu fourni par notre API · données des affiches/titres via TMDB"],
["Continuar Assistindo","Continue Watching","Seguir viendo","Continuer à regarder"],
["Continuar com Google","Continue with Google","Continuar con Google","Continuer avec Google"],
["Continuar com e-mail / Criar conta","Continue with email / Create account","Continuar con correo / Crear cuenta","Continuer avec e-mail / Créer un compte"],
["Criar conta","Create account","Crear cuenta","Créer un compte"],
["Doramas","Dramas","Doramas","Dramas"],
["E-mail","Email","Correo electrónico","E-mail"],
["Em inglês","In English","En inglés","En anglais"],
["Entrar","Sign in","Entrar","Se connecter"],
["Episódio","Episode","Episodio","Épisode"],
["Escolhe o servidor e toca em ▶ — o 1DM captura o vídeo.","Choose the server and tap ▶ — 1DM captures the video.","Elige el servidor y toca ▶ — 1DM captura el vídeo.","Choisis le serveur et touche ▶ — 1DM capture la vidéo."],
["Escolhe o servidor e toca em ▶.","Choose the server and tap ▶.","Elige el servidor y toca ▶.","Choisis le serveur et touche ▶."],
["Escolher","Choose","Elegir","Choisir"],
["Escuro","Dark","Oscuro","Sombre"],
["Espelhar","Mirror","Reflejar","Miroir"],
["Espera o Cloudflare confirmar (fica verde).","Wait for Cloudflare to confirm (it turns green).","Espera a que Cloudflare confirme (se pone verde).","Attends que Cloudflare confirme (il devient vert)."],
["Estilo","Style","Estilo","Style"],
["Filmes","Movies","Películas","Films"],
["Informações","Information","Información","Informations"],
["Iniciar conta","Sign in","Iniciar sesión","Se connecter"],
["Início","Home","Inicio","Accueil"],
["Isto não é um anúncio","This is not an ad","Esto no es un anuncio","Ceci n'est pas une publicité"],
["Já lançados","Already released","Ya estrenados","Déjà sortis"],
["Limpar","Clear","Borrar","Effacer"],
["Link da foto de perfil","Profile photo link","Enlace de la foto de perfil","Lien de la photo de profil"],
["Link da foto de perfil (opcional)","Profile photo link (optional)","Enlace de la foto de perfil (opcional)","Lien de la photo de profil (facultatif)"],
["Listas","Lists","Listas","Listes"],
["Mensal","Monthly","Mensual","Mensuel"],
["Mostrar o \"Como baixar\" antes de baixar","Show \"How to download\" before downloading","Mostrar \"Cómo descargar\" antes de descargar","Afficher « Comment télécharger » avant de télécharger"],
["Mudar ›","Change ›","Cambiar ›","Changer ›"],
["Nome","Name","Nombre","Nom"],
["Nome (só neste aparelho)","Name (this device only)","Nombre (solo en este dispositivo)","Nom (cet appareil uniquement)"],
["Notas e opiniões de quem já assistiu","Ratings and opinions from people who watched it","Notas y opiniones de quien ya lo vio","Notes et avis de ceux qui l'ont vu"],
["Novos episódios — dos que você assiste e dos mais famosos.","New episodes — from what you watch and the most popular.","Nuevos episodios — de lo que ves y de los más famosos.","Nouveaux épisodes — de ce que vous regardez et des plus populaires."],
["O 1DM abre a página do vídeo.","1DM opens the video page.","1DM abre la página del vídeo.","1DM ouvre la page de la vidéo."],
["O 1DM captura o vídeo: toca no botão de baixar dele.","1DM captures the video: tap its download button.","1DM captura el vídeo: toca su botón de descargar.","1DM capture la vidéo : touche son bouton de téléchargement."],
["O que a comunidade está a comentar.","What the community is talking about.","Lo que la comunidad está comentando.","Ce dont la communauté parle."],
["Oceano","Ocean","Océano","Océan"],
["Palavra-passe","Password","Contraseña","Mot de passe"],
["Para comentar e avaliar, inicia conta primeiro.","To comment and rate, sign in first.","Para comentar y valorar, inicia sesión primero.","Pour commenter et noter, connecte-toi d'abord."],
["Próximo →","Next →","Siguiente →","Suivant →"],
["Próximo ▶","Next ▶","Siguiente ▶","Suivant ▶"],
["Próximos","Upcoming","Próximos","À venir"],
["Publicar comentário","Post comment","Publicar comentario","Publier le commentaire"],
["Resultados da pesquisa","Search results","Resultados de la búsqueda","Résultats de la recherche"],
["Retome rapidamente o que você estava assistindo.","Quickly resume what you were watching.","Retoma rápidamente lo que estabas viendo.","Reprenez vite ce que vous regardiez."],
["Se ainda não sabes baixar no 1DM, vê primeiro o passo-a-passo.","If you don't know how to download with 1DM yet, see the step-by-step first.","Si aún no sabes descargar con 1DM, mira primero el paso a paso.","Si tu ne sais pas encore télécharger avec 1DM, regarde d'abord le pas à pas."],
["Semanal","Weekly","Semanal","Hebdomadaire"],
["Séries","Series","Series","Séries"],
["Tema","Theme","Tema","Thème"],
["Temas","Themes","Temas","Thèmes"],
["Temporada","Season","Temporada","Saison"],
["Terminar sessão","Sign out","Cerrar sesión","Se déconnecter"],
["Tipo de letra","Font","Tipo de letra","Police"],
["Toca no botão de baixar do 1DM.","Tap the 1DM download button.","Toca el botón de descargar de 1DM.","Touche le bouton de téléchargement de 1DM."],
["Todos","All","Todos","Tous"],
["Usar só neste aparelho, sem conta","Use on this device only, no account","Usar solo en este dispositivo, sin cuenta","Utiliser uniquement sur cet appareil, sans compte"],
["Ver Episódios →","See episodes →","Ver episodios →","Voir les épisodes →"],
["Ver todas ›","See all ›","Ver todas ›","Tout voir ›"],
["Ver todos →","See all →","Ver todos →","Tout voir →"],
["Ver tudo →","See all →","Ver todo →","Tout voir →"],
["Visão geral","Overview","Resumen","Aperçu"],
["Vídeos","Videos","Vídeos","Vidéos"],
["Webplay. Todos os direitos reservados.","Webplay. All rights reserved.","Webplay. Todos los derechos reservados.","Webplay. Tous droits réservés."],
["catálogo completo","full catalog","catálogo completo","catalogue complet"],
["ou","or","o","ou"],
["ver versão escrita","see written version","ver versión escrita","voir la version écrite"],
["ver versão em vídeo (melhor)","see video version (better)","ver versión en vídeo (mejor)","voir la version vidéo (meilleure)"],
["Últimos Episódios","Latest Episodes","Últimos episodios","Derniers épisodes"],
["Últimos lançamentos","Latest releases","Últimos estrenos","Dernières sorties"],
["← Voltar","← Back","← Volver","← Retour"],
["Assistir Agora","Watch Now","Ver ahora","Regarder maintenant"],
["Ver como baixar","See how to download","Ver cómo descargar","Voir comment télécharger"],
["Perguntas","Questions","Preguntas","Questions"],
["Automático","Automatic","Automático","Automatique"],
["Sinopse","Synopsis","Sinopsis","Synopsis"],
["Todos os comentários","All comments","Todos los comentarios","Tous les commentaires"],
["Guardar","Save","Guardar","Enregistrer"],
["Enquetes","Polls","Encuestas","Sondages"],
["Avisos","Notices","Avisos","Avis"],
["Mais Acessados","Most Viewed","Más vistos","Les plus consultés"],
["Histórico","History","Historial","Historique"],
["Manual","Manual","Manual","Manuel"],
["Webplay (padrão)","Webplay (default)","Webplay (predeterminado)","Webplay (par défaut)"],
["Com que servidores quer assistir?","Which servers do you want to watch with?","¿Con qué servidores quieres ver?","Avec quels serveurs veux-tu regarder ?"],
["Servidores em português","Portuguese servers","Servidores en portugués","Serveurs en portugais"],
["Servidores em francês","French servers","Servidores en francés","Serveurs en français"],
["Servidores em espanhol","Spanish servers","Servidores en español","Serveurs en espagnol"],
["Em francês","In French","En francés","En français"],
["Em espanhol","In Spanish","En español","En espagnol"],
["Outros idiomas","Other languages","Otros idiomas","Autres langues"],
["Idioma original","Original language","Idioma original","Langue originale"],
["Inglês · original, sem dublagem","English · original, no dubbing","Inglés · original, sin doblaje","Anglais · version originale, sans doublage"],
["Cancelar","Cancel","Cancelar","Annuler"],
["Idioma","Language","Idioma","Langue"],
["Atualize o aplicativo","Update the app","Actualiza la aplicación","Mettez à jour l'application"],
["Atualizar","Update","Actualizar","Mettre à jour"],
["Agora não","Not now","Ahora no","Pas maintenant"],
["Baixar novamente","Download again","Descargar de nuevo","Télécharger à nouveau"],
["Abrindo o aplicativo…","Opening the app…","Abriendo la aplicación…","Ouverture de l'application…"],
["Abrir o aplicativo","Open the app","Abrir la aplicación","Ouvrir l'application"],
["Baixar o aplicativo","Download the app","Descargar la aplicación","Télécharger l'application"],
["Como baixar","How to download","Cómo descargar","Comment télécharger"],
["A abrir no 1DM…","Opening in 1DM…","Abriendo en 1DM…","Ouverture dans 1DM…"],
["A ligar ao servidor","Connecting to the server","Conectando al servidor","Connexion au serveur"],
["A palavra-passe é fraca (mínimo 6 caracteres).","The password is too weak (at least 6 characters).","La contraseña es débil (mínimo 6 caracteres).","Le mot de passe est trop faible (6 caractères minimum)."],
["A processar…","Processing…","Procesando…","Traitement…"],
["A publicar...","Publishing...","Publicando...","Publication..."],
["A tua lista está vazia. Toca no botão de lista (+) na ficha de um título.","Your list is empty. Tap the list button (+) on a title's page.","Tu lista está vacía. Toca el botón de lista (+) en la ficha de un título.","Ta liste est vide. Appuie sur le bouton de liste (+) sur la fiche d'un titre."],
["Ainda não tens favoritos. Toca no ♡ na ficha de um título.","You have no favorites yet. Tap the ♡ on a title's page.","Aún no tienes favoritos. Toca el ♡ en la ficha de un título.","Tu n'as pas encore de favoris. Appuie sur le ♡ sur la fiche d'un titre."],
["Ainda não tenho o app: baixar","I don't have the app yet: download","Aún no tengo la app: descargar","Je n'ai pas encore l'app : télécharger"],
["Amanhã","Tomorrow","Mañana","Demain"],
["amanhã","tomorrow","mañana","demain"],
["Ambos ligados: vale o tema que escolher abaixo e, nas datas especiais, o automático entra por cima.","Both on: the theme you pick below applies, and on special dates the automatic one takes over.","Ambos activados: vale el tema que elijas abajo y, en fechas especiales, el automático entra encima.","Les deux activés : le thème choisi ci-dessous s'applique et, aux dates spéciales, l'automatique prend le dessus."],
["Anónimo","Anonymous","Anónimo","Anonyme"],
["Anúncio","Ad","Anuncio","Publicité"],
["Anúncio bloqueado","Ad blocked","Anuncio bloqueado","Publicité bloquée"],
["Assistir anúncio","Watch ad","Ver anuncio","Voir la publicité"],
["As contas não estão disponíveis neste momento.","Accounts are not available right now.","Las cuentas no están disponibles en este momento.","Les comptes ne sont pas disponibles pour le moment."],
["As minhas listas","My lists","Mis listas","Mes listes"],
["Ativar o Como baixar","Turn on How to download","Activar Cómo descargar","Activer Comment télécharger"],
["Desativar o Como baixar","Turn off How to download","Desactivar Cómo descargar","Désactiver Comment télécharger"],
["Automático desligado.","Automatic is off.","Automático desactivado.","Automatique désactivé."],
["Baseado no que você está vendo","Based on what you're watching","Basado en lo que estás viendo","Basé sur ce que tu regardes"],
["Caro usuário","Dear user","Estimado usuario","Cher utilisateur"],
["Catálogo","Catalog","Catálogo","Catalogue"],
["Clássica (a antiga)","Classic (the old one)","Clásica (la antigua)","Classique (l'ancienne)"],
["Como está agora","As it is now","Como está ahora","Comme actuellement"],
["Configura o 1DM: escolhe um local de armazenamento.","Set up 1DM: choose a storage location.","Configura 1DM: elige una ubicación de almacenamiento.","Configure 1DM : choisis un emplacement de stockage."],
["Copia o link:","Copy the link:","Copia el enlace:","Copie le lien :"],
["Criação","Creator","Creación","Création"],
["Demasiadas tentativas. Tenta mais tarde.","Too many attempts. Try again later.","Demasiados intentos. Inténtalo más tarde.","Trop de tentatives. Réessaie plus tard."],
["Direção","Director","Dirección","Réalisation"],
["Duração","Duration","Duración","Durée"],
["E-mail ou palavra-passe incorretos.","Incorrect email or password.","Correo o contraseña incorrectos.","E-mail ou mot de passe incorrect."],
["Escolhe pelo menos 1 estrela antes de publicar.","Pick at least 1 star before publishing.","Elige al menos 1 estrella antes de publicar.","Choisis au moins 1 étoile avant de publier."],
["Escolher o local de armazenamento no 1DM","Choose the storage location in 1DM","Elegir la ubicación de almacenamiento en 1DM","Choisir l'emplacement de stockage dans 1DM"],
["Escreve a palavra-passe.","Enter your password.","Escribe la contraseña.","Saisis le mot de passe."],
["Escreve o e-mail e a palavra-passe.","Enter your email and password.","Escribe el correo y la contraseña.","Saisis l'e-mail et le mot de passe."],
["Espera o Cloudflare confirmar, escolhe o servidor e toca em ▶.","Wait for Cloudflare to confirm, choose the server and tap ▶.","Espera a que Cloudflare confirme, elige el servidor y toca ▶.","Attends que Cloudflare confirme, choisis le serveur et appuie sur ▶."],
["Este conteúdo ainda não tem link disponível.","This title doesn't have a link available yet.","Este contenido aún no tiene enlace disponible.","Ce contenu n'a pas encore de lien disponible."],
["Este domínio ainda não está autorizado no Firebase (Authentication › Definições › Domínios autorizados).","This domain is not yet authorized in Firebase (Authentication › Settings › Authorized domains).","Este dominio aún no está autorizado en Firebase (Authentication › Ajustes › Dominios autorizados).","Ce domaine n'est pas encore autorisé dans Firebase (Authentication › Paramètres › Domaines autorisés)."],
["Este e-mail já entrou com o Google neste aparelho. A entrar com o Google…","This email has already signed in with Google on this device. Signing in with Google…","Este correo ya entró con Google en este dispositivo. Entrando con Google…","Cet e-mail s'est déjà connecté avec Google sur cet appareil. Connexion avec Google…"],
["Este método de entrada ainda não foi ativado no Firebase.","This sign-in method hasn't been enabled in Firebase yet.","Este método de acceso aún no se ha activado en Firebase.","Cette méthode de connexion n'est pas encore activée dans Firebase."],
["Filmes, séries, animes e doramas do catálogo. As datas são as previstas pela TMDB e podem mudar.","Movies, series, anime and dramas from the catalog. Dates are those predicted by TMDB and may change.","Películas, series, animes y doramas del catálogo. Las fechas son las previstas por TMDB y pueden cambiar.","Films, séries, animes et dramas du catalogue. Les dates sont celles prévues par TMDB et peuvent changer."],
["Gêneros:","Genres:","Géneros:","Genres :"],
["Géneros:","Genres:","Géneros:","Genres :"],
["Inglês · original (sem dublagem, sem legenda)","English · original (no dubbing, no subtitles)","Inglés · original (sin doblaje, sin subtítulos)","Anglais · version originale (sans doublage, sans sous-titres)"],
["Inicia sessão para guardares o teu perfil, votos e comentários. Se preferires, podes fazê-lo mais tarde.","Sign in to save your profile, votes and comments. If you prefer, you can do it later.","Inicia sesión para guardar tu perfil, votos y comentarios. Si prefieres, puedes hacerlo más tarde.","Connecte-toi pour sauvegarder ton profil, tes votes et tes commentaires. Si tu préfères, tu peux le faire plus tard."],
["Iniciar sessão","Sign in","Iniciar sesión","Se connecter"],
["Já existe uma conta com este e-mail. Usa 'Entrar'.","An account with this email already exists. Use 'Sign in'.","Ya existe una cuenta con este correo. Usa 'Entrar'.","Un compte existe déjà avec cet e-mail. Utilise « Se connecter »."],
["Limpo, sem sombras","Clean, no shadows","Limpio, sin sombras","Épuré, sans ombres"],
["Mostrar o \"Como baixar\" antes de baixar","Show \"How to download\" before downloading","Mostrar \"Cómo descargar\" antes de descargar","Afficher « Comment télécharger » avant de télécharger"],
["Média","Average","Media","Moyenne"],
["Nome no topo (deixa vazio para ficar Webplay)","Name at the top (leave empty to keep Webplay)","Nombre arriba (déjalo vacío para dejar Webplay)","Nom en haut (laisse vide pour garder Webplay)"],
["Nome visível no topo","Name shown at the top","Nombre visible arriba","Nom affiché en haut"],
["Não foi possível carregar as informações.","Couldn't load the information.","No se pudo cargar la información.","Impossible de charger les informations."],
["Não foi possível carregar o trailer.","Couldn't load the trailer.","No se pudo cargar el tráiler.","Impossible de charger la bande-annonce."],
["Não foi possível carregar agora.","Couldn't load right now.","No se pudo cargar ahora.","Impossible de charger pour le moment."],
["Não foi possível carregar esta secção agora.","Couldn't load this section right now.","No se pudo cargar esta sección ahora.","Impossible de charger cette section pour le moment."],
["Não foi possível entrar com o Google no app. Tenta outra vez.","Couldn't sign in with Google in the app. Try again.","No se pudo entrar con Google en la app. Inténtalo de nuevo.","Impossible de se connecter avec Google dans l'app. Réessaie."],
["Não foi possível preparar o download.","Couldn't prepare the download.","No se pudo preparar la descarga.","Impossible de préparer le téléchargement."],
["O desenho da Webplay","The Webplay design","El diseño de Webplay","Le design de Webplay"],
["O e-mail não é válido.","The email isn't valid.","El correo no es válido.","L'e-mail n'est pas valide."],
["O navegador bloqueou a janela do anúncio. Permita os pop-ups para este site e toque para tentar de novo.","The browser blocked the ad window. Allow pop-ups for this site and tap to try again.","El navegador bloqueó la ventana del anuncio. Permite las ventanas emergentes para este sitio y toca para intentarlo de nuevo.","Le navigateur a bloqué la fenêtre de la publicité. Autorise les pop-ups pour ce site et appuie pour réessayer."],
["Os comentários ainda não estão ligados neste site (falta configurar o Firebase no código).","Comments aren't connected on this site yet (Firebase still needs to be set up in the code).","Los comentarios aún no están conectados en este sitio (falta configurar Firebase en el código).","Les commentaires ne sont pas encore activés sur ce site (Firebase reste à configurer dans le code)."],
["Os comentários ainda não estão ligados neste site.","Comments aren't connected on this site yet.","Los comentarios aún no están conectados en este sitio.","Les commentaires ne sont pas encore activés sur ce site."],
["Outras obras que ele publicou","Other works they published","Otras obras que publicó","Autres œuvres qu'il a publiées"],
["Partilhar episódio","Share episode","Compartir episodio","Partager l'épisode"],
["Partilhar o aplicativo","Share the app","Compartir la aplicación","Partager l'application"],
["Partilhe o nosso aplicativo","Share our app","Comparte nuestra aplicación","Partagez notre application"],
["Partilhe o nosso aplicativo, por favor 💛","Please share our app 💛","Comparte nuestra aplicación, por favor 💛","Partagez notre application, s'il vous plaît 💛"],
["Passo-a-passo para baixar","Step-by-step download guide","Paso a paso para descargar","Guide pas à pas pour télécharger"],
["País","Country","País","Pays"],
["Pedimos respeito nos comentários e que utilizem este espaço para compartilhar opiniões e experiências sobre o aplicativo.","We ask for respect in the comments and that you use this space to share opinions and experiences about the app.","Pedimos respeto en los comentarios y que uses este espacio para compartir opiniones y experiencias sobre la aplicación.","Nous demandons du respect dans les commentaires et d'utiliser cet espace pour partager des avis et expériences sur l'application."],
["Podes fechar em","You can close in","Puedes cerrar en","Tu peux fermer dans"],
["Pré-visualização","Preview","Vista previa","Aperçu"],
["Pré-visualização (toca numa opção para ver logo)","Preview (tap an option to see it right away)","Vista previa (toca una opción para verla al instante)","Aperçu (appuie sur une option pour la voir tout de suite)"],
["Próximo","Next","Siguiente","Suivant"],
["Próximo episódio","Next episode","Siguiente episodio","Épisode suivant"],
["Publicado por","Published by","Publicado por","Publié par"],
["Que tipo de letra preferes?","Which font do you prefer?","¿Qué tipo de letra prefieres?","Quelle police préfères-tu ?"],
["Recomendações","Recommendations","Recomendaciones","Recommandations"],
["Se aparecer “Verificar se é humano”, clique nele e deixe o anúncio carregar por completo.","If “Verify you are human” appears, click it and let the ad load completely.","Si aparece “Verificar que eres humano”, haz clic y deja que el anuncio cargue por completo.","Si « Vérifier que vous êtes humain » apparaît, cliquez dessus et laissez la publicité se charger entièrement."],
["Seja bem-vindo à Webplay","Welcome to Webplay","Bienvenido a Webplay","Bienvenue sur Webplay"],
["Sem curvas no topo","No curves at the top","Sin curvas arriba","Sans courbes en haut"],
["Sem informações adicionais.","No additional information.","Sin información adicional.","Aucune information supplémentaire."],
["Sem ligação à internet.","No internet connection.","Sin conexión a internet.","Pas de connexion internet."],
["Sem nome","No name","Sin nombre","Sans nom"],
["Sem nome no topo — o conteúdo sobe","No name at the top — the content moves up","Sin nombre arriba — el contenido sube","Sans nom en haut — le contenu monte"],
["Sem partilha direta neste aparelho. Link copiado — a abrir a Play Store…","No direct sharing on this device. Link copied — opening the Play Store…","Sin compartir directo en este dispositivo. Enlace copiado — abriendo Play Store…","Pas de partage direct sur cet appareil. Lien copié — ouverture du Play Store…"],
["Sem sinopse disponível.","No synopsis available.","Sin sinopsis disponible.","Aucun synopsis disponible."],
["Sem trailer disponível.","No trailer available.","Sin tráiler disponible.","Aucune bande-annonce disponible."],
["Sem título","Untitled","Sin título","Sans titre"],
["Sem vídeos.","No videos.","Sin vídeos.","Aucune vidéo."],
["Servidores em","Servers in","Servidores en","Serveurs en"],
["Série","Series","Serie","Série"],
["Só manual: usa o tema que escolher abaixo.","Manual only: uses the theme you pick below.","Solo manual: usa el tema que elijas abajo.","Manuel uniquement : utilise le thème choisi ci-dessous."],
["Tentar de novo","Try again","Intentar de nuevo","Réessayer"],
["Tira o nome e sobe para o topo","Removes the name and moves up to the top","Quita el nombre y sube arriba","Retire le nom et remonte en haut"],
["Tirado de","Taken from","Tomado de","Tiré de"],
["Toca no ⬇ do episódio que queres baixar.","Tap the ⬇ of the episode you want to download.","Toca el ⬇ del episodio que quieres descargar.","Appuie sur le ⬇ de l'épisode que tu veux télécharger."],
["Toca em ⬇ no episódio ou filme; o 1DM abre a página do vídeo.","Tap ⬇ on the episode or movie; 1DM opens the video page.","Toca ⬇ en el episodio o película; 1DM abre la página del vídeo.","Appuie sur ⬇ sur l'épisode ou le film ; 1DM ouvre la page de la vidéo."],
["Toca numa opção para ver logo o resultado. Podes mudar depois no perfil (Aa).","Tap an option to see the result right away. You can change it later in your profile (Aa).","Toca una opción para ver el resultado al instante. Puedes cambiarlo después en el perfil (Aa).","Appuie sur une option pour voir le résultat tout de suite. Tu pourras le changer plus tard dans ton profil (Aa)."],
["Tudo desligado: usa o tema Escuro.","Everything off: uses the Dark theme.","Todo desactivado: usa el tema Oscuro.","Tout désactivé : utilise le thème Sombre."],
["Ver mais","See more","Ver más","Voir plus"],
["Ver menos","See less","Ver menos","Voir moins"],
["Ver todos os comentários","See all comments","Ver todos los comentarios","Voir tous les commentaires"],
["Vídeo","Video","Vídeo","Vidéo"],
["Webplay — filmes e séries. Instala a app:","Webplay — movies and series. Install the app:","Webplay — películas y series. Instala la app:","Webplay — films et séries. Installe l'app :"],
["antes de baixar, primeiro configure o 1DM. Escolha um local de armazenamento.","before downloading, set up 1DM first. Choose a storage location.","antes de descargar, configura primero 1DM. Elige una ubicación de almacenamiento.","avant de télécharger, configurez d'abord 1DM. Choisissez un emplacement de stockage."],
["avaliação","rating","valoración","avis"],
["avaliações","ratings","valoraciones","avis"],
["Últimas avaliações","Latest ratings","Últimas valoraciones","Derniers avis"],
["continuação","sequel","continuación","suite"],
["escolhe a temporada, depois vê os episódios","pick a season, then see the episodes","elige la temporada, luego ve los episodios","choisis la saison, puis vois les épisodes"],
["escolher local de armazenamento","choose storage location","elegir ubicación de almacenamiento","choisir l'emplacement de stockage"],
["francês","French","francés","français"],
["inglês","English","inglés","anglais"],
["português","Portuguese","portugués","portugais"],
["espanhol","Spanish","español","espagnol"],
["lançado","released","estrenado","sorti"],
["mais úteis","most helpful","más útiles","plus utiles"],
["quanto já assistiu","how much you've watched","cuánto has visto","ce que tu as regardé"],
["segundos). Esta mensagem aparece só uma vez.","seconds). This message appears only once.","segundos). Este mensaje aparece solo una vez.","secondes). Ce message n'apparaît qu'une fois."],
["segundos. Clique em “Verificar se é humano”, se aparecer, e deixe o anúncio carregar por completo.","seconds. Click “Verify you are human” if it appears, and let the ad load completely.","segundos. Haz clic en “Verificar que eres humano”, si aparece, y deja que el anuncio cargue por completo.","secondes. Cliquez sur « Vérifier que vous êtes humain » s'il apparaît et laissez la publicité se charger entièrement."],
["toque para o próximo anúncio","tap for the next ad","toca para el siguiente anuncio","appuie pour la publicité suivante"],
["ver todos","see all","ver todos","voir tout"],
["Episódios","Episodes","Episodios","Épisodes"],
["Temporadas","Seasons","Temporadas","Saisons"],
["últimos lançamentos","latest releases","últimos estrenos","dernières sorties"],
["Últimos Episódios (ampliação):","Latest episodes (expanded):","Últimos episodios (ampliación):","Derniers épisodes (agrandi) :"],
["Abrir no YouTube","Open on YouTube","Abrir en YouTube","Ouvrir sur YouTube"],
["Pular","Skip","Omitir","Passer"],
["Pronto","Done","Listo","Terminé"],
["Favoritos","Favorites","Favoritos","Favoris"],
["Mostrar","Show","Mostrar","Afficher"],
["Repor Webplay","Reset Webplay","Restablecer Webplay","Réinitialiser Webplay"],
["Dentro do app:","Inside the app:","Dentro de la app:","Dans l'app :"],
["Pasta · Temporada","Folder · Season","Carpeta · Temporada","Dossier · Saison"],
["Siga-nos nas redes sociais","Follow us on social media","Síguenos en las redes sociales","Suivez-nous sur les réseaux sociaux"],
["Direitos reservados","All rights reserved","Todos los derechos reservados","Tous droits réservés"]
  ];
  var RULES = {
    en:[[/^Velocidade: (.+)$/,"Speed: $1"],[/^Temporada (\d+)$/,"Season $1"],[/^Episódio (\d+)$/,"Episode $1"],[/^página (\d+) de (\d+)$/,"page $1 of $2"],[/^(\S+ )?Histórico — (.+)$/,"$1History — $2"],[/^Anúncio (\d+) de (\d+)$/,"Ad $1 of $2"],[/^Caro usuário, são (\d+) segundos\./,"Dear user, it's $1 seconds."],[new RegExp("^Caro usuário, são (\\d+) segundos\\. Clique em “Verificar se é humano”, se aparecer, e deixe o anúncio carregar por completo\\.$"),"Dear user, it’s $1 seconds. Click “Verify you are human” if it appears, and let the ad load completely."],[new RegExp("^Se aparecer “Verificar se é humano”, clique nele e deixe o anúncio carregar por completo \\((\\d+) segundos\\)\\. Esta mensagem aparece só uma vez\\.$"),"If “Verify you are human” appears, click it and let the ad load completely ($1 seconds). This message appears only once."],[new RegExp("^Resultados para \\\"(.+)\\\" em (.+)$"),"Results for \"$1\" in $2"],[new RegExp("^Resultados para \\\"(.+)\\\"$"),"Results for \"$1\""]],
    es:[[/^Velocidade: (.+)$/,"Velocidad: $1"],[/^Temporada (\d+)$/,"Temporada $1"],[/^Episódio (\d+)$/,"Episodio $1"],[/^página (\d+) de (\d+)$/,"página $1 de $2"],[/^(\S+ )?Histórico — (.+)$/,"$1Historial — $2"],[/^Anúncio (\d+) de (\d+)$/,"Anuncio $1 de $2"],[new RegExp("^Caro usuário, são (\\d+) segundos\\. Clique em “Verificar se é humano”, se aparecer, e deixe o anúncio carregar por completo\\.$"),"Estimado usuario, son $1 segundos. Haz clic en “Verificar que eres humano”, si aparece, y deja que el anuncio cargue por completo."],[new RegExp("^Se aparecer “Verificar se é humano”, clique nele e deixe o anúncio carregar por completo \\((\\d+) segundos\\)\\. Esta mensagem aparece só uma vez\\.$"),"Si aparece “Verificar que eres humano”, haz clic y deja que el anuncio cargue por completo ($1 segundos). Este mensaje aparece solo una vez."],[new RegExp("^Resultados para \\\"(.+)\\\" em (.+)$"),"Resultados para \"$1\" en $2"],[new RegExp("^Resultados para \\\"(.+)\\\"$"),"Resultados para \"$1\""]],
    fr:[[/^Velocidade: (.+)$/,"Vitesse : $1"],[/^Temporada (\d+)$/,"Saison $1"],[/^Episódio (\d+)$/,"Épisode $1"],[/^página (\d+) de (\d+)$/,"page $1 sur $2"],[/^(\S+ )?Histórico — (.+)$/,"$1Historique — $2"],[/^Anúncio (\d+) de (\d+)$/,"Publicité $1 sur $2"],[new RegExp("^Caro usuário, são (\\d+) segundos\\. Clique em “Verificar se é humano”, se aparecer, e deixe o anúncio carregar por completo\\.$"),"Cher utilisateur, cela prend $1 secondes. Cliquez sur « Vérifier que vous êtes humain » s’il apparaît et laissez la publicité se charger entièrement."],[new RegExp("^Se aparecer “Verificar se é humano”, clique nele e deixe o anúncio carregar por completo \\((\\d+) segundos\\)\\. Esta mensagem aparece só uma vez\\.$"),"Si « Vérifier que vous êtes humain » apparaît, cliquez dessus et laissez la publicité se charger entièrement ($1 secondes). Ce message n’apparaît qu’une fois."],[new RegExp("^Resultados para \\\"(.+)\\\" em (.+)$"),"Résultats pour \"$1\" dans $2"],[new RegExp("^Resultados para \\\"(.+)\\\"$"),"Résultats pour \"$1\""]]
  };
  var PREF = [["Não consegui atualizar os comentários recentes:","Couldn't update the recent comments:","No pude actualizar los comentarios recientes:","Impossible de mettre à jour les commentaires récents :"],
["Não consegui cancelar o teu voto:","Couldn't cancel your vote:","No pude cancelar tu voto:","Impossible d'annuler ton vote :"],
["Não consegui carregar as visualizações:","Couldn't load the views:","No pude cargar las visualizaciones:","Impossible de charger les vues :"],
["Não consegui carregar os comentários recentes:","Couldn't load the recent comments:","No pude cargar los comentarios recientes:","Impossible de charger les commentaires récents :"],
["Não consegui carregar os comentários:","Couldn't load the comments:","No pude cargar los comentarios:","Impossible de charger les commentaires :"],
["Não consegui carregar todos os comentários:","Couldn't load all the comments:","No pude cargar todos los comentarios:","Impossible de charger tous les commentaires :"],
["Não consegui enviar a tua resposta:","Couldn't send your reply:","No pude enviar tu respuesta:","Impossible d'envoyer ta réponse :"],
["Não consegui guardar o início de sessão no aparelho:","Couldn't save the sign-in on this device:","No pude guardar el inicio de sesión en el dispositivo:","Impossible d'enregistrer la connexion sur l'appareil :"],
["Não consegui juntar o catálogo manual:","Couldn't merge the manual catalog:","No pude unir el catálogo manual:","Impossible de fusionner le catalogue manuel :"],
["Não consegui ler os votos:","Couldn't read the votes:","No pude leer los votos:","Impossible de lire les votes :"],
["Não consegui publicar o comentário:","Couldn't publish the comment:","No pude publicar el comentario:","Impossible de publier le commentaire :"],
["Não consegui registar a tua resposta:","Couldn't record your reply:","No pude registrar tu respuesta:","Impossible d'enregistrer ta réponse :"],
["Não consegui registar a visualização:","Couldn't record the view:","No pude registrar la visualización:","Impossible d'enregistrer la vue :"],
["Não consegui registar o voto:","Couldn't record the vote:","No pude registrar el voto:","Impossible d'enregistrer le vote :"],
["Não foi possível concluir:","Couldn't complete:","No se pudo completar:","Impossible de terminer :"],
["Recomendações não carregaram:","Recommendations didn't load:","Las recomendaciones no cargaron:","Les recommandations n'ont pas chargé :"],
["Firebase do feed não pôde ser iniciado:","The feed's Firebase couldn't start:","Firebase del feed no pudo iniciarse:","Le Firebase du fil n'a pas pu démarrer :"],
["Firebase dos comentários não pôde ser iniciado:","The comments' Firebase couldn't start:","Firebase de los comentarios no pudo iniciarse:","Le Firebase des commentaires n'a pas pu démarrer :"],
["Correio do + indisponível:","The + mailbox is unavailable:","El buzón del + no está disponible:","La boîte du + est indisponible :"],
["Erro no JS do tema automático:","Error in the automatic theme JS:","Error en el JS del tema automático:","Erreur dans le JS du thème automatique :"],
["Erro em","Error in","Error en","Erreur dans"],
["Resultados para","Results for","Resultados para","Résultats pour"]];
  var IDX = { en:1, es:2, fr:3 }, MAP = {};
  if(IDX[L]) ROWS.forEach(function(r){ MAP[r[0]] = r[IDX[L]]; });

  function trad(s){
    if(L === "pt") return s;
    var t = s.trim(); if(!t) return s;
    var r = MAP[t];
    if(r == null){
      var m = t.match(/^([^A-Za-zÀ-ÿ0-9"'(]+?)\s*([A-Za-zÀ-ÿ].*)$/);
      if(m && MAP[m[2]] != null) r = m[1] + " " + MAP[m[2]];
    }
    if(r == null && RULES[L]){
      for(var i = 0; i < RULES[L].length; i++) if(RULES[L][i][0].test(t)){ r = t.replace(RULES[L][i][0], RULES[L][i][1]); break; }
    }
    if(r == null && IDX[L]){
      for(var k = 0; k < PREF.length; k++){
        if(t.indexOf(PREF[k][0]) === 0){ r = PREF[k][IDX[L]] + t.slice(PREF[k][0].length); break; }
      }
    }
    return r == null ? s : s.replace(t, r);
  }

  var ATTRS = ["placeholder","title","aria-label","alt"], PULAR = { SCRIPT:1, STYLE:1, TEXTAREA:1, CODE:1, NOSCRIPT:1 }, ocupado = false, agendado = 0;
  function varrer(raiz){
    if(L === "pt" || !raiz) return;
    ocupado = true;
    try{
      var w = document.createTreeWalker(raiz, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null), n;
      while((n = w.nextNode())){
        if(n.nodeType === 3){
          var p = n.parentNode;
          if(p && PULAR[p.nodeName]) continue;
          var v = trad(n.nodeValue); if(v !== n.nodeValue) n.nodeValue = v;
        } else {
          for(var i = 0; i < ATTRS.length; i++){
            var a = n.getAttribute && n.getAttribute(ATTRS[i]);
            if(a){ var b = trad(a); if(b !== a) n.setAttribute(ATTRS[i], b); }
          }
        }
      }
    }catch(e){}
    ocupado = false;
  }
  function agendar(){ if(agendado) return; agendado = setTimeout(function(){ agendado = 0; varrer(document.body); }, 150); }

  /* ===== escolher / guardar ===== */
  function definir(c){
    try{ localStorage.setItem(LS, c); }catch(e){}
    location.reload();
  }
  function nomeEscolha(){
    var e = escolha();
    return e === "auto" ? (trad("Automático") + " (" + NOMES[detectar()] + ")") : NOMES[e];
  }

  var CSS =
    ".wpi-ov{position:fixed;inset:0;z-index:2147483646;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,sans-serif}" +
    ".wpi-cx{background:var(--panel,#161a22);color:var(--ink,#eae6dd);border:1px solid var(--line,#232833);border-radius:18px;padding:22px;width:100%;max-width:340px;box-shadow:0 20px 50px rgba(0,0,0,.6)}" +
    ".wpi-cx h3{font-family:Georgia,serif;font-size:1.2rem;margin:0 0 4px;display:flex;align-items:center;gap:8px}" +
    ".wpi-cx h3 svg,.wpi-ic svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
    ".wpi-cx p{margin:0 0 14px;font-size:.85rem;opacity:.7}" +
    ".wpi-op{display:flex;justify-content:space-between;align-items:center;width:100%;margin-top:8px;padding:12px 14px;border-radius:12px;border:1px solid var(--line,#232833);background:transparent;color:inherit;font:inherit;font-size:.95rem;cursor:pointer;text-align:left}" +
    ".wpi-op:hover,.wpi-op.on{border-color:var(--accent,#e0a33c)}" +
    ".wpi-op small{opacity:.65;font-size:.78rem}" +
    ".wpi-ic{display:inline-flex;align-items:center;justify-content:center;cursor:pointer}" +
    ".perfil-idioma{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 0;padding:10px 12px;border:1px solid var(--line,#232833);border-radius:12px}" +
    ".perfil-idioma label{display:flex;align-items:center;gap:8px;font-size:.9rem}" +
    ".perfil-idioma label svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}" +
    ".perfil-idioma button{background:transparent;border:1px solid var(--line,#232833);color:inherit;border-radius:16px;padding:6px 12px;font:inherit;font-size:.82rem;cursor:pointer}" +
    ".wpi-flut{position:fixed;top:10px;right:10px;z-index:2147483645;width:38px;height:38px;border-radius:50%;background:var(--panel,#161a22);color:var(--ink,#eae6dd);border:1px solid var(--line,#232833)}";
  var GLOBO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>';

  function abrirEscolha(primeira){
    if(document.getElementById("wpiOv")) return;
    var ov = document.createElement("div"); ov.className = "wpi-ov"; ov.id = "wpiOv";
    var cx = document.createElement("div"); cx.className = "wpi-cx";
    cx.innerHTML = "<h3>" + GLOBO + "Idioma / Language</h3><p>" +
      (primeira ? "Escolha como quer usar o aplicativo. / Choose how to use the app." : "") + "</p>";
    var atual = escolha();
    function op(cod, texto, peq){
      var b = document.createElement("button"); b.type = "button"; b.className = "wpi-op" + (atual === cod ? " on" : "");
      b.innerHTML = "<span></span><small></small>"; b.firstChild.textContent = texto; b.lastChild.textContent = peq || (atual === cod ? "✓" : "");
      b.onclick = function(){ definir(cod); }; cx.appendChild(b);
    }
    op("auto", "Auto", NOMES[detectar()]);
    ORDEM.forEach(function(c){ op(c, NOMES[c]); });
    if(!primeira){
      var f = document.createElement("button"); f.type = "button"; f.className = "wpi-op"; f.textContent = "✕";
      f.onclick = function(){ ov.remove(); }; cx.appendChild(f);
      ov.addEventListener("click", function(e){ if(e.target === ov) ov.remove(); });
    }
    ov.appendChild(cx); document.body.appendChild(ov);
  }

  function emApp(){ return !!window.median || /; wv\)|WebPlayApp/i.test(navigator.userAgent || ""); }

  function montarUi(){
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    document.documentElement.lang = L;
    if(UI === "nenhuma") return;
    var busca = document.querySelector(".search"), perfil = document.querySelector("#profileOverlay .profile-body");
    if(UI === "auto" && (busca || perfil)){
      if(busca){   // lugar estratégico: ao lado da pesquisa
        var bt = document.createElement("button"); bt.type = "button"; bt.id = "btnIdioma";
        bt.className = "history-btn wpi-ic"; bt.title = "Idioma"; bt.setAttribute("aria-label","Idioma"); bt.innerHTML = GLOBO;
        bt.onclick = function(e){ e.stopPropagation(); abrirEscolha(false); };
        var h = document.getElementById("historyBtn"); busca.insertBefore(bt, h ? h.nextSibling : null);
      }
      if(perfil){  // dentro do perfil
        var row = document.createElement("div"); row.className = "perfil-idioma";
        row.innerHTML = "<label>" + GLOBO + "<span>Idioma</span></label><button type=\"button\"></button>";
        row.lastChild.textContent = nomeEscolha() + " ›"; row.lastChild.onclick = function(){ abrirEscolha(false); };
        var topo = perfil.querySelector(".perfil-topo"); perfil.insertBefore(row, topo ? topo.nextSibling : perfil.firstChild);
      }
    } else {
      var fl = document.createElement("button"); fl.type = "button"; fl.className = "wpi-ic wpi-flut"; fl.title = "Idioma / Language";
      fl.innerHTML = GLOBO; fl.onclick = function(){ abrirEscolha(false); }; document.body.appendChild(fl);
    }
    if(!guardado() && emApp()) abrirEscolha(true);   // 1ª vez no aplicativo
  }

  window.WPI = {
    lang: function(){ return L; },
    escolha: escolha,
    definir: definir,
    abrir: function(){ abrirEscolha(false); },
    tmdb: function(){ return LOCALE[L] || "pt-BR"; },
    locale: function(){ return LOCALE[L] || "pt-BR"; },
    t: trad,
    nomes: NOMES
  };

  function iniciar(){
    montarUi(); varrer(document.body);
    try{ new MutationObserver(function(){ if(!ocupado) agendar(); })
      .observe(document.body, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATTRS }); }catch(e){}
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
