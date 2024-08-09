"use strict";
var _a, _b;
document.addEventListener("DOMContentLoaded", async () => {
    const API_KEY = '1bc15873d134f6dceb7eb2a0565d5385';
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = urlParams.get("id");
    const seriesDetailsElement = document.getElementById("series-details");
    if (!seriesId) {
        seriesDetailsElement.innerHTML = "<p>Series not found</p>";
        return;
    }
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${API_KEY}`);
        if (!response.ok)
            throw new Error('Failed to fetch series details');
        const series = await response.json();
        const imagesResponse = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/images?api_key=${API_KEY}`);
        if (!imagesResponse.ok)
            throw new Error('Failed to fetch series images');
        const images = await imagesResponse.json();
        const posterUrl = `https://image.tmdb.org/t/p/w500${images.posters[0].file_path}`;
        const genres = series.genres.map((genre) => genre.name).join(", ");
        seriesDetailsElement.innerHTML = `
            <div class="series-content">
                <div class="series-text">
                    <iframe id="series-iframe" src="https://vidsrc.xyz/embed/tv/${seriesId}" frameborder="0"></iframe>
                    <h1>${series.name}</h1>
                    <p>${series.overview}</p>
                    <div class="select-container">
                        <select id="season-select"></select>
                        <select id="episode-select"></select>
                    </div>
                    <img src="${posterUrl}" alt="${series.name}">
                    <span><strong>Genres:</strong> ${genres}</span>
                    <span><strong>Rating:</strong> ${series.vote_average} / 10</span>
                </div>
            </div>
        `;
        const seasonSelect = document.getElementById("season-select");
        const episodeSelect = document.getElementById("episode-select");
        const seriesIframe = document.getElementById("series-iframe");
        series.seasons.forEach((season) => {
            if (season.season_number !== 0) {
                const option = document.createElement("option");
                option.value = season.season_number.toString();
                option.textContent = `Season ${season.season_number}`;
                seasonSelect.appendChild(option);
            }
        });
        async function updateEpisodes(seasonNumber) {
            const seasonResponse = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${API_KEY}`);
            if (!seasonResponse.ok)
                throw new Error('Failed to fetch season details');
            const season = await seasonResponse.json();
            episodeSelect.innerHTML = ''; // Clear previous episodes
            season.episodes.forEach((episode) => {
                const option = document.createElement("option");
                option.value = episode.episode_number.toString();
                option.textContent = `Episode ${episode.episode_number} - ${episode.name}`;
                episodeSelect.appendChild(option);
            });
            if (season.episodes.length > 0) {
                episodeSelect.value = season.episodes[0].episode_number.toString();
                seriesIframe.src = `https://vidsrc.cc/v2/embed/tv/${seriesId}/${seasonNumber}/${episodeSelect.value}`;
            }
        }
        seasonSelect.addEventListener("change", () => {
            const seasonNumber = parseInt(seasonSelect.value);
            updateEpisodes(seasonNumber);
        });
        episodeSelect.addEventListener("change", () => {
            const seasonNumber = parseInt(seasonSelect.value);
            const episodeNumber = parseInt(episodeSelect.value);
            seriesIframe.src = `https://vidsrc.cc/v2/embed/tv/${seriesId}/${seasonNumber}/${episodeNumber}`;
        });
        // Trigger the change event to load the episodes of the first season
        seasonSelect.dispatchEvent(new Event('change'));
    }
    catch (error) {
        if (error instanceof Error) {
            seriesDetailsElement.innerHTML = `<p>${error.message}</p>`;
        }
        else {
            seriesDetailsElement.innerHTML = `<p>An unknown error occurred</p>`;
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const homeButton = document.getElementById("home");
    homeButton === null || homeButton === void 0 ? void 0 : homeButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});
(_a = document.getElementById("instagram")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.location.href = "https://www.instagram.com/stefanos_klb/";
});
(_b = document.getElementById("github")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    window.location.href = "https://github.com/StefanosKlb";
});
//# sourceMappingURL=series.js.map