// =====================================================
// app.js
// Lógica de interactividad del portafolio: navegación con
// resaltado según la sección visible, menú móvil, animaciones
// de aparición, carga de la foto de perfil y año dinámico.
// =====================================================

// IIFE (función autoejecutable): encapsula todo el código en un
// ámbito local para evitar variables globales y conflictos con
// otros scripts. Se ejecuta inmediatamente tras cargarse el archivo.
(function () {
  // Referencias a los elementos del DOM que controla este script
  var nav = document.getElementById("nav"); // Barra de navegación superior
  var navLinks = document.getElementById("nav-links"); // Contenedor de los enlaces del menú
  var navToggle = document.getElementById("nav-toggle"); // Botón hamburguesa (móvil)
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link")); // Todos los enlaces del menú
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]")); // Secciones con identificador

  // Se ejecuta en cada evento de scroll: actualiza el estado de la
  // barra de navegación y resalta el enlace de la sección visible.
  function onScroll() {
    // Al superar los 20 px de desplazamiento, agrega la clase "scrolled"
    // para oscurecer la barra (ver Styles.css). La remueve al volver arriba.
    if (window.scrollY > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Determina la sección actualmente visible y marca su enlace
    // correspondiente con la clase "active".
    var current = sections[0];
    var pos = window.scrollY + 140; // Compensación por la altura de la barra fija
    sections.forEach(function (section) {
      if (section.offsetTop <= pos) {
        current = section;
      }
    });
    links.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current.id);
    });
  }

  // Registra el listener de scroll (passive mejora el rendimiento)
  // y ejecuta una primera actualización para el estado inicial.
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Alterna la apertura/cierre del menú móvil al pulsar el botón
  // hamburguesa, sincronizando las clases y el atributo aria-expanded.
  navToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Cierra el menú móvil automáticamente al seleccionar un enlace.
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // =====================================================
  // Animaciones de aparición
  // IntersectionObserver detecta cuando un elemento entra en el
  // viewport y le agrega la clase "visible" para animar su entrada.
  // =====================================================
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // Muestra el elemento
          revealObserver.unobserve(entry.target); // Deja de observarlo para no repetir la animación
        }
      });
    },
    { threshold: 0.15 } // Se activa cuando el 15% del elemento es visible
  );
  // Registra todos los elementos con clase .reveal
  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  // =====================================================
  // Carga de la foto de perfil
  // Intenta cargar la imagen probando varios nombres de archivo.
  // Si ninguno existe, se conservan las iniciales como respaldo.
  // =====================================================
  var photo = document.getElementById("hero-photo");
  var candidates = ["FotoPerfil.jpeg", "foto.jpg", "foto.jpeg", "foto.png", "foto.webp"];
  function tryPhoto(index) {
    if (index >= candidates.length) return; // Ningún candidato disponible
    var probe = new Image(); // Imagen de prueba precargada en memoria
    probe.onload = function () {
      // Archivo encontrado: se inserta la imagen y se eliminan las iniciales
      var img = document.createElement("img");
      img.src = candidates[index];
      img.alt = "Retrato de Luciano Garrido";
      photo.innerHTML = "";
      photo.appendChild(img);
    };
    probe.onerror = function () {
      tryPhoto(index + 1); // Archivo no disponible: prueba el siguiente candidato
    };
    probe.src = candidates[index];
  }
  tryPhoto(0); // Inicia la búsqueda desde el primer candidato

  // Actualiza el año del pie de página con el año actual,
  // evitando que la información quede desactualizada.
  document.getElementById("year").textContent = new Date().getFullYear();
})();
