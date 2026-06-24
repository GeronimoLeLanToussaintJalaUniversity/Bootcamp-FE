function cambiarNombre() {
    if (document.getElementById('card-kageyama').getAttribute('name') === 'Kageyama') {
        document.getElementById('card-kageyama').setAttribute('name', 'El Rey');
    } else {
        document.getElementById('card-kageyama').setAttribute('name', 'Kageyama');
    }
}

function eliminarCard() {
    const card = document.getElementById('card-kageyama');
    card.remove();
}
