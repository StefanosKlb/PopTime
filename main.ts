interface Media {
    title: string;
    id: string;
    posterPath: string;
    type: 'movie' | 'tv';
}

const API_KEY = '1bc15873d134f6dceb7eb2a0565d5385';
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchMedia(url: string, type: 'movie' | 'tv'): Promise<Media[]> {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(`Fetched ${type}:`, data); // Log the fetched data
        return data.results.map((item: any) => ({
            title: type === 'movie' ? item.title : item.name,
            id: item.id,
            posterPath: item.poster_path || 'placeholder.jpg', // Default image if not available
            type,
        }));
    } catch (error) {
        console.error(`Fetch error (${type}):`, error);
        throw error;
    }
}

function buildMediaUrl(endpoint: string, query?: string): string {
    return `${BASE_URL}${endpoint}?api_key=${API_KEY}${query ? `&query=${encodeURIComponent(query)}` : ''}`;
}

function addMediaToList(media: Media) {
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

function populateMediaList(media: Media[]) {
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
    const searchBar = document.querySelector(".search-bar input") as HTMLInputElement;
    const showMoviesButton = document.getElementById("show-movies");
    const showTVButton = document.getElementById("show-tv");
    let currentType: 'movie' | 'tv' = 'movie';

    async function loadMedia(query?: string, type: 'movie' | 'tv' = 'movie') {
        try {
            const endpoint = query ? `/search/${type}` : `/${type}/popular`;
            const url = buildMediaUrl(endpoint, query);

            console.log(`Fetching ${type}s from: ${url}`);

            const media = await fetchMedia(url, type);
            populateMediaList(media);
        } catch (error) {
            console.error('Error loading media:', error);
            // Optional: Update the UI to inform users of the error
        }
    }

    // Load popular movies on page load
    loadMedia();

    searchBar?.addEventListener("input", (event) => {
        const query = (event.target as HTMLInputElement).value;
        loadMedia(query.length > 0 ? query : undefined, currentType);
    });

    showMoviesButton?.addEventListener("click", () => {
        currentType = 'movie';
        if (searchBar) searchBar.placeholder = 'Search for movies';
        loadMedia(undefined, 'movie');
    });

    showTVButton?.addEventListener("click", () => {
        currentType = 'tv';
        if (searchBar) searchBar.placeholder = 'Search for TV series';
        loadMedia(undefined, 'tv');
    });
});
