import { send as dest_data} from "./dest.js";
import { send as pkg_data} from "./pkg.js";
import { send as dval_data} from "./dval.js";
import { calc } from "../global/calc.js";

export const action = (container, table, r) => {
    const add = document.createElement('button')
    add.classList.add('add'); 
    add.classList.add('action');
    add.innerText = 'añadir'; 
    
    const datalist = [];
    
    const insert = () => {
        if(!dest_data.data){
            dest_data.label.classList.add('require');
            alert('Informacion invalida o incompleta')
            return
        }; 
        
        if(!dval_data.value && dest_data.data.service < 2){
            dval_data.label.classList.add('require');
            alert("Informacion invalida o incompleta"); 
            return;
        }

        for(let data in pkg_data){
            if(!pkg_data[data].value){
                pkg_data[data].label.classList.add('require'); 
                alert("Informacion invalida o incompleta"); 
                return
            }
        }; 
        
        const 
        {ID, NAME} = dest_data.data,
        {hight, long, broad, weight, amount} = pkg_data,
        data = [
            dest_data.service,
            ID,
            NAME,
            weight.value,
            long.value * hight.value * broad.value,
            dval_data.value,
            amount.value
        ];
        
        const tr = document.createElement('tr');
        data.slice(2)
            .forEach(e => {
                const td = document.createElement('td')
                td.innerText = e;
                td.className = (data[0] === 2 ? 'country' : 'city');
                
                tr.appendChild(td);
            });
        
        const 
        td = document.createElement('td'),
        del = document.createElement('button');
        
        del.classList.add('delete');
        
        del.addEventListener('click', () => {
            table.children[1].removeChild(tr);
            
            const fi = datalist.findIndex(d => {
                return(d.every((f, i) => f === data[i]));
            });
            
            datalist.splice(fi, 1);
        });
        
        del.addEventListener('mouseover', () => td.classList.add('delete'));
        
        del.addEventListener('mouseout', () => td.classList.remove('delete'))
        
        td.appendChild(del);
        tr.appendChild(td);
        
        table.children[1].appendChild(tr);
        
        datalist.push(data);
    }; 

    document.querySelectorAll('input').forEach(e => {
        e.addEventListener('focus', () => e.parentElement.classList.remove('require')); 
    }); 

    add.addEventListener('click', insert);
    
    const play = document.createElement('button');
    
    play.classList.add('play');
    play.classList.add('action')
    play.innerText = 'cotizar';
 
    const start = () => {
        if(datalist.length < 1){
            alert('No ha agregado ningún item a la lista'); 
            return;
        }; 
        
        r.style.left = 0;
        r.classList.add('loading-result');
        
        calc(datalist)
        .then(result => {
            setTimeout(function() {
                const ih = result.map(o =>
                {
                    return '<div>' + Object.entries(o).map(([p, v]) => 
                        `<p><span>${p} : </span>${v}</p>`).join('\n') + '</div>';
                }).join('\n');

                r.style.justifyContent = 'space-between'; 
                r.classList.remove('loading-result');
                r.innerHTML = '<div class="r-list"><div><p><span>Total : </span>$ ' + result.reduce((a,e) => {if(e.Total) a += parseFloat(e.Total.split(' ')[1].split('.').join('')); return a}, 0).toLocaleString() + '</p></div>' + ih + '</div>';
                
                const close = document.createElement('button');
                close.classList.add('close'); 
                close.innerText= "╳";
                
                close.addEventListener('click', () => {
                    r.style.left = '-100%';
                    r.innerHTML = '';
                    r.style.justifyContent = 'center';
                });

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
                
                r.appendChild(close); 
                r.appendChild(newQuoting); 
                
            }, 2000);

        })
        .catch(err => console.error(err))
    };
    
    play.addEventListener('click', start);

    container.appendChild(add); 
    container.appendChild(play)
} 