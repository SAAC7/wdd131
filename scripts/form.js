// Product array
const products = [
    { id: "fc-1888", name: "Capacitor", avgRating: 4.5 },
    { id: "fc-2050", name: "Power Banks", avgRating: 4.7 },
    { id: "jj-1969", name: "Hoverboard", avgRating: 4.9 },
    { id: "rb-3000", name: "Time Watch", avgRating: 4.2 },
    { id: "sd-900", name: "Smart Door", avgRating: 4.1 }
];


//Product select
const sel = document.getElementById('product');
products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; // value is the id
    opt.textContent = p.name; // display is the name
    sel.appendChild(opt);
});


// Accessibility enhancement: show which radio is selected as text to screen readers
const ratingRadios = document.querySelectorAll('input[name="rating"]');
ratingRadios.forEach(r => r.addEventListener('change', (e) => {
    // nothing visual to do here; required attribute ensures selection
}));


// Simple client-side validation visual cue for required fields on submit
const form = document.getElementById('reviewForm');
form.addEventListener('submit', (e) => {
    // Let HTML5 validation run; but add a simple class so user sees where errors are
    if (!form.checkValidity()) {
        e.preventDefault();
        const firstInvalid = form.querySelector(':invalid');
        firstInvalid.focus();
        firstInvalid.style.outline = '3px solid rgba(176,0,32,0.25)';
        setTimeout(() => firstInvalid.style.outline = 'none', 2500);
    }
});