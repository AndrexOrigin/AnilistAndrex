let todosAnimes = [];

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
            startedAt { year month day }
            completedAt { year month day }
            media {
              title { romaji }
              coverImage { large }
              episodes
              genres
              studios(isMain: true) {
                nodes { name }
              }
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
        todosAnimes = [];
        data.data.MediaListCollection.lists.forEach(lista => {
            todosAnimes.push(...lista.entries);
        });
        renderizarAnimes(todosAnimes);
    } catch (e) { console.error(e); }
}

function formatarData(dataObj) {
    if (!dataObj.year) return null;
    const d = dataObj.day ? String(dataObj.day).padStart(2, '0') : '??';
    const m = dataObj.month ? String(dataObj.month).padStart(2, '0') : '??';
    return `${d}/${m}/${dataObj.year}`;
}

function renderizarAnimes(lista) {
    const container = document.getElementById('anime-container');
    container.innerHTML = '';

    lista.forEach((entry, index) => {
        const anime = entry.media;
        const porcentagem = anime.episodes ? (entry.progress / anime.episodes) * 100 : 0;
        const ehNota10 = entry.score === 10;
        
        // Pega o nome do estúdio principal
        const estudio = anime.studios.nodes[0] ? anime.studios.nodes[0].name : 'Desconhecido';
        
        // Formata as datas
        const inicio = formatarData(entry.startedAt);
        const fim = formatarData(entry.completedAt);

        const card = document.createElement('div');
        card.className = `anime-card ${ehNota10 ? 'nota-10' : ''}`;
        card.style.animationDelay = `${index * 0.03}s`;

        card.innerHTML = `
            <div class="status-badge ${entry.status}">${traduzir(entry.status)}</div>
            ${ehNota10 ? '<div class="top-score-badge">👑</div>' : ''}
            <img src="${anime.coverImage.large}" alt="Capa">
            <div class="anime-info">
                <span class="studio-tag">🎬 ${estudio}</span>
                <h3>${anime.title.romaji}</h3>
                
                <div class="genres">
                    ${anime.genres.slice(0, 2).map(g => `<span>${g}</span>`).join('')}
                </div>

                <div class="stats">
                    <span>Ep: ${entry.progress}/${anime.episodes || '?'}</span>
                    <span style="${ehNota10 ? 'color: gold; font-weight: bold;' : ''}">⭐ ${entry.score || 'N/A'}</span>
                </div>

                <div class="date-info">
                    ${inicio ? `<span><b>Início:</b> ${inicio}</span>` : ''}
                    ${fim ? `<span><b>Fim:</b> ${fim}</span>` : ''}
                </div>

                <div class="progress-container">
                    <div class="progress-bar" style="width: ${porcentagem}%"></div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Reutilize as funções de filtrarEOrdenar e traduzir do código anterior...
function filtrarEOrdenar() {
    let resultado = [...todosAnimes];
    const busca = document.getElementById('search-input').value.toLowerCase();
    if (busca) resultado = resultado.filter(item => item.media.title.romaji.toLowerCase().includes(busca));
    const status = document.getElementById('status-filter').value;
    if (status !== 'all') resultado = resultado.filter(item => item.status === status);
    const ordem = document.getElementById('sort-order').value;
    if (ordem === 'score') resultado.sort((a, b) => b.score - a.score);
    else if (ordem === 'title') resultado.sort((a, b) => a.media.title.romaji.localeCompare(b.media.title.romaji));
    else if (ordem === 'progress') resultado.sort((a, b) => b.progress - a.progress);
    renderizarAnimes(resultado);
}

document.getElementById('search-input').addEventListener('input', filtrarEOrdenar);
document.getElementById('status-filter').addEventListener('change', filtrarEOrdenar);
document.getElementById('sort-order').addEventListener('change', filtrarEOrdenar);

function traduzir(status) {
    const t = { 'COMPLETED': 'Concluído', 'CURRENT': 'Assistindo', 'PLANNING': 'Planejado', 'DROPPED': 'Dropado', 'PAUSED': 'Pausado' };
    return t[status] || status;
}

carregarAniList();
