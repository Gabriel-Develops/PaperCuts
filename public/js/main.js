document.querySelectorAll('.copy-code').forEach(x => x.addEventListener('click', copyCode))
function copyCode(e) {
    copyToClip(e.target.dataset.clubid)
}

document.querySelectorAll('.share-code-button').forEach(x => x.addEventListener('click', shareCode))
function shareCode(e) {
    const button = window.getComputedStyle(e.target)
    // Initial button styling reverts button dynamically to original style
    const initialBackgroundColor = button.backgroundColor
    const initialTextColor = button.color
    const initialText = e.target.textContent

    // Style we want when clicked
    const textToSet = 'Copied to Clipboard!'
    const colorToSet = '#344E41'
    const backgroundColorToSet = 'white'

    if (e.target.textContent !== textToSet) {
        // Reverts to original styling as long as it wasn't clicked already after 3 seconds
        setTimeout(() => {
            e.target.textContent = initialText
            e.target.style.backgroundColor = initialBackgroundColor
            e.target.style.color = initialTextColor
        }, 3000)
    }

    // Sets new styling for clicked button
    e.target.textContent = textToSet
    e.target.style.backgroundColor = backgroundColorToSet
    e.target.style.color = colorToSet
    copyToClip(e.target.dataset.clubid)
}

async function copyToClip(string) {
    await navigator.clipboard.writeText(string)
}