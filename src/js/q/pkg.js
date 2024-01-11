import { _opacity } from "./dest.js";

export const send = {}; 
export const pkg = (container) => {
    const 
    format = (html, i) => {
        const 
        { input } = html,
        trim = input.value.replace(/[^\d.]/g, ''); 
        
        html.value = parseFloat(trim || 0); 
        
        if(/^(\d+(\.\d{0,2})?)?$/.test(trim))
        input.value = `${und[i]}${trim}`; 
        else
        input.value = `${und[i]}${html.value}`; 

        if(input.value.length > 10)
        input.value = input.value.slice(0, 10); 
    },
    en = ['hight', 'broad', 'long', 'weight', 'amount'],
    es = ['alto', 'ancho', 'largo', 'peso', 'cantidad'],
    und = ['CM ', 'CM ', 'CM ', 'KG ', ''],
    dom = en.map((e, i) => {
        return {
            label: document.createElement('label'),
            input: document.createElement('input'),
            value: 1,

            init(){
                const { label, input } = this; 

                label.classList.add('pkg-data'); 
                label.setAttribute('for', e); 
                label.innerText = es[i]; 

                input.setAttribute('type', 'text'); 
                input.value = und[i] + this.value; 
                input.id = e; 

                input.addEventListener('focus', () => {
                    input.value = und[i]; 
                    _opacity(container, [label, input]); 
                })
                input.addEventListener('blur', () => {
                    input.value = `${und[i]}${this.value}`
                    _opacity(); 
                })

                input.addEventListener('input', () => format(this, i)); 
                input.addEventListener('change', () => send[e].value = this.value); 

                label.appendChild(input);

                container.appendChild(label); 
                
                send[e] = {}; 
                send[e].label = label; 
                send[e].value = this.value; 
            }
        }
    });

    dom.forEach(e => e.init()); 
}; 
