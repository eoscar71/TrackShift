import React, { Component } from 'react';
import axios from 'axios';

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
class AuthRedirect extends Component {
    state = {
        message: "Authenticating..."
    };

    async authenticateSpotifyUser() {
        const { urlParams } = this.props;
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
    render() {
        this.authenticateSpotifyUser();

        return (this.state.message);
    }
}
 
export default AuthRedirect;