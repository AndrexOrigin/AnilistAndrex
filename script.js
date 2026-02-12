function renderizarAnimes(lista) {
    const container = document.getElementById('anime-container');
    container.innerHTML = '';

    lista.forEach((entry, index) => {
        const anime = entry.media;
        const porcentagem = anime.episodes ? (entry.progress / anime.episodes) * 100 : 0;
        const ehNota10 = entry.score === 10;
        const estudio = anime.studios.nodes[0] ? anime.studios.nodes[0].name : '---';
        const inicio = formatarData(entry.startedAt);
        const fim = formatarData(entry.completedAt);

        const card = document.createElement('div');
        card.className = `anime-card ${ehNota10 ? 'nota-10' : ''}`;
        card.style.animationDelay = `${index * 0.03}s`;

        card.innerHTML = `
            <div class="status-badge ${entry.status}">${traduzir(entry.status)}</div>
            ${ehNota10 ? '<div class="top-score-badge">⭐</div>' : ''}
            <img src="${anime.coverImage.large}" alt="Capa">
            
            <div class="anime-info">
                <span class="studio-tag">${estudio}</span>
                <h3>${anime.title.romaji}</h3>
                
                <div class="genres">
                    ${anime.genres.slice(0, 2).map(g => `<span>${g}</span>`).join('')}
                </div>

                <div class="stats">
                    <span>Ep: ${entry.progress}/${anime.episodes || '?'}</span>
                    <span class="nota-valor">⭐ ${entry.score || 'N/A'}</span>
                </div>

                <div class="date-info">
                    ${inicio ? `<div class="date-line"><b>Início:</b> <span>${inicio}</span></div>` : ''}
                    ${fim ? `<div class="date-line"><b>Fim:</b> <span>${fim}</span></div>` : ''}
                </div>

                <div class="progress-container">
                    <div class="progress-bar" style="width: ${porcentagem}%"></div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
