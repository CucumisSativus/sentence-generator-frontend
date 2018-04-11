import axios from 'axios';
import '../domain/Haiku';
import '../domain/GenerateHaikuParams';
import '../domain/Haiku';

const ApiBase = axios.create({
    baseURL: `http://localhost:8080`
});

const HaikuApi = {
    generateHaiku(_params: GenerateHaikuParams): Promise<Haiku> {
        return (new Promise((resolve, reject) => {
            ApiBase.get('generate-haiku').then(resp => {
                console.log(resp);
                resolve(resp.data as Haiku);
            }).catch(exception => {
                console.log(exception);
            });
        }));
    }
};

export default HaikuApi;