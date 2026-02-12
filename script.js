async function carregarAniList() {
    const usuario = 'AndrexOrigin'; // <--- Não esqueça de colocar seu nick
    
    // Agora pedimos: Progresso, Total de Episódios, Status, Gêneros e Média do site
    const query = `
    query ($name: String) {
      MediaListCollection(userName: $name, type: ANIME) {
        lists {
          name
          entries {
            status
            score(format: POINT_10)
            progress
            media {
              title { romaji }
              coverImage { large }
              episodes
              genres
              averageScore
              status
            }
          }
        }
      }
    }
    `;

    const url = 'https://graphql.anilist.co';
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query: query, variables: { name: usuario } })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        const container = document.getElementById('anime-container');
        container.innerHTML = '';

        let delay = 0;
        const todasAsListas = data.data.MediaListCollection.lists;
        
        todasAsListas.forEach(lista => {
            lista.entries.forEach(entry => {
                const anime = entry.media;
                const card = document.createElement('div');
                card.className = 'anime-card';
                card.style.animationDelay = `${delay}s`;
                delay += 0.05;

                // Lógica para cores de status
                const statusTraduzido = traduzirStatus(entry.status);
                const progressPercent = anime.episodes ? (entry.progress / anime.episodes) * 100 : 0;

                card.innerHTML = `
                    <div class="status-badge ${entry.status}">${statusTraduzido}</div>
                    <img src="${anime.coverImage.large}" alt="${anime.title.romaji}">
                    <div class="anime-info">
                        <h3>${anime.title.romaji}</h3>
                        
                        <div class="genres">
                            ${anime.genres.slice(0, 2).map(g => `<span>${g}</span>`).join('')}
                        </div>

                        <div class="stats">
                            <span>📱 Ep: ${entry.progress}/${anime.episodes || '?'}</span>
                            <span>⭐ ${entry.score || 'N/A'}</span>
                        </div>

                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${progressPercent}%"></div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        });

    } catch (error) {
        console.error(error);
    }
}

function traduzirStatus(status) {
    const nomes = {
        'COMPLETED': 'Concluído',
        'CURRENT': 'Assistindo',
        'DROPPED': 'Dropado',
        'PAUSED': 'Pausado',
        'PLANNING': 'Planejado'
    };
    return nomes[status] || status;
}

carregarAniList();
