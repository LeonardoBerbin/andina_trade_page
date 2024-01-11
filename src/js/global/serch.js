const serch = (file, get, conditions, join) => {
    const url = './db/' + file + '.json';

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(r => {
                if (!r.ok) throw new Error('Error al cargar el archivo json');
                return r.json();
            })
            .then(data => {
                let result = data.data;

                if (conditions) {
                    result = result.filter(a => {
                        return (
                            Object.entries(a)
                                .every((b, c) => b[1] === (conditions?.[c] ?? b[1]))
                        )
                    });
                }

                let promises = [];

                if (join) {
                    promises = join.map(key => {
                        return fetch(data.references[key][1])
                            .then(r => r.json())
                            .then(r => {
                                result.forEach(a => {
                                    a[key] = r.data.find(b => b[data.references[key][0]] === a[key])
                                });
                            })
                            .catch(err => console.error(err));
                    });
                }
                
                if (get) {
                    result = result.map(a => {
                        const b = {}
                        get.forEach(c => {
                            if (a.hasOwnProperty(c)) b[c] = a[c];
                        });
                        return b;
                    });
                };

                // Use Promise.all to wait for all promises to resolve
                
                Promise.all(promises)
                    .then(() => {
                        resolve(result);
                    })
                    .catch(error => reject(error));
            })
            .catch(error => reject(error));
    });
};

export default serch;
