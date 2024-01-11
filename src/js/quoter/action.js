import { calc } from "../global/calc.js";
import get from "./params.js";

export const _action = (table, results) => { 
    const datalist = [],
    
    add = () => {
        const {destination: d, package_data: p, declared_value: v} = get; 
        if(!d.value){
            d.origen.classList.add('require');
            alert('Informacion invalida o incompleta')
            return
        }; 
        if(!v.value && d.service < 2){
            v.origen.classList.add('require');
            alert("Informacion invalida o incompleta"); 
            return;
        }

        for(let data in p){
            if(!p[data].value){
                p[data].origen.classList.add('require'); 
                alert("Informacion invalida o incompleta"); 
                return
            }
        }; 
        
        const 
        {ID, NAME} = d.value,
        {hight, long, broad, weight, amount} = p,
        data = [
            d.service,
            ID,
            NAME,
            weight.value,
            long.value * hight.value * broad.value,
            v.value,
            amount.value
        ];
        
        const tr = document.createElement('tr');
        data.slice(2)
            .forEach(e => {
                const td = document.createElement('td')
                td.innerText = e;
                tr.appendChild(td);
            });
        
        const 
        td = document.createElement('td'),
        del = document.createElement('button');
        
        del.addEventListener('click', () => {
            table.children[1].removeChild(tr);
            
            const i = datalist.findIndex(d => {
                return(d.every((e, i) => e === data[i]));
            });
            
            datalist.splice(i, 1);
        });
        
        td.appendChild(del);
        tr.appendChild(td);
        
        table.children[1].appendChild(tr);

        datalist.push(data);
    },
    
    play = () => {
        if(datalist.length < 1){
            alert('No ha agregado ningún item a la lista'); 
            return;
        }; 
        
        results.style.left = 0;
        results.classList.add('loading-result');

        const off = () => {
            results.style.left = '-100%';
            results.innerHTML = '';
            results.style.justifyContent = 'center';
        }
        
        calc(datalist)
        .then(res => {
            setTimeout(function() {
                const rList = document.createElement('div'); 
                rList.classList.add('r-list'); 
                rList.innerHTML = `
                <div>
                    <p>
                        <span>Total: </span>$ ${res.reduce((a, e) => a + (e.Total ? parseFloat(e.Total.split(' ')[1].split('.').join('')) : 0), 0).toLocaleString()}
                    </p>
                </div>
                ${res.map(e => `
                    <div>
                        ${Object.entries(e).map(([t, v]) => `
                            <p>
                                <span>${t} : </span>${v}
                            </p>
                        `).join('\n')}
                    </div>
                `).join('\n')}
                `;            
  
                results.style.justifyContent = 'flex-start'; 
                results.classList.remove('loading-result');
                
                const close = document.createElement('button');
                close.classList.add('close'); 
                close.innerText= "╳";
    
                close.addEventListener('click', off);

                const newQuoting = document.createElement('button'); 
                newQuoting.innerText = 'crear nueva cotizacion'; 
                newQuoting.classList.add('nq'); 
                newQuoting.addEventListener('click', () => {
                    document.querySelectorAll('.quoter input')
                            .forEach(input => {
                                input.value = ''; 
                                input.dispatchEvent(new Event('input'));
                                input.dispatchEvent(new Event('blur')); 

                                while(datalist.length > 0)
                                datalist.pop(); 

                                table.children[1].innerHTML = ''; 
                                close.dispatchEvent(new Event('click'));
                            }); 
                }); 
                
                results.appendChild(rList); 
                results.appendChild(close); 
                results.appendChild(newQuoting); 
                
            }, 2000);

        })
        .catch(err => {
            alert('No se pudo completar, intente de nuevo'); 
            off();
            console.error(err); 
        })
    };

    document.querySelectorAll('input')
    .forEach(e => {
        e.addEventListener('focus', () => e.parentElement.classList.remove('require')); 
    }); 

    document.getElementById('add')
            .addEventListener('click', add);
    
    document.getElementById('play')
            .addEventListener('click', play);
} 