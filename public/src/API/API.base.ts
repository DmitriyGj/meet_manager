class MeetingManagerAPI {
    baseURL = process.env.REACT_APP_API_BASE_URL;
    protocol = process.env.REACT_APP_API_PORTOCOL;
    port = process.env.REACT_APP_API_PORT;
}

export default new MeetingManagerAPI();