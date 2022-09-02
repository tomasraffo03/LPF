let elems_jugadores = document.getElementsByClassName('e_jugador');

for (let j = 0; j < elems_jugadores.length; j++) {
    elems_jugadores[j].addEventListener('click', (e) => {
        let plid = e.target.getAttribute('plid');
        window.open(`/jugador/${plid}`, '_blank');
    })
}