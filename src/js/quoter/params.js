import serch from "../global/serch.js";

const data = {}; 
export default data; 

export const _destination = (container) => {
    
    data.destination = {origen: null, value: null}; 

    const
    assignData = () => {
        let newData = {}
        if(dom[0].value > 82 || dom[0].value < 82){
            const find = dom[0].list.find(e => e.ID === dom[0].value);
            newData = {
                service: 2,
                origen: dom[0].label,
                value: find
            };
        }
        else {
            const find = dom[2].list.find(e => e.ID === dom[2].value);
            newData = {
                service: 1,
                origen: dom[2].label,
                value: find
            }
        };
        
        Object.assign(data.destination, newData);
    },

    load = (e, i, html) => {
        const 
        file = e,
        condition = dom[i - 1]?.value ?? undefined, 
        {label, list} = html,
        className = label.classList[1]; 

        label.classList.remove(className); 
        label.classList.add('loading'); 

        while(list.length > 0)
        list.pop();
        
        serch(file, ['ID', 'NAME'], [condition])
        .then(res => {
            res.forEach(e => list.push(e));

            label.classList.remove('loading'); 
            label.classList.add(className); 
        })
        .catch(err => console.error(err)); 
    },

    showList = (html, filteredList) => {
        const { ul, list, input } = html;

        (filteredList || list)
        .forEach(e => {
            const button = document.createElement('button'); 
            button.innerHTML = e.NAME;

            const funct = () => {
                input.value = e.NAME; 
                html.value = e.ID; 
            }

            button.addEventListener('mousedown', funct);
          
            ul.appendChild(button); 
        }); 
    },

    filterList = (html) => {
        const 
        filterName = (name) => {
            return (
                name.normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
            ); 
        }, 

        { input, ul, list } = html, 
        value = input
            .value
            .split(" ")
            .filter(string => string)
            .join(" ")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[\(\)]/g, "\\$&"),
        rxs = new RegExp(value, 'i'), 
        rxv = new RegExp("^" + value + "$", 'i'), 

        filteredList = list.filter(e => rxs.test(filterName(e.NAME)));

        ul.innerHTML = '';
        showList(html, filteredList);

       html.value = filteredList.find(e => rxv.test(filterName(e.NAME)))?.ID ?? 0;  
    }, 

    dom = [...container.children]
    .slice(1)
    .slice(0, -1)
    .map((e, i) => {
        let value = 0; 
        return {
            label: e, 
            input: e.children[0], 
            ul: e.children[1],
            list: [], 

            get value(){ return value },
            set value(number){
                const { input, label, list } = this
                if(value === number) return; 
                value = number; 

                if(i < 1 || i > 1)
                assignData();
                
                if(i < 2){
                    dom
                    .slice(i + 1)
                    .forEach(html => {
                      html.value = 0; 
                      html.input.value = ''; 
                    });

                    load(dom[i + 1].input.id, (i + 1), dom[i + 1]); 
                }; 

                if(value > 0){
                    input.blur(); 
                    label.classList.remove('invalided'); 
                    label.classList.add('valided'); 
                    return; 
                }; 

                label.classList.remove('valided'); 
                label.classList.add('invalided'); 
            },

            init(){
                const {label, input, ul} = this;
                
                label.classList.add('invalided')
                
                input.addEventListener('focus', () => {
                    showList(this);
                }); 
                input.addEventListener('blur', () => {
                    ul.innerHTML = ''
                }); 
                input.addEventListener('input', () => filterList(this));

                load(input.id, i, this);

                delete this.init; 
            }
        }
    }); 

    dom.forEach(e => e.init()); 
    data.destination.origen = dom[0].label; 
}; 

export const _declared_value = () => {

    data.declared_value = {origen: null, value: 0}; 

    const
    format = (string) => {
        string = string.replace(/[^\d]/g, ''); 
        if(data === '') return; 
        data.declared_value.value = isNaN(parseInt(string)) ? 0 : parseInt(string)
        input.value = '$ ' + data.declared_value.value.toLocaleString();
    }, 
    input = document.getElementById('declared-value');
    
    data.declared_value.origen = input.parentElement;
    
    input.value = '$ 0';

    
    input.addEventListener('focus', () => {
        input.value = ''; 
    }); 

    input.addEventListener('blur', () => {
        input.value = '$ ' + data.declared_value.value.toLocaleString(); 
    }); 

    input.addEventListener('input', () => {
        if(input.value.length > 15)
        input.value = input.value.slice(0, 15); 

        format(input.value); 
    });
}; 

export const _package_data = (container) => {
    
    data.package_data = {}; 
    
    const 
    format = (html) => {
        const 
        { input, und } = html,
        trim = input.value.replace(/[^\d.]/g, ''); 
        
        html.value = parseFloat(trim || 0); 
        
        if(/^(\d+(\.\d{0,2})?)?$/.test(trim))
        input.value = `${und}${trim}`; 
        else
        input.value = `${und}${html.value}`; 

        if(input.value.length > 10)
        input.value = input.value.slice(0, 10); 
    },
    dom = [...container.children]
        .slice(1)
        .slice(0, -2)
        .map(e => {
            return {
                label: e,
                input: e.children[0],
                und: e.children[0].dataset.und + ' ', 
                value: 1,

                init(){
                    const { label, input, und } = this; 

                    input.value = und + this.value; 
                    input.addEventListener('focus', () => {
                        input.value = und; 
                    })
                    input.addEventListener('blur', () => {
                        input.value = `${und}${this.value}`
                    })

                    input.addEventListener('input', () => format(this)); 
                    input.addEventListener('change', () => data.package_data[input.id].value = this.value); 

                    data.package_data[input.id] = {}; 
                    data.package_data[input.id].origen = label; 
                    data.package_data[input.id].value = this.value; 
                }
            }
    });

    dom.forEach(e => e.init()); 
}; 

