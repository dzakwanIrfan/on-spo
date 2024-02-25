import React, { useEffect, useState } from "react";
import axios from "axios";
import queryString from "query-string";
import GetTopTracks from "./components/getTopTracks";

const CLIENT_ID = "d04ef5bbf1f54f2389e55cc5447fa681";
const CLIENT_SECRET = "57dbd0af9d7c480e9e189fda85fdbac0";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const URI = "http://localhost:3000/content";
const SPACE_DELIMITER = "%20";
const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-read-private",
    "user-top-read"
];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

const Content = () => {
  const [accessTokenReady, setAccessTokenReady] = useState(false);

  const handleLogin = () => {
    const state = generateRandomString(16);
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${URI}&scope=${SCOPES_URL_PARAM}&response_type=code&show_dialog=true&state=${state}`;
  };

  let searchParams = new URLSearchParams(window.location.search);
  let state = searchParams.get("state") || null;
  let code = searchParams.get("code") || null;
  const [profile, setProfile] = useState('');

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        if (state && code) {
          const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            queryString.stringify({
              code: code,
              redirect_uri: URI,
              grant_type: "authorization_code",
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              auth: {
                username: CLIENT_ID,
                password: CLIENT_SECRET,
              },
            }
          );

        const fetchProfile = async () => {
            try {
                if(response.data.access_token){
                    const result = await axios.get('https://api.spotify.com/v1/me', {
                        headers: {
                            Authorization: `Bearer ${response.data.access_token}`
                        }
                    });
                    console.log(result.data);
                    setProfile(result.data);
                }
            } catch (error) {
                console.log(error);
            }
        }

        
        localStorage.clear();
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("token_type", response.data.token_type);
        localStorage.setItem("scope", response.data.scope);
        localStorage.setItem("expires_in", response.data.expires_in);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        setTimeout(() => {
            fetchProfile();
        }, 1000)
        setAccessTokenReady(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccessToken();
  }, [state, code]);

    const handleLogout = () => {
        localStorage.clear();
        window.location = "http://localhost:3000/content";
    }

  // Render only when access token is ready
  if (!accessTokenReady) {
    return (
      <div className="container mx-auto text-neutral-800 mt-8">
        <h1 className="text-4xl font-semibold">Fitur mirip kaya Receiptify</h1>
        <button
          className="mt-4 px-4 py-1 text-lg bg-blue-500 text-neutral-50 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login ke Spotify dulu
        </button>
      </div>
    );
  }

  // Render content when access token is ready
  return (
    <div className="container mx-auto text-neutral-800 mt-8 mb-40">
      {profile ? ( 
        <>
          <h1 className="text-4xl font-semibold">
            Halo{" "}
            <a
              href={profile.external_urls.spotify}
              className="hover:text-blue-500 underline"
              target="_blank"
              rel="noreferrer"
            >
              {profile.display_name}
            </a>
          </h1>
          <GetTopTracks />
          <br />
          <button
            onClick={handleLogout}
            className="bg-blue-500 rounded px-2 text-neutral-50"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Content;
