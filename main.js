"use strict";
const API_KEY = '1bc15873d134f6dceb7eb2a0565d5385';
function fetchMoviesBySearch(query) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const movies = JSON.parse(xhr.responseText).results.map((movie) => ({
                    title: movie.title,
                    id: movie.id,
                    posterPath: movie.poster_path // Get the poster path
                }));
                resolve(movies);
            }
            else {
                reject(new Error('Failed to fetch movies'));
            }
        };
        xhr.send();
    });
}
function fetchPopularMovies() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const movies = JSON.parse(xhr.responseText).results.map((movie) => ({
                    title: movie.title,
                    id: movie.id,
                    posterPath: movie.poster_path // Get the poster path
                }));
                resolve(movies);
            }
            else {
                reject(new Error('Failed to fetch popular movies'));
            }
        };
        xhr.send();
    });
}
function addMovieToList(movie) {
    const movieList = document.getElementById("movie-list");
    if (!movieList)
        return;
    const movieItem = document.createElement("div");
    movieItem.className = "movie-item";
    const moviePoster = document.createElement("img");
    moviePoster.src = movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : 'placeholder.jpg'; // Placeholder for missing images
    moviePoster.alt = movie.title;
    const movieTitle = document.createElement("h3");
    movieTitle.textContent = movie.title;
    movieItem.appendChild(moviePoster);
    movieItem.appendChild(movieTitle);
    movieList.appendChild(movieItem);
    movieItem.addEventListener("click", () => {
        window.location.href = `movie.html?id=${movie.id}`;
    });
}
function populateMovieList(movies) {
    const movieList = document.getElementById("movie-list");
    if (!movieList)
        return;
    movieList.innerHTML = ''; // Clear the list before adding new items
    movies.forEach(addMovieToList);
}
document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-bar input");
    // Load popular movies on page load
    fetchPopularMovies()
        .then(movies => {
        populateMovieList(movies);
    })
        .catch(error => {
        console.error(error.message);
    });
    searchBar === null || searchBar === void 0 ? void 0 : searchBar.addEventListener("input", (event) => {
        const query = event.target.value;
        if (query.length > 0) {
            fetchMoviesBySearch(query)
                .then(movies => {
                populateMovieList(movies);
            })
                .catch(error => {
                console.error(error.message);
            });
        }
        else {
            // Reload popular movies if search is empty
            fetchPopularMovies()
                .then(movies => {
                populateMovieList(movies);
            })
                .catch(error => {
                console.error(error.message);
            });
        }
    });
});
