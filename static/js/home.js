const dominio = 'http://localhost:3000';

const b_altaUsuario = document.getElementById('b_altaUsuario');
const b_crearPartido = document.getElementById('b_crearPartido');
const b_proponerHorario = document.getElementById('b_proponerHorario');

b_altaUsuario.addEventListener('click', () => {
    window.location.href = `${dominio}/altausuario`
})