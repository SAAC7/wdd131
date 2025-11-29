// Parse query string and show a summary
function getParams() {
    return new URLSearchParams(window.location.search);
}


const params = getParams();
const summaryEl = document.getElementById('summary');


if (params && params.toString() !== '') {
    // increment localStorage counter only when there are query params
    const key = 'reviewCount';
    let count = Number(localStorage.getItem(key)) || 0;
    count++;
    localStorage.setItem(key, count);
    document.getElementById('count').textContent = count;


    // Build a small summary table
    const productId = params.get('product') || '—';
    const product = (productId === '—') ? '—' : ((window.productNameFromId && window.productNameFromId(productId)) || productId);
    const rating = params.get('rating') || '—';
    const date = params.get('installDate') || '—';
    const name = params.get('userName') || '—';
    const reviewText = params.get('reviewText') || '—';


    summaryEl.innerHTML = `
<dl>
<dt>Product</dt><dd>${escapeHtml(product)}</dd>
<dt>Rating</dt><dd>${escapeHtml(rating)}</dd>
<dt>Date Installed</dt><dd>${escapeHtml(date)}</dd>
<dt>Name</dt><dd>${escapeHtml(name)}</dd>
<dt>Review</dt><dd>${escapeHtml(reviewText)}</dd>
</dl>
`;
} else {
    // no params: don't increment and show existing count
    const key = 'reviewCount';
    const count = Number(localStorage.getItem(key)) || 0;
    document.getElementById('count').textContent = count;
}


function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (m) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[m]; });
}


// small helper so review page can try to resolve product id back to name
window.productNameFromId = function (id) {
    const p = (window._productList || []).find(x => x.id === id);
    return p ? p.name : id;
}


// expose the same product array to the window so review page can show names
window._productList = "REPLACE_WITH_PRODUCTS";


// Update the placeholder with actual JSON (to be done immediately after this file loads)
(function replaceProducts() {
    try {
        const arr = "REPLACE_JSON";
        // if it's a string, parse; otherwise ignore
    } catch (e) { }
})();