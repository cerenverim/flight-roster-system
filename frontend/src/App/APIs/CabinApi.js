import baseServiceApi from './baseServiceApi';
const getCabinCrew = async (type) => {
    try {
        const response = await baseServiceApi.get(`cabin_api/crew/${type}`);
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error during flight info:', error.response || error);
        if (error.response.status === 404) {
            return [];
        }
    }
}
export const CabinCrewApi = {
    getCabinCrew
};