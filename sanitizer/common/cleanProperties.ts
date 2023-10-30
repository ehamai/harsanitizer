import { REDACTED } from "../sanitizer";

const keywords: string[] = [
    'secret',
    'password',
    'pwd',
    'token',
    'connectionstring',
    'key'
];

// Recursively redacts all string properties which have a keywords in the name
// If cleanAllProperties is true, then will clean all string properties found
export const cleanProperties = (obj: any, callingRule: string, cleanAllProperties = false) => {
    if(typeof obj !== 'object' || obj === null ){
        return;
    }

    if(Array.isArray(obj)){
        // This could happen if there are nested arrays
        for(const item of obj){
            cleanProperties(item, callingRule, cleanAllProperties);
        }
    }

    for(const key of Object.keys(obj)){
        const value = obj[key];

        // We're assuming that all secrets are string for now
        if(typeof value === 'string' || value instanceof String){
            if(cleanAllProperties){
                console.log(`[${callingRule}] Redacting value of property: ${key}`);
                obj[key] = REDACTED;
            } else{
                for(const keyword of keywords){
                    if(key.toLowerCase().indexOf(keyword.toLowerCase()) > -1){
                        console.log(`[${callingRule}] Redacting value of property: ${key}`);
                        obj[key] = REDACTED;
                    }
                }
            }
        } else if(typeof value === 'object' && !Array.isArray(value) && value !== null){
            cleanProperties(value, callingRule, cleanAllProperties);
        } else if(Array.isArray(value)){
            for(const item of value){
                cleanProperties(item, callingRule, cleanAllProperties);
            }
        }
    }
}

