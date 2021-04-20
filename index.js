'use strict';
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Wreck = require('@hapi/wreck');


const init = async () => {
    const DATA_FIX_RATES = `${process.env.FIX_RATES_URL}${process.env.FIX_RATES_AUTH}`;
    const server = Hapi.server({
        port: 8080,
        host: process.env.LOCAL
    });

    await server.start();
    server.route({
        method: 'GET',
        path: '/index',
        handler: async (request, h) => {
            const { payload } = await Wreck.get(DATA_FIX_RATES);
            return JSON.parse(payload.toString());
        }
    });
    server.route({
        method: 'POST',
        path: '/rates',
        handler: async (request, h) => {
            try {
                const { incomingRates } = JSON.parse(request.payload);
                const { payload } = await Wreck.get(DATA_FIX_RATES);
                const { rates } = JSON.parse(payload.toString());
                incomingRates.map( (currentRate, index) => {
                    incomingRates[index]['conversion'] = rates[currentRate['targetExchange']] * rates[currentRate['incomingExchange']];
                    incomingRates[index]['feePercentage'] = (rates[currentRate['incomingExchange']] * rates[currentRate['targetExchange']]) * 100;
                });
                
                return {
                    incomingRates,
                }

            } catch (err) {
            
            }
        }
    });  
    
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();