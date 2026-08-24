// =====================================================
// app.js es el CEREBRO de la página.
// El HTML es el esqueleto, el CSS es la ropa...
// y este archivo es el que reacciona cuando tocas algo.
// =====================================================

// Todo el código vive dentro de una "caja mágica" que se abre
// sola apenas se carga la página. Así nada se mezcla con otros códigos.
(function () {
  // Primero buscamos las piezas de la página que vamos a controlar,
  // como cuando eliges tus juguetes antes de jugar.
  var nav = document.getElementById("nav"); // La barra de arriba
  var navLinks = document.getElementById("nav-links"); // La lista de botones del menú
  var navToggle = document.getElementById("nav-toggle"); // El botón de las tres rayitas
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link")); // Todos los botones del menú
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]")); // Todas las secciones

  // Esta función corre cada vez que subes o bajas por la página (hacer scroll)
  function onScroll() {
    // Si ya bajaste más de 20 píxeles, le ponemos la etiqueta
    // "scrolled" a la barra de arriba y el CSS la ve más oscura.
    // Si vuelves arriba, se la quitamos.
    if (window.scrollY > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Aquí descubrimos qué sección estás mirando ahora mismo
    // y encendemos el botón del menú que le corresponde,
    // como una lucecita que dice "estás aquí".
    var current = sections[0];
    var pos = window.scrollY + 140; // 140 píxeles extra por la barra que tapa un poco
    sections.forEach(function (section) {
      if (section.offsetTop <= pos) {
        current = section;
      }
    });
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
    });
  }

  // Le decimos a la página: "¡Avísame cada vez que el usuario suba o baje!"
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // También la llamamos al tiro, por si la página parte más abajo

  // Cuando tocas el botón de las rayitas (☰), el menú del celular
  // se abre o se cierra, como una puerta.
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Cuando eliges un botón del menú, la puerta se cierra solita.
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // =====================================================
  // LAS ANIMACIONES DE APARICIÓN
  // ¿Viste que las tarjetas aparecen suavemente cuando
  // llegas a ellas? Esto es lo que lo hace.
  // =====================================================
  // Creamos un "vigilante" que mira la pantalla. Cuando una tarjeta
  // asoma un poquito (el 15%), le da permiso para aparecer
  // y deja de mirarla, para no repetir la animación.
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // ¡Aparece!
          revealObserver.unobserve(entry.target); // Ya no la miro más
        }
      });
    },
    { threshold: 0.15 } // "threshold" significa: avísame cuando se vea el 15%
  );
  // Ponemos a todas las tarjetas con clase "reveal" bajo vigilancia
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  // =====================================================
  // LA FOTO DE LUCIANO
  // =====================================================
  // A veces una foto puede tener nombres distintos. Aquí probamos
  // con varios, uno por uno, como cuando buscas un juguete:
  // si aparece, ¡lo mostramos! Si no, buscamos en el siguiente lugar.
  var photo = document.getElementById("hero-photo");
  var candidates = ["FotoPerfil.jpeg", "foto.jpg", "foto.jpeg", "foto.png", "foto.webp"];
  function tryPhoto(index) {
    if (index >= candidates.length) return; // Ya buscamos en todos lados
    var probe = new Image(); // Una imagen de prueba, invisible todavía
    probe.onload = function () {
      // ¡La foto existe! La ponemos en el círculo y borramos las iniciales
      var img = document.createElement("img");
      img.src = candidates[index];
      img.alt = "Retrato de Luciano Garrido";
      photo.innerHTML = "";
      photo.appendChild(img);
    };
    probe.onerror = function () {
      tryPhoto(index + 1); // No estaba aquí, probamos con el siguiente nombre
    };
    probe.src = candidates[index];
  }
  tryPhoto(0); // Empezamos a buscar desde el primer nombre

  // Ponemos el año actual en el pie de página para que nunca
  // quede viejo. ¡Como un reloj que se ajusta solo!
  document.getElementById("year").textContent = new Date().getFullYear();
})();
