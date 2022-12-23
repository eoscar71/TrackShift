import React, { Component } from 'react';
import Cookie from 'js-cookie';
import * as Spotify from '../services/spotifyService';
import * as Deezer from '../services/deezerService';
import * as Youtube from '../services/youtubeService';

class AuthRedirect extends Component {
    state = {
        message: "Authenticating..."
    };

    async authenticateSpotifyUser() {
        const { urlParams } = this.props;
        Cookie.remove('platformToAuth');
        if(urlParams.get('code') && urlParams.get('state'))
        {
            const successfulAuth = await Spotify.finalizeAuth(urlParams.get("code"), urlParams.get("state"));
            
            if(successfulAuth)
            {
                localStorage['hasSpotifyAuth'] = true;
            }
            else
            {
                const message = 'Could not authenticate user.';
                this.setState({message});
            }
        }
    }

    async authenticateYoutubeUser() {
        const { urlParams } = this.props;
        Cookie.remove('platformToAuth');
        if(urlParams.get('code'))
        {
            const successfulAuth = await Youtube.finalizeAuth(urlParams.get('code'));

            if(successfulAuth)
            {
                localStorage['hasYoutubeAuth'] = true;
            }
            else
            {
                const message = 'Could not authenticate user.';
                this.setState({message});
            }
        }
    }

    async authenticateDeezerUser() {
        const { urlParams } = this.props;
        Cookie.remove('platformToAuth');
        if(urlParams.get('code'))
        {
            const successfulAuth = await Deezer.finalizeAuth(urlParams.get('code'));

            if(successfulAuth)
            {
                localStorage['hasDeezerAuth'] = true;
            }
            else
            {
                const message = 'Could not authenticate user.';
                this.setState({message});
            }
        }
    }
    render() {
        let platformToAuth = Cookie.get('platformToAuth');
        
        if(platformToAuth==='spotify')
            this.authenticateSpotifyUser();
        else if(platformToAuth==='youtube')
            this.authenticateYoutubeUser();
        else if(platformToAuth==='deezer')
            this.authenticateDeezerUser();

        return (this.state.message);
    }
}
 
export default AuthRedirect;