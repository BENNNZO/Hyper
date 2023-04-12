import axios from 'axios';

export const authToken = async () => await axios.get('/meeting/get-token')

export const createMeeting = async ({ token }) => {
    const authTokenEl = await authToken()
    console.log(authTokenEl.data.token)
    const res = await axios.post('https://api.videosdk.live/v2/rooms', {}, {
        authorization: authTokenEl.data.token,
    })
    const { roomId } = await res.json()
    return roomId
}