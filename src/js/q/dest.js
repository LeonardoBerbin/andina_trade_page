import serch from "../global/serch.js";

export let send = {label: undefined, data: undefined}; 
export const _opacity = (container, html) => {
    /*if(container && html){
        const quoter = document.querySelector('main'); 
        [...quoter.querySelectorAll('*')]
        .filter(child => {
            return (
                child !== document.querySelector('.quoter') && 
                child !== container && 
                !html.includes(child)
            )
        })
        .forEach(child => {
            child.classList.add('blur');  
        }); 
        return
    }

    document.querySelectorAll('*')
            .forEach(child => child.classList.remove('blur')); 
            */
}; 
export const dest = (container) => {
    const 
    files = ['countries', 'states', 'cities'],
    titles = ['pais', 'region', 'ciudad'],
    
    assignData = () => {
        let data = {}
        if(dom[0].value > 82 || dom[0].value < 82){
            const find = dom[0].list.find(e => e.ID === dom[0].value);
            data = {
                service: 2,
                label: dom[0].label,
                data: find
            };
        }
        else {
            const find = dom[2].list.find(e => e.ID === dom[2].value);
            data = {
                service: 1,
                label: dom[2].label,
                data: find
            }
        };
        
        Object.assign(send, data);
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

    dom = files.map((e, i) => {
        let value = 0; 
        return {
            label: document.createElement('label'), 
            input: document.createElement('input'), 
            ul: document.createElement('ul'),
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

                    load(files[i + 1], (i + 1), dom[i + 1]); 
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
                
                label.classList.add('dest'); 
                label.classList.add('invalided'); 
                label.setAttribute('for', e); 
                label.innerText = titles[i] + ':'

                input.id = e;
                input.setAttribute('type', 'text'); 
                input.addEventListener('focus', () => {
                    _opacity(container, [label, input, ul]); 
                    showList(this)
                }); 
                input.addEventListener('blur', () => {
                    _opacity(); 
                    ul.innerHTML = ''
                }); 
                input.addEventListener('input', () => filterList(this)); 

                ul.classList.add('sugestions-list')
                
                
                label.appendChild(input); 
                label.appendChild(ul); 

                load(e, i, this); 
                container.appendChild(label); 

                delete this.init; 
            }
        }
    }); 

    dom.forEach(e => e.init()); 
    send.label = dom[0].label; 
    
/*
    let html = document.querySelectorAll('.sl-dest'); 
    html = [...html].map((e, i) => {
        return {
            label: e,
            input: e.children[0], 
            ul: e.children[1], 
            index: i, 

            get value(){ return parseInt(this.input.dataset.value) },
            set value(value){
                if(this.value === value) return; 
                this.input.dataset.value = value; 

                if(this.index < 2){
                    html.slice(this.index + 1)
                        .forEach(
                            arround => {
                                arround.value = 0; 
                                arround.input.value = ''; 
                                arround.ul.dataset.selected = 0; 
                            }   
                        ); 
                    load(html[this.index + 1]); 
                }; 

                if(value > 0){
                    this.input.blur(); 

                    this.label.classList.remove('invalided'); 
                    this.label.classList.add('valided'); 

                    [...this.ul.children]
                    .forEach(button => button.style.display = 'flex');
                    
                    const i = [...this.ul.children]
                        .findIndex(button => parseInt(button.dataset.value) === value); 
 
                    this.ul.dataset.selected = i; 
                    return; 
                }; 

                this.ul.dataset.selected = -1; 
                this.label.classList.remove('valided'); 
                this.label.classList.add('invalided'); 
            },

            init(){
                let count; 

                const focus = () => {
                    const list = [...this.ul.children]
                        .filter(button => getComputedStyle(button).display === 'flex'); 

                    [...this.ul.children].forEach(button => button.style.color = 'white'); 

                    if(list.length > 0) 
                    list[count].style.color = 'cyan'; 

                    this.ul.scrollTop = parseFloat(getComputedStyle(document.documentElement).fontSize) * count * 3; 

                    return list; 
                }; 

                const keyNavigation = (event) => {
                    const list = focus(); 
                    switch(event.key){
                        case 'ArrowUp': 
                            event.preventDefault(); 
                            if(count > 0)
                            count -= 1; 
                            break; 
                        case 'ArrowDown': 
                            if(count < list.length - 1)
                            count += 1; 
                            break
                        case 'Enter': 
                            if(list[count])
                            list[count].dispatchEvent(new Event('mousedown')); 
                            return;
                        default:
                            return; 
                    }; 
                    
                    focus()
                };  

                this.input.addEventListener('input', (event) => {
                    const
                    value = this.input
                        .value
                        .split(" ")
                        .filter(string => string)
                        .join(" ")
                        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .replace(/[\(\)]/g, "\\$&"),
                    rxs = new RegExp(value, 'i'), 
                    rxv = new RegExp("^" + value + "$", 'i'), 
                    key = [...this.ul.children].reduce((a, button) => {
                        button.style.display = 'none';
                        const string = button.innerText 
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase(); 
                        if(rxv.test(string)){
                            a = button.dataset.value;
                            this.input.value = button.innerText; 
                        }  
                        else if(rxs.test(string)) button.style.display = 'flex';
                        return a; 
                    }, 0); 

                    this.value = parseInt(key); 

                    count = 0; 
                    focus(); 
                }); 
                
                this.input.addEventListener('blur', () => document.removeEventListener('keydown', keyNavigation)); 
                this.input.addEventListener('focus', () => {
                    count = parseInt(this.ul.dataset?.selected ?? 0); 
                    focus(); 
                    document.addEventListener('keydown', keyNavigation)
                }); 

                load(this); 
            }
        }
    }); 

    html.forEach(e => {
        e.init(); 
        delete e.init; 
    }); 
    */
}; 