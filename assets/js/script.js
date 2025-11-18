/* Attendi che tutto l'HTML sia stato caricato prima di eseguire lo script */
document.addEventListener('DOMContentLoaded', () => {

  // Seleziona TUTTI i link, sia nel menu desktop che nel popup mobile
  const menuLinks = document.querySelectorAll('.menu a, .menu-popup-list a');
  
  // Trova il checkbox del menu
  const menuToggle = document.getElementById('menu-toggle');

  // Aggiungi un "ascoltatore" a ogni link
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Quando un link viene cliccato,
      // deseleziona il checkbox per chiudere il menu.
      menuToggle.checked = false;
    });
  });

});