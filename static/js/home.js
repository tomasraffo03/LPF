const dominio = 'http://localhost:3000';

const b_confUser = document.getElementById('b_confUser');
const b_logout = document.getElementById('b_logout');

const b_altaUsuario = document.getElementById('b_altaUsuario');
const b_crearPartido = document.getElementById('b_crearPartido');
const b_proponerHorario = document.getElementById('b_proponerHorario');

b_confUser.addEventListener('click', () => {
    window.location.href = `${dominio}/configuracion/${b_confUser.getAttribute('username')}`
})

b_logout.addEventListener('click', () => {
    window.location.href = `${dominio}/logout`
})

b_altaUsuario.addEventListener('click', () => {
    window.location.href = `${dominio}/altausuario`
})

b_crearPartido.addEventListener('click', () => {
    window.location.href = `${dominio}/crearpartido`
})