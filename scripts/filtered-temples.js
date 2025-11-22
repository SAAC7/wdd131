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
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, United States",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, United States",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, United States",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl:
            "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },
    // Add more temple objects here...
    {
        templeName: "Quetzaltenango Guatemala",
        location: "Quetzaltenango, Guatemala",
        dedicated: "2011, December, 11",
        area: 21085,
        imageUrl:
            "images/quetzaltenango-guatemala-temple-3959.jpg"
    },
    {
        templeName: "Guatemala City Guatemala",
        location: "Guatemala City, Guatemala",
        dedicated: "1984, December, 14",
        area: 11610,
        imageUrl:
            "https://churchofjesuschristtemples.org/assets/img/temples/guatemala-city-guatemala-temple/guatemala-city-guatemala-temple-6415-main.jpg"
    },
    {
        templeName: "Cobán Guatemala",
        location: "Cobán, Guatemala",
        dedicated: "2024, June, 9",
        area: 8772,
        imageUrl:
            "images/coban-guatemala-temple-47554.jpg"
    },
    {
        templeName: "Rome Italy",
        location: "Rome, Italy",
        dedicated: "2019, March, 10",
        area: 41010,
        imageUrl:
            "https://churchofjesuschristtemples.org/assets/img/temples/rome-italy-temple/rome-italy-temple-2642-main.jpg"
    },
    {
        templeName: "Tijuana Mexico",
        location: "Tijuana, Mexico",
        dedicated: "2015, December, 13",
        area: 33367,
        imageUrl:
            "https://churchofjesuschristtemples.org/assets/img/temples/tijuana-mexico-temple/tijuana-mexico-temple-14590-main.jpg"
    },


];

createTempleCard(temples);
document.getElementById("home-link").addEventListener("click", () => {
    createTempleCard(temples);
});

document.getElementById("old-link").addEventListener("click", () => {
    createTempleCard(temples.filter(temple => new Date(temple.dedicated) < new Date("1900-01-01")));
});
document.getElementById("new-link").addEventListener("click", () => {
    createTempleCard(temples.filter(temple => new Date(temple.dedicated) > new Date("2000-01-01")));
});
document.getElementById("large-link").addEventListener("click", () => {
    createTempleCard(temples.filter(temple => temple.area > 90000));
});
document.getElementById("small-link").addEventListener("click", () => {
    createTempleCard(temples.filter(temple => temple.area < 10000));
});



function createTempleCard(filteredTemples) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    filteredTemples.forEach(temple => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const caption = document.createElement("figcaption");
        const locationDiv = document.createElement("div");
        const dedicatedDiv = document.createElement("div");
        const areaDiv = document.createElement("div");

        locationDiv.innerHTML = `<b>Location:</b> ${temple.location}`;
        dedicatedDiv.innerHTML = `<b>Dedicated:</b> ${temple.dedicated}`;
        areaDiv.innerHTML = `<b>Area:</b> ${temple.area.toLocaleString()} sq ft`;
        img.src = temple.imageUrl;
        img.alt = `${temple.templeName} Temple`;
        img.loading = "lazy";
        caption.textContent = temple.templeName;

        figure.appendChild(caption);
        figure.appendChild(locationDiv);
        figure.appendChild(dedicatedDiv);
        figure.appendChild(areaDiv);
        figure.appendChild(img);
        gallery.appendChild(figure);
    });
}

