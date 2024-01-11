export const send = {label: null, value: 0}; 
export const dval = (container) => {
    const
    format = (data) => {
        data = data.replace(/[^\d]/g, ''); 
        if(data === '') return; 
        send.value = isNaN(parseInt(data)) ? 0 : parseInt(data)
        input.value = '$ ' + send.value.toLocaleString();
    }, 

    label = document.createElement('label'),
    input = document.createElement('input');
    
    send.label = label;

    label.classList.add('dval'); 
    label.innerText = 'valor declarado'; 
    label.setAttribute('for', 'declared-value'); 

    input.setAttribute('type', 'text'); 
    input.value = '$ 0'
    input.id = 'declared-value'; 

    input.addEventListener('focus', () => {
        input.value = ''; 
    }); 

    input.addEventListener('blur', () => {
        input.value = '$ ' + send.value.toLocaleString(); 
    }); 

    input.addEventListener('input', () => {
        if(input.value.length > 15)
        input.value = input.value.slice(0, 15); 

        format(input.value); 
    });

    label.appendChild(input); 
    container.appendChild(label)
}
