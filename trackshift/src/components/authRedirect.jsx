import React, { Component } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
class AuthRedirect extends Component {
    state = {
        message: "Authenticating..."
    };

    async authenticateSpotifyUser() {
        const { urlParams } = this.props;
        Cookie.remove('platformToAuth');
        if(urlParams.get('code') && urlParams.get('state'))
        {
            const successfulAuth = await axios.post('http://localhost:3900/api/auth/spotify/callback', {
                code: urlParams.get('code'),
                state: urlParams.get('state'),
            });

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
            const successfulAuth = await axios.post('http://localhost:3900/api/auth/youtube/callback', {
                code: urlParams.get('code'),
            });

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
    render() {
        let platformToAuth = Cookie.get('platformToAuth');
        
        if(platformToAuth==='spotify')
            this.authenticateSpotifyUser();
        else if(platformToAuth==='youtube')
            this.authenticateYoutubeUser();

        return (this.state.message);
    }
}
 
export default AuthRedirect;