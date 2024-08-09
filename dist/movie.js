var _a, _b;
import { fetchMedia, buildMediaUrl } from './main.js';
document.addEventListener("DOMContentLoaded", async () => {
    const API_KEY = '1bc15873d134f6dceb7eb2a0565d5385';
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");
    const searchBar = document.querySelector("#search-input");
    const searchContainer = document.getElementById("search");
    const searchResultsContainer = document.getElementById("search-results-container");
    const movieDetailsElement = document.getElementById("movie-details");
    if (!movieDetailsElement) {
        console.error("Movie details element not found");
        return;
    }
    if (!movieId) {
        movieDetailsElement.innerHTML = "<p>Movie not found</p>";
        return;
    }
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
        if (!response.ok)
            throw new Error('Failed to fetch movie details');
        const movie = await response.json();
        const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${API_KEY}`);
        if (!imagesResponse.ok)
            throw new Error('Failed to fetch movie images');
        const images = await imagesResponse.json();
        const posterUrl = `https://image.tmdb.org/t/p/w500${images.posters[0].file_path}`;
        const genres = movie.genres.map((genre) => genre.name).join(", ");
        movieDetailsElement.innerHTML = `
            <div class="movie-content">
                <div class="movie-text">
                    <iframe src="https://vidsrc.cc/v2/embed/movie/${movieId}" frameborder="0"></iframe>
                    <h1>${movie.title}</h1>
                    <p>${movie.overview}</p>
                    <img src="${posterUrl}" alt="${movie.title}">
                    <span><strong>Release Date:</strong> ${movie.release_date}</span>
                    <span><strong>Genres:</strong> ${genres}</span>
                    <span><strong>Runtime:</strong> ${movie.runtime} minutes</span>
                    <span><strong>Rating:</strong> ${movie.vote_average} / 10</span>
                </div>
            </div>
        `;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        movieDetailsElement.innerHTML = `<p>${errorMessage}</p>`;
    }
    function populateSearchResults(media) {
        if (!searchResultsContainer) {
            console.error('Search results container not found');
            return;
        }
        searchResultsContainer.innerHTML = '';
        if (media.length === 0) {
            searchResultsContainer.innerHTML = '<p>No media found</p>';
            return;
        }
        media.forEach(item => {
            const resultItem = document.createElement("div");
            resultItem.className = "search-result-item";
            const resultPoster = document.createElement("img");
            resultPoster.src = `https://image.tmdb.org/t/p/w500${item.posterPath}`;
            resultPoster.alt = item.title;
            const resultInfo = document.createElement("div");
            const resultTitle = document.createElement("h3");
            resultTitle.textContent = item.title;
            resultInfo.appendChild(resultTitle);
            resultItem.appendChild(resultPoster);
            resultItem.appendChild(resultInfo);
            searchResultsContainer.appendChild(resultItem);
            resultItem.addEventListener("click", () => {
                const page = item.type === 'movie' ? 'movie.html' : 'series.html';
                window.location.href = `${page}?id=${item.id}`;
            });
        });
        searchResultsContainer.classList.remove("hidden");
    }
    function handleSearch(query) {
        if (query.trim().length === 0) {
            searchResultsContainer === null || searchResultsContainer === void 0 ? void 0 : searchResultsContainer.classList.add("hidden");
            return;
        }
        Promise.all([
            fetchMedia(buildMediaUrl(`/search/movie`, query), 'movie'),
            fetchMedia(buildMediaUrl(`/search/tv`, query), 'tv')
        ])
            .then(([movies, tvSeries]) => {
            const combinedResults = [...movies, ...tvSeries];
            populateSearchResults(combinedResults);
        })
            .catch(error => console.error('Search error:', error));
    }
    searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("input", (event) => {
        const query = event.target.value;
        handleSearch(query);
    });
    // Handle "Enter" key press in the search bar
    searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent any default action like form submission
            const query = searchBar.value;
            console.log("Enter key pressed. Query:", query); // Debugging output
            handleSearch(query);
        }
    });
    // Handle expanding search bar
    if (searchContainer) {
        searchContainer.addEventListener("click", () => {
            searchContainer.classList.add("expanded");
            searchBar === null || searchBar === void 0 ? void 0 : searchBar.focus();
        });
        document.addEventListener("click", (event) => {
            if (!searchContainer.contains(event.target)) {
                searchContainer.classList.remove("expanded");
                searchResultsContainer === null || searchResultsContainer === void 0 ? void 0 : searchResultsContainer.classList.add("hidden"); // Hide results when search bar minimizes
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const homeButton = document.getElementById("home");
    if (homeButton) {
        homeButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }
    else {
        console.error("Home button element not found");
    }
});
(_a = document.getElementById("instagram")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    window.location.href = "https://www.instagram.com/stefanos_klb/";
});
(_b = document.getElementById("github")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    window.location.href = "https://github.com/StefanosKlb";
});
//# sourceMappingURL=movie.js.map