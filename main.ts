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
        return data.results.map((item: any) => ({
            title: type === 'movie' ? item.title : item.name,
            id: item.id,
            posterPath: item.poster_path,
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

function addMediaToList(media: Media, containerId: string) {
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
        const page = media.type === 'movie' ? 'movie.html' : 'series.html';
        window.location.href = `${page}?id=${media.id}`;
    });
}


function populateMediaList(media: Media[], containerId: string) {
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
    const searchBar = document.querySelector("#search-input") as HTMLInputElement;
    const searchContainer = document.getElementById("search");
    const searchResultsContainer = document.getElementById("search-results-container");
    let currentType: 'movie' | 'tv' = 'movie'; // Default to movies

    async function loadMediaSections() {
        loadSectionMedia('/trending/movie/week', 'movie', 'treding-movies-list');
        loadSectionMedia('/movie/top_rated', 'movie', 'top-rated-movies-list');
        loadSectionMedia('/trending/tv/week', 'tv', 'treding-tv-list');
        loadSectionMedia('/tv/top_rated', 'tv', 'top-rated-tv-list');
    }

    async function loadSectionMedia(
        endpoint: string,
        type: 'movie' | 'tv',
        containerId: string,
        query?: string
    ) {
        try {
            const url = buildMediaUrl(endpoint, query);
            const media = await fetchMedia(url, type);
            populateMediaList(media, containerId);
        } catch (error) {
            console.error(`Error loading media for ${containerId}:`, error);
        }
    }

    function populateSearchResults(media: Media[]) {
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

    function handleSearch(query: string) {
        if (query.trim().length === 0) {
            searchResultsContainer?.classList.add("hidden");
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

    searchBar?.addEventListener("input", (event) => {
        const query = (event.target as HTMLInputElement).value;
        handleSearch(query);
    });

    // Handle "Enter" key press in the search bar
    searchBar?.addEventListener("keydown", (event) => {
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
            searchBar?.focus();
        });

        document.addEventListener("click", (event) => {
            if (!searchContainer.contains(event.target as Node)) {
                searchContainer.classList.remove("expanded");
                searchResultsContainer?.classList.add("hidden"); // Hide results when search bar minimizes
            }
        });
    }

    // Load the initial media sections on page load
    loadMediaSections();

    // Event listener for "Home" button to reload the default sections
    document.getElementById("home")?.addEventListener("click", () => {
        loadMediaSections();
    });

    // Event listeners for social media buttons
    document.getElementById("instagram")?.addEventListener("click", () => {
        window.location.href = "https://www.instagram.com/stefanos_klb/";
    });

    document.getElementById("github")?.addEventListener("click", () => {
        window.location.href = "https://github.com/StefanosKlb/";
    });
});
