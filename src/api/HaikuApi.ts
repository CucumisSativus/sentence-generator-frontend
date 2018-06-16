import axios from 'axios';
import '../domain/Haiku';
import '../domain/GenerateHaikuParams';
import '../domain/Haiku';

const ApiBase = axios.create({
    baseURL: (() => { 
        if (process.env.NODE_ENV !== 'production' ) {
            return `http://localhost:8080`;
        } else {
            console.log(process.env.REACT_APP_API_URL);
            return process.env.REACT_APP_API_URL;
        }
        
    })()
});

const HaikuApi = {

    generateHaiku(_params: GenerateHaikuParams): Promise<Haiku> {
        return (new Promise((resolve, reject) => {
            ApiBase.get('generate-haiku').then(resp => {
                resolve(resp.data as Haiku);
            }).catch(exception => {
                console.log(exception);
                reject(exception);
            });
        }));
    },

    getHaikuList(): Promise<Array<Haiku>> {
        return(new Promise((resolve, reject) => {
            ApiBase.get('haikus').then(resp =>
                resolve(resp.data as Array<Haiku>)
            ).catch(exception => {
                console.log(exception);
                reject(exception);
            });
        }));
    },

    saveHaiku(haiku: Haiku): Promise<Haiku> {
        return(new Promise((resolve, reject) => {
            ApiBase.post('save-haiku', haiku).then(resp =>
                resolve(haiku)
            ).catch(exception => {
                console.log(exception);
                reject(exception);
            });
        }));
    }
};

export default HaikuApi;