// import axios from './Axios';

// export const authToken = async () => await axios.get('/meeting/get-token')
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI4NDY3ZTEzZS1mMGIwLTQwYmEtYWE5Ni0yNzU3ZTQ3NmM2NzkiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4MTI3MTgyNiwiZXhwIjoxNjgzODYzODI2fQ.Gq5DQHjv2RdDYhScD2EszMp6L_xtmV9fqTLQc-qE58g"

export const createMeeting = async ({ token }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
      method: "POST",
      headers: {
        authorization: `${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    //Destructuring the roomId from the response
    const { roomId } = await res.json();
    return roomId;
  };