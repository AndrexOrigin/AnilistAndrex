let todosAnimes = []; // Memória para os filtros funcionar

async function carregarAniList() {
    const usuario = 'AndrexOrigin'; 
    const query = `
    query ($name: String) {
      MediaListCollection(userName: $name, type: ANIME) {
        lists {
          entries {
            status
            score(format: POINT_10)
            progress
            media {
              title { romaji }
              coverImage { large }
              episodes
              genres
            }
          }
        }
      }
    }
    `;

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query, variables: { name: usuario } })
        });

        const data = await response.json();
        
        // Organiza todos os animes em uma lista única
        todosAnimes = [];
        data.data.MediaListCollection.lists.forEach(lista => {
            todosAnimes.push(...lista.entries);
        });

        renderizarAnimes(todosAnimes);

    } catch (e) { console.error("Erro:", e); }
}

function renderizarAnimes(lista) {
    const container = document.getElementById('anime-container');
    container.innerHTML = '';

    lista.forEach((entry, index) => {
        const anime = entry.media;
        const porcentagem = anime.episodes ? (entry.progress / anime.episodes) * 100 : 0;
        
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.style.animationDelay = `${index * 0.05}s`;

        card.innerHTML = `
            <div class="status-badge ${entry.status}">${traduzir(entry.status)}</div>
            <img src="${anime.coverImage.large}" alt="Capa">
            <div class="anime-info">
                <h3>${anime.title.romaji}</h3>
                <div class="genres">
                    ${anime.genres.slice(0, 2).map(g => `<span>${g}</span>`).join('')}
                </div>
                <div class="stats">
                    <span>Ep: ${entry.progress}/${anime.episodes || '?'}</span>
                    <span>⭐ ${entry.score || 'N/A'}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${porcentagem}%"></div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funções de Busca e Filtro
document.getElementById('search-input').addEventListener('input', (e) => {
    const busca = e.target.value.toLowerCase();
    const filtrados = todosAnimes.filter(item => 
        item.media.title.romaji.toLowerCase().includes(busca)
    );
    renderizarAnimes(filtrados);
});

document.getElementById('status-filter').addEventListener('change', (e) => {
    const status = e.target.value;
    const filtrados = status === 'all' ? todosAnimes : todosAnimes.filter(item => item.status === status);
    renderizarAnimes(filtrados);
});

function traduzir(status) {
    const t = { 'COMPLETED': 'Concluído', 'CURRENT': 'Assistindo', 'PLANNING': 'Planejado', 'DROPPED': 'Dropado' };
    return t[status] || status;
}

carregarAniList();
