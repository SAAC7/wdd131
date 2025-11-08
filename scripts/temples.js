const menuButton = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const menuClose = document.getElementById("menu-close");

menuButton.addEventListener("click", () => {
    navMenu.classList.add("show");
});

menuClose.addEventListener("click", () => {
    navMenu.classList.remove("show");
});


const temples = [
    {name: "Quetzaltenango, Guatemala", image:"images/quetzaltenango-guatemala-temple-3959.jpg"},
    {name: "Guatemala, Guatemala", image:"images/guatemala-city-guatemala-temple-9988.jpg"},
    {name: "Coban, Guatemala", image:"images/coban-guatemala-temple-47554.jpg"},
    {name: "Mexico, Mexico", image:"images/mexico-city-mexico-temple-4058.jpg"},
    {name: "Tijuana Mexico", image:"images/tijuana-mexico-temple-3661.webp"},
    {name: "Rome, Italy", image:"images/rome-italy-temple-2642.jpg"},
    {name: "Salt lake, Utah", image:"images/salt-lake-temple-4947.jpg"},
    {name: "San Diego, California", image:"images/san-diego-california-temple-48148.jpg"},
];

const gallery = document.querySelector(".gallery");
temples.forEach(temple => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = temple.image;
    img.alt = '${temple.name} Temple';
    caption.textContent = temple.name;

    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
});
