import React from "react";

export function Signin() {
    const handleSignin = () => {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "YOUR_CLIENT_ID";
        const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || "http://localhost:3000/api/auth/callback";
        const scope = "read:user user:email";
        const state = Math.random().toString(36).slice(2);
        localStorage.setItem("oauth_state", state);
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope,
            state,
            allow_signup: "true",
        });
        window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
    };

    return <button onClick={handleSignin}>Sign in with GitHub</button>;
}