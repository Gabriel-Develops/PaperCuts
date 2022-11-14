document.querySelectorAll('.copy-code').forEach(x => x.addEventListener('click', copyCode))
async function copyCode(e) {
    console.log(e.target.dataset.clubid)
    await navigator.clipboard.writeText(e.target.dataset.clubid)
}