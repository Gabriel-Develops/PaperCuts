document.querySelectorAll('.copy-code').forEach(x => x.addEventListener('click', shareCode))
async function shareCode(e) {
    // Initial button text to be reverted to
    const initialText = e.target.textContent

    // Text we want when clicked
    const textToSet = 'Copied!'

    if (e.target.textContent !== textToSet) {
        // Reverts to original text as long as text does not match new text
        setTimeout(() => {
            e.target.textContent = initialText
        }, 3000)
    }

    // Sets new text for clicked button
    e.target.textContent = textToSet
    // Finally copies clubId to clipboard
    await navigator.clipboard.writeText(e.target.dataset.clubid)
}