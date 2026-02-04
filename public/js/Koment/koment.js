var tombolKirim = document.getElementById('tombolKirim');
var inputKomentar = document.getElementById('inputKomentar');
var daftarKomentar = document.getElementById('daftarKomentar');

tombolKirim.onclick = function() {
    var paragraf = document.createElement('p');
    var komentar = document.createTextNode(inputKomentar.value);
    
    paragraf.appendChild(komentar);
    daftarKomentar.appendChild(paragraf);
    
    inputKomentar.value = '';
}