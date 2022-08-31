const dominio = 'http://localhost:3000';

const b_confUser = document.getElementById('b_confUser');
const b_logout = document.getElementById('b_logout');

const b_proponerHorario = document.getElementById('b_proponerHorario');

const b_detallePartido = document.getElementsByClassName('b_detallePartido');

b_confUser.addEventListener('click', () => {
    window.location.href = `${dominio}/configuracion/${b_confUser.getAttribute('username')}`
})

b_logout.addEventListener('click', () => {
    window.location.href = `${dominio}/logout`
})


for (let x = 0; x < b_detallePartido.length; x++) {
    b_detallePartido[x].addEventListener('click', () => {
        let idPartido = b_detallePartido[x].getAttribute('idpartido')
        window.location.href = `${dominio}/partido/${idPartido}`
    })
}
