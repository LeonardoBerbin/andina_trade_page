export const _send = (form, sending) => {
    form.onsubmit = () => {
        sending.style.opacity = 1; 
        const data = {}; 
        document.querySelectorAll(`#${form.id} textarea`).forEach(e => {
          data[e.name] = e.value; 
        }); 

        // Realizar la solicitud POST con fetch
        fetch('https://formspree.io/f/xwkgpvaz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          mode: 'no-cors'
        })
        .then(data => {
          setTimeout(function(){
            sending.style.opacity = 0; 
            alert('Solicitud enviada con exito, en breve nos comunicaremos con usted.');
          }, 1000); 
        })
        .catch(err => console.error(err)); 
      
        return false; 
    }
};