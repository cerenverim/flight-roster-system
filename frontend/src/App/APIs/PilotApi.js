import baseServiceApi from './baseServiceApi';
const getFlightCrew = async (type) => {
    try {
        const response = await baseServiceApi.get(`pilot_api/pilots/${type}`);
        console.log(response);
        return response;
    }
    catch (error) {
        console.error('Error during flight info:', error.response || error);
        throw error;
    }
}
export const PilotApi = {
    getFlightCrew
};