import baseServiceApi from './baseServiceApi';
const getCabinCrew = async (type) => {
    try {
        const response = await baseServiceApi.get(`cabin_api/crew/${type}`);
        console.log(response);
        return response;
    }
    catch (error) {
        console.error('Error during flight info:', error.response || error);
        throw error;
    }
}
export const CabinCrewApi = {
    getCabinCrew
};