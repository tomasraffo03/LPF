const b_confUser = document.getElementById('b_confUser');
const b_logout = document.getElementById('b_logout');

const b_historialPartidos = document.getElementById('b_historialPartidos');

const b_detallePartido = document.getElementsByClassName('b_detallePartido');

b_confUser.addEventListener('click', () => {
    window.location.href = `/configuracion/${b_confUser.getAttribute('username')}`
})

b_logout.addEventListener('click', () => {
    window.location.href = `/logout`
})

const div_p_pendConf = document.getElementById('partidos_pend_conf');
const div_p_jugados = document.getElementById('partidos_jugados');

b_historialPartidos.addEventListener('click', () => {
    div_p_jugados.toggleAttribute('hidden');
    div_p_pendConf.toggleAttribute('hidden');
})

for (let x = 0; x < b_detallePartido.length; x++) {
    b_detallePartido[x].addEventListener('click', () => {
        let idPartido = b_detallePartido[x].getAttribute('idpartido')
        window.location.href = `/partido/${idPartido}`
    })
}
