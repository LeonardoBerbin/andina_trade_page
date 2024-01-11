export const _input = (container) => {
    [...container.children]
    .slice(1)
    .slice(0, -1)
    .forEach(e => {
        const input = e.children[0]; 

        input.addEventListener('change', () => {
            const children = [...container.children];

            children.slice(children.length - 1)[0].value = 
            children
            .slice(1)
            .slice(0, -1)
            .reduce((a, e) => {
                a += `${e.innerText} ${e.children[0].value}\n`; 
                return a; 
            }, ''); 
        })
    })
    
}; 

export const _input_pkg = (container) => {

    const labels = document.querySelectorAll(`#${container.id} > label`);
    const tableData = [];


    labels.forEach((e, i) => {
        [...e.children]
        .forEach((b, c)=> {

            if(i <= 0)
            tableData.push([b.value]); 
        
            else tableData[c].push(b.value); 

            b.addEventListener('input', () => {
                tableData[c][i] = b.value; 
                console.log(tableData); 
            }); 

            b.addEventListener('change', () => {
                document.querySelector(`#${container.id} > textarea`).value = 
                tableData
                    .filter(t => t.some(s => s !== ''))
                    .map((a, n) => {
                        return (
                            'PAQUETE Nº ' + (n + 1) + ':\n\n' + 
                            a.map((z, index) => labels[index].innerText.split(' ')[0] + ': ' + z)
                                .filter(z => z.split(': ')[1])
                                .join('\n')
                        ); 
                    }).join('\n\n'); 
                console.log(document.querySelector(`#${container.id} > textarea`).value)
            })
        }); 
    }); 
};
  

  