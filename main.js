"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_KEY = '1bc15873d134f6dceb7eb2a0565d5385';
const BASE_URL = 'https://api.themoviedb.org/3';
function fetchMedia(url, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            if (!response.ok)
                throw new Error('Network response was not ok');
            const data = yield response.json();
            console.log(`Fetched ${type}:`, data); // Log the fetched data
            return data.results.map((item) => ({
                title: type === 'movie' ? item.title : item.name,
                id: item.id,
                posterPath: item.poster_path || 'placeholder.jpg', // Default image if not available
                type,
            }));
        }
        catch (error) {
            console.error(`Fetch error (${type}):`, error);
            throw error;
        }
    });
}
function buildMediaUrl(endpoint, query) {
    return `${BASE_URL}${endpoint}?api_key=${API_KEY}${query ? `&query=${encodeURIComponent(query)}` : ''}`;
}
function addMediaToList(media) {
    const mediaList = document.getElementById("media-list"); // Using media-list ID
    if (!mediaList) {
        console.error('Media list element not found');
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
        const page = media.type === 'movie' ? 'movie.html' : 'series.html';
        window.location.href = `${page}?id=${media.id}`;
    });
}
function populateMediaList(media) {
    const mediaList = document.getElementById("media-list"); // Using media-list ID
    if (!mediaList) {
        console.error('Media list element not found');
        return;
    }
    mediaList.innerHTML = ''; // Clear the list before adding new items
    if (media.length === 0) {
        mediaList.innerHTML = '<p>No media found</p>';
        return;
    }
    media.forEach(addMediaToList);
}
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar input");
    const showMoviesButton = document.getElementById("show-movies");
    const showTVButton = document.getElementById("show-tv");
    let currentType = 'movie';
    function loadMedia(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, type = 'movie') {
            try {
                const endpoint = query ? `/search/${type}` : `/${type}/popular`;
                const url = buildMediaUrl(endpoint, query);
                console.log(`Fetching ${type}s from: ${url}`);
                const media = yield fetchMedia(url, type);
                populateMediaList(media);
            }
            catch (error) {
                console.error('Error loading media:', error);
                // Optional: Update the UI to inform users of the error
            }
        });
    }
    // Load popular movies on page load
    loadMedia();
    searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("input", (event) => {
        const query = event.target.value;
        loadMedia(query.length > 0 ? query : undefined, currentType);
    });
    showMoviesButton === null || showMoviesButton === void 0 ? void 0 : showMoviesButton.addEventListener("click", () => {
        currentType = 'movie';
        if (searchBar)
            searchBar.placeholder = 'Search for movies';
        loadMedia(undefined, 'movie');
    });
    showTVButton === null || showTVButton === void 0 ? void 0 : showTVButton.addEventListener("click", () => {
        currentType = 'tv';
        if (searchBar)
            searchBar.placeholder = 'Search for TV series';
        loadMedia(undefined, 'tv');
    });
});
