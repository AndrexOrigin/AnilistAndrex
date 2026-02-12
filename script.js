async function carregarAniList() {
    const usuario = 'AndrexOrigin'; // <--- COLOQUE SEU NICK AQUI
    
    // Essa é a "pergunta" (Query) que fazemos ao servidor do AniList
    const query = `
    query ($name: String) {
      MediaListCollection(userName: $name, type: ANIME) {
        lists {
          entries {
            score(format: POINT_10)
            media {
              title { romaji }
              coverImage { large }
            }
          }
        }
      }
    }
    `;

    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: { name: usuario }
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        const container = document.getElementById('anime-container');
        container.innerHTML = '';

        // O AniList organiza por listas (Watching, Completed, etc)
        // Vamos pegar todos os animes de todas as suas listas
        const todasAsListas = data.data.MediaListCollection.lists;
        
       // Substitua o seu lista.entries.forEach por este:
        let delay = 0;
        todasAsListas.forEach(lista => {
            lista.entries.forEach(entry => {
                const card = document.createElement('div');
                card.className = 'anime-card';
                // Adiciona um pequeno atraso na animação de cada card
                card.style.animationDelay = `${delay}s`;
                delay += 0.05; 

                card.innerHTML = `
                    <img src="${entry.media.coverImage.large}" alt="${entry.media.title.romaji}">
                    <div class="anime-info">
                        <h3>${entry.media.title.romaji}</h3>
                        <span class="nota">⭐ ${entry.score > 0 ? entry.score : 'N/A'}</span>
                    </div>
                `;
                container.appendChild(card);
            });
        });

    } catch (error) {
        console.error("Erro ao carregar AniList:", error);
        document.getElementById('anime-container').innerHTML = "<p>Erro ao carregar perfil. Verifique se o nick existe no AniList.</p>";
    }
}

carregarAniList();
