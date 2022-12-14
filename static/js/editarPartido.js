const editarButton = document.getElementById('editarButton');
const div_jugadores = document.getElementById('div_jugadores');

const editarJugadores = document.getElementById('editarJugadores')

editarButton.addEventListener('click', () => {
    div_jugadores.toggleAttribute('hidden')
    if (editarJugadores != null) {
        editarJugadores.toggleAttribute('hidden')
    }
})

const eq_jugadores1 = document.getElementById('eq_jugadores1');
const eq_jugadores2 = document.getElementById('eq_jugadores2');

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

try {
    const editarSubmit = document.getElementById('editarSubmit')
    editarSubmit.addEventListener('click', (e) => {
        //recorrer eq1
        let eq1Children = document.getElementById('eq_jugadores1').children;
        let eq1players = document.getElementById('eq1players');
        let eq2Children = document.getElementById('eq_jugadores2').children;
        let eq2players = document.getElementById('eq2players');
        let eq1Arr = [];
        let eq2Arr = [];
        for (let x = 0; x < eq1Children.length; x++) {
            eq1Arr.push(eq1Children[x].getAttribute('plid'))
        }

        for (let y = 0; y < eq2Children.length; y++) {
            eq2Arr.push(eq2Children[y].getAttribute('plid'))
        }

        eq1players.value = eq1Arr;
        eq2players.value = eq2Arr;
    })

    const buttonAlAzar = document.getElementById('buttonAlAzar');
    buttonAlAzar.addEventListener('click', (e) => {

        let eq1Children = document.getElementById('eq_jugadores1');
        let eq1players = document.getElementById('eq1players');
        let eq2Children = document.getElementById('eq_jugadores2');
        let eq2players = document.getElementById('eq2players');

        let allPlayers = [...eq1Children.children, ...eq2Children.children];
        shuffle(allPlayers)

        while (document.getElementById('eq_jugadores1').firstChild) {
            document.getElementById('eq_jugadores1').lastChild.remove()
        };

        let eq1Arr = [];
        let eq2Arr = [];


        let lengthMitad = Math.round(allPlayers.length / 2);
        let lengthRestante = allPlayers.length - lengthMitad;

        for (let x = 0; x < lengthMitad; x++) {
            let player = allPlayers.shift();
            eq1Children.appendChild(player);
            eq1Arr.push(player.getAttribute('plid'));
        }

        for (let y = 0; y < lengthRestante; y++) {
            let player = allPlayers.shift();
            eq2Children.appendChild(player)
            eq2Arr.push(player.getAttribute('plid'))
        }

        eq1players.value = eq1Arr;
        eq2players.value = eq2Arr;

    })





} catch {
    //
}


try {
    let borrarButton = document.getElementById('borrarSubmit');
    borrarButton.addEventListener('click', e => {
        if (confirm('Seguro que deseas borrar este partido?')) {
            borrarButton.submit();
        } else {
            e.preventDefault()
        }
    })
} catch {
    //
}


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}