//const prod = 'https://map-v3.onrender.com'
const prod = 'http://localhost:6060'
const ngrok = ''

export const UrlBase = {
    prod,
    ngrok
};

export const UrlBaseOriginal = {
    prod: `${prod}/v1/story`,
    ngrok: `${ngrok}/v1/story`,
};

export const UrlBaseChaptersOriginal = {
    prod: `${prod}/v1/mywork`,
    ngrok: `${ngrok}/v1/mywork`,
};