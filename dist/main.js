const API_KEY = '1bc15873d134f6dceb7eb2a0565d5385';
const BASE_URL = 'https://api.themoviedb.org/3';
export async function fetchMedia(url, type) {
    try {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results.map((item) => ({
            title: type === 'movie' ? item.title : item.name,
            id: item.id,
            posterPath: item.poster_path,
            type,
        }));
    }
    catch (error) {
        console.error(`Fetch error (${type}):`, error);
        throw error;
    }
}
export function buildMediaUrl(endpoint, query) {
    return `${BASE_URL}${endpoint}?api_key=${API_KEY}${query ? `&query=${encodeURIComponent(query)}` : ''}`;
}
function addMediaToList(media, containerId) {
    const mediaList = document.getElementById(containerId);
    if (!mediaList) {
        console.error(`Media list element with ID '${containerId}' not found`);
        return;
    }
    const mediaItem = document.createElement("div");
    mediaItem.className = "media-item";
    const mediaPoster = document.createElement("img");
    mediaPoster.src = `https://image.tmdb.org/t/p/w500${media.posterPath}`;
    mediaPoster.alt = media.title;
    const mediaTitle = document.createElement("h3");
    mediaTitle.textContent = media.title;
    mediaItem.appendChild(mediaPoster);
    mediaItem.appendChild(mediaTitle);
    mediaList.appendChild(mediaItem);
    mediaItem.addEventListener("click", () => {
        const page = media.type === 'movie' ? './public/movie.html' : './public/series.html';
        window.location.href = `${page}?id=${media.id}`;
    });
}
function populateMediaList(media, containerId) {
    const mediaList = document.getElementById(containerId);
    if (!mediaList) {
        console.error(`Media list element with ID '${containerId}' not found`);
        return;
    }
    mediaList.innerHTML = ''; // Clear the list before adding new items
    if (media.length === 0) {
        mediaList.innerHTML = '<p>No media found</p>';
        return;
    }
    media.forEach(item => addMediaToList(item, containerId));
}
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector("#search-input");
    const searchContainer = document.getElementById("search");
    const searchResultsContainer = document.getElementById("search-results-container");
    function initializeEventListeners() {
        var _a, _b, _c;
        searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("input", handleSearchInput);
        searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("keydown", handleSearchKeyDown);
        searchContainer === null || searchContainer === void 0 ? void 0 : searchContainer.addEventListener("click", expandSearchBar);
        document.addEventListener("click", handleDocumentClick);
        (_a = document.getElementById("home")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", loadMediaSections);
        (_b = document.getElementById("instagram")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => redirectToSocialMedia("https://www.instagram.com/stefanos_klb/"));
        (_c = document.getElementById("github")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => redirectToSocialMedia("https://github.com/StefanosKlb/"));
    }
    async function loadMediaSections() {
        const mediaEndpoints = [
            { endpoint: '/trending/movie/week', type: 'movie', containerId: 'treding-movies-list' },
            { endpoint: '/movie/top_rated', type: 'movie', containerId: 'top-rated-movies-list' },
            { endpoint: '/trending/tv/week', type: 'tv', containerId: 'treding-tv-list' },
            { endpoint: '/tv/top_rated', type: 'tv', containerId: 'top-rated-tv-list' }
        ];
        for (const { endpoint, type, containerId } of mediaEndpoints) {
            await loadSectionMedia(endpoint, type, containerId);
        }
    }
    async function loadSectionMedia(endpoint, type, containerId, query) {
        try {
            const url = buildMediaUrl(endpoint, query);
            const media = await fetchMedia(url, type);
            populateMediaList(media, containerId);
        }
        catch (error) {
            console.error(`Error loading media for ${containerId}:`, error);
        }
    }
    function populateSearchResults(media) {
        if (!searchResultsContainer)
            return;
        searchResultsContainer.innerHTML = media.length === 0 ? '<p>No media found</p>' : '';
        media.forEach(item => createSearchResultItem(item));
        searchResultsContainer.classList.remove("hidden");
    }
    function createSearchResultItem(item) {
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
        searchResultsContainer === null || searchResultsContainer === void 0 ? void 0 : searchResultsContainer.appendChild(resultItem);
        resultItem.addEventListener("click", () => redirectToMediaPage(item));
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
            .then(([movies, tvSeries]) => populateSearchResults([...movies, ...tvSeries]))
            .catch(error => console.error('Search error:', error));
    }
    function handleSearchInput(event) {
        const query = event.target.value;
        handleSearch(query);
    }
    function handleSearchKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch(searchBar.value);
        }
    }
    function expandSearchBar() {
        searchContainer === null || searchContainer === void 0 ? void 0 : searchContainer.classList.add("expanded");
        searchBar === null || searchBar === void 0 ? void 0 : searchBar.focus();
    }
    function handleDocumentClick(event) {
        if (!(searchContainer === null || searchContainer === void 0 ? void 0 : searchContainer.contains(event.target))) {
            searchContainer === null || searchContainer === void 0 ? void 0 : searchContainer.classList.remove("expanded");
            searchResultsContainer === null || searchResultsContainer === void 0 ? void 0 : searchResultsContainer.classList.add("hidden");
        }
    }
    function redirectToSocialMedia(url) {
        window.location.href = url;
    }
    function redirectToMediaPage(item) {
        const page = item.type === 'movie' ? './public/movie.html' : './public/series.html';
        window.location.href = `${page}?id=${item.id}`;
    }
    // Initialize
    loadMediaSections();
    initializeEventListeners();
});
//# sourceMappingURL=main.js.map