import { _destination, _package_data, _declared_value } from './quoter/params.js'; 
import { _action } from './quoter/action.js';
import { _input, _input_pkg} from './pickup-formats/format.js';
import { _send } from './pickup-formats/send.js';

window.onload = function(){
    if(window.location.href !== window.location.href.split('#')[0])
    window.location.href = window.location.href.split('#')[0]; 
};

const 
ddv = document.querySelector('.ddv-container'),
pkg = document.querySelector('.pkg-container'),
table = document.querySelector('.pkg-list > table'),
result = document.querySelector('.result'),

sender = document.getElementById('sender'),
addressee = document.getElementById('addressee'),
packages_form = document.getElementById('packages'),
form = document.getElementById('send'), 
sending = document.getElementById('sending-form'); 

const mobile = () => { 
    const welcome = document.createElement('section');
        welcome.innerHTML = 
        '<h1>¡Bienvenido!</h1><h3><span>+1400</span> destinos en Colombia</h3><h3><span>+127000</span> en todo el mundo</h3>'
        welcome.classList.add('welcome');
        welcome.style.height = '60vh';
    
    const goQuoter = document.createElement('a');
        goQuoter.innerText = 'crear cotizacion';
        goQuoter.setAttribute('href', '#quoter');
    
    const goForm = document.createElement('a');
        goForm.innerText = 'solicitar recogida';
        goForm.setAttribute('href', '#formats');
    
    welcome.appendChild(goQuoter);
    welcome.appendChild(goForm);
    
    document.querySelector('main').insertBefore(welcome, document.querySelector('.quoter'));
    
    const viewList = document.createElement('button');
    viewList.classList.add('action');
    viewList.innerText = 'ver lista\n( 0 )';

    viewList.addEventListener('click', () => {
        table.parentElement.style.right = 0; 
    })

    const close = document.createElement('button'); 
    close.innerText = '╳'; 
    close.classList.add('close'); 

    close.addEventListener('click', () => {
        table.parentElement.style.right = '-100vw'; 
    }); 

    table.parentElement.appendChild(close); 
    
    pkg.insertBefore(viewList, pkg.children[7]);
    pkg.insertBefore(goForm.cloneNode(true), viewList);
    
    document.onclick = function(){
        viewList.innerText = `ver lista\n( ${table.children[1].children.length} )`;
    }; 

    document.querySelector('#formats > div').appendChild(goQuoter.cloneNode(true)); 

    setTimeout(function() {
        const header = document.querySelector('header');
        header.style.minHeight = '40vh';
    }, 2000);
};

const desktop = () => {
    setTimeout(function(){
        document.querySelector('header > img').style.width = '0'; 
        document.querySelector('header').style.minHeight = '0'; 
        setTimeout(function(){
            document.querySelector('header').style.alignItems = 'flex-start'; 
            document.querySelector('header > h1').style.minWidth = '0'; 
        }, 400)
    }, 2000)
}

_destination(ddv); 
_declared_value(); 
_package_data(pkg); 
_action(table, result); 

_input(sender);
_input(addressee); 
_input_pkg(packages_form); 

_send(form, sending); 

if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) mobile(); 
else desktop(); 
 


