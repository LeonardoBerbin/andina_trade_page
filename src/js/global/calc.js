import serch from "./serch.js";

export const calc = (data) => {
    if (!data) return Promise.reject("Invalid input data");
    
    return new Promise((resolve, reject) => {
        const promises = data.map(d => {
            if (d[0] > 1) {
                return serch("dhl_divisions", ["ZONE"], [null, d[1]], ["ZONE"])
                    .then(result => {
                        return dhl(result, d); // Adding the calculated price to the object
                    })
                    .catch(err => {
                        console.error(err);
                        return null; // Handling error by returning null for the price
                    });
            } 
            else {
                return serch('coord_divisions', ['ZONE', 'JOURNEY', 'DT'], [null, d[1]], ['ZONE', 'JOURNEY'])
                .then(result => {
                    return coord(result, d);
                })
                .catch(err => {
                    console.error(err);
                    return null;
                });
            }
        });

        Promise.all(promises)
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
};

const dhl = (res, data) => {
    if (!res || !res[0] || !res[0].ZONE) {
        console.error("Invalid response data for DHL calculation");
        return null;
    }

    const { ZONE } = res[0];
    const weight = Math.max(data[4]/5000, data[3]);
    const obj = {
        'Servicio': 'DHL',
        'Destino': data[2],
        'Peso liquidado' : weight + ' kg',
        'Cantidad': data[6],
        'Total': '$ ',
        'Tiempo de entrega': '+' + (res[0].ZONE.ZONE * 2 + 1) + ' dias'
    }

    let range = Math.ceil(weight);
    if (weight > 2) {
        range = (Math.floor(weight / 5) + 1) * 5 - 1;
    };

    let price = 'P' + range + 'KG';
    if (weight > 24) {
        price = 'ADDITIONAL_KG';
        obj['Total'] += ((ZONE[price] * range + 20000) * data[6]).toLocaleString();
        return obj
    }

    obj['Total'] += ((ZONE[price] + 20000) * data[6]).toLocaleString();
    return obj
};

const coord = (res, data) => {
    if (!res || !res[0] || !res[0].ZONE || !res[0].JOURNEY) {
        console.error("Invalid response data for DHL calculation");
        return null;
    }

    const {ZONE, JOURNEY} = res[0];
    const weight = Math.max(data[4]/2500, data[3]);
    const obj = {
        'Servicio': 'COORDINADORA',
        'Destino': data[2],
        'Peso liquidado': weight + ' kg',
        'Valor declarado': '$ ' + data[5].toLocaleString(),
        'Cantidad': data[6],
    }; 
    let vf, ff, fv;
    
    if(weight && weight < 6){
        vf = JSON.parse(ZONE.VF);
        ff = ZONE['P' + weight + 'KG'] * data[6];
        fv = Math.max(vf[0], data[5] * vf[1]/100) * data[6];
    }
    else {
        vf = JSON.parse(JOURNEY.VF);
        ff = Math.max(JOURNEY['PMIN'], JOURNEY['PKG'] * weight) * data[6];
        fv = Math.max(vf[0], data[5] * vf[1]/100) * data[6];
    }
    
    if(JOURNEY.hasOwnProperty('MW')){
        const max = JOURNEY.MW.split(' ')[0]
        if(weight > max){
            obj['Error'] ='El peso maximo para este destino es de ' + JOURNEY.MW;
            return obj;
        }
    }

    obj['Flete fijo'] = '$ ' + ff.toLocaleString();
    obj['Flete variable'] = '$' + fv.toLocaleString()
    obj['Total'] = '$ ' + (ff + fv).toLocaleString();
    obj['Tiempo de entrega'] = '+' +  res[0].DT + ' dias'; 
    
    return obj
}
