Para la segunda parte de este desafio se uso:
 https://developer.mozilla.org/es/docs/Web/CSS/Guides/Grid_layout

Consultas de al chatGPT:

Tengo este código HTML/CSS y quiero hacer el layout de la imagen, pero no puedo usar width ni height <!DOCTYPE html> <head> <link rel="stylesheet" href="styles.css"> </head> <body> <div class="container"> <div class="sidebar"></div> <div class="content"> <div class="topbar"></div> <div class="grid"> <div class="card"></div> <div class="card"></div> <div class="card"></div> <div class="card"></div> </div> </div> </div> </body> </html> .container { width: 100%; height: 300px; background: #cfcfcf; display: flex; } .sidebar { width: 150px; background: #6ee09e; height:100%; } .content { flex: 1; display: flex; } .grid { padding: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }


.container { background: #cfcfcf; display: flex; } .sidebar{ flex: 1; background: #12e9d0; } .content{ flex: 3; display: flex; flex-direction: column; background: #cfcfcf; } .grid { padding: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; } .topbar { padding: 2rem; background: #6ee09e; } .card{ background: #ffffad; aspect-ratio: 2/1; } porque no ocupa toda la pantalla esto