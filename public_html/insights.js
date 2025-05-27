document.addEventListener('DOMContentLoaded', function () {
    const toggleLink = document.getElementById('toggleLink');
    const collapseElement = document.getElementById('collapsetopics');

    const bsCollapse = new bootstrap.Collapse(collapseElement, {
        toggle: false
    });

    function updateLinkText() {
        if (collapseElement.classList.contains('show')) {
            toggleLink.innerHTML = 'See Less...';
        } else {
            toggleLink.innerHTML = 'See More...';
        }
    }

    toggleLink.addEventListener('click', function () {
        bsCollapse.toggle();
    });

    collapseElement.addEventListener('shown.bs.collapse', updateLinkText);
    collapseElement.addEventListener('hidden.bs.collapse', updateLinkText);
});