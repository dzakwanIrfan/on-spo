import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = 'https://api.spotify.com/v1';
const ENDPOINT = '/me/top/tracks?time_range=long_term&limit=25';

const GetTopTracks = () => {
  const [active, setActive] = useState(false);
  const [token, setToken] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleGetTopTracks = async () => {
    try {
      setActive(!active);
      const response = await axios.get(API_BASE_URL + ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  return (
    <>
      <button 
        onClick={handleGetTopTracks} 
        className={`border-b-2 border-neutral-800 my-4 px-4 py-1 ${active ? 'border-2 border-blue-500' : ''}`}>
          Get Top 5 Tracks
      </button>
      {active ? 
        data?.items ? 
          <table className="text-neutral-800">
            <thead>
              <tr className="bg-neutral-100">
                <th className="px-4">#</th>
                <th className="px-4">Title</th>
                <th className="px-4">Singer</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => 
                <tr key={i}>
                  <td className="text-center">{i + 1}</td>
                  <td className="px-4">
                    <a href={item.external_urls.spotify} target="_blank" className="hover:text-blue-500">
                      {item.name}
                    </a>
                  </td>
                  <td className="px-4">
                    
                    <a href={item.artists[0].external_urls.spotify} target="_blank" className="hover:text-blue-500">{item.artists[0].name}</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table> 
        :   
        null 
      :
        null
        }
    </>
  );
};

export default GetTopTracks;
