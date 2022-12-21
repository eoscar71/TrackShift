const config = require("config");

module.exports = function() {
    if (!config.get("jwtPrivateKey")) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }

    if (!config.get("spotify_client_id")) {
        throw new Error('FATAL ERROR: spotify_client_id is not defined.');
    }

    if (!config.get("spotify_client_secret")) {
        throw new Error('FATAL ERROR: spotify_client_secret is not defined.');
    }

    if (!config.get("youtube_client_id")) {
        throw new Error('FATAL ERROR: youtube_client_id is not defined.');
    }

    if (!config.get("youtube_client_secret")) {
        throw new Error('FATAL ERROR: youtube_client_secret is not defined.');
    }

    if (!config.get("deezer_client_id")) {
        throw new Error('FATAL ERROR: deezer_client_id is not defined.');
    }

    if (!config.get("deezer_client_secret")) {
        throw new Error('FATAL ERROR: deezer_client_secret is not defined.');
    }
};