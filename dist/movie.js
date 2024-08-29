import { handleSearchInput, handleSearchKeyDown, expandSearchBar, handleDocumentClick, cloudinaryUrl } from './main.js';
document.addEventListener("DOMContentLoaded", async () => {
    var _a, _b;
    const API_KEY = '1bc15873d134f6dceb7eb2a0565d5385';
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");
    const searchBar = document.querySelector("#search-input");
    const searchContainer = document.getElementById("search");
    const movieDetailsElement = document.getElementById("movie-details");
    const homeButton = document.getElementById("home");
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
        const posterUrl = cloudinaryUrl(images.posters[0].file_path);
        const genres = movie.genres.map((genre) => genre.name).join(", ");
        movieDetailsElement.innerHTML = `
            <div class="movie-content">
                <div class="movie-text">
                    <iframe
                        src="https://vidsrc.cc/v2/embed/movie/${movieId}" 
                        allow="fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        frameborder="0">
                    </iframe>
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
    // Attach event listeners
    searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("input", handleSearchInput);
    searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("keydown", handleSearchKeyDown);
    if (searchContainer) {
        searchContainer.addEventListener("click", expandSearchBar);
        document.addEventListener("click", handleDocumentClick);
    }
    if (homeButton) {
        homeButton.addEventListener("click", () => {
            window.location.href = window.location.origin + '/index.html';
        });
    }
    else {
        console.error("Home button element not found");
    }
    (_a = document.getElementById("instagram")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        window.location.href = "https://www.instagram.com/stefanos_klb/";
    });
    (_b = document.getElementById("github")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        window.location.href = "https://github.com/StefanosKlb";
    });
});
//# sourceMappingURL=movie.js.map