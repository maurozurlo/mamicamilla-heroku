const buttonText = ["Mehr lesen", "Weniger"]
const buttonClasses = ["button", "is-outline", "my-2", "mx-0"]
const maxLength = 1100

const insertAfter = (newNode, referenceNode) => {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

const changeReading = (button, id) => {
  const el = document.getElementById(id)
  if (el.classList.contains("short")) {
    el.classList.remove("short")
    el.style.height = `${el.getAttribute("data-height")}px`
    button.innerHTML = buttonText[1]
  } else {
    console.log(el.style.height)
    el.removeAttribute("style")
    el.classList.add("short")
    button.innerHTML = buttonText[0]
  }
}

const addReadMore = () => {
  const paragraphs = document.querySelectorAll("p")

  paragraphs.forEach((p) => {
    if (p.innerText.length > maxLength) {
      if (!p.hasAttribute("id")) {
        const randomId = Math.round(Date.now() * Math.random()).toString(36)
        p.setAttribute("id", randomId)
      }
      p.setAttribute("data-height", p.offsetHeight)
      const pId = p.getAttribute("id")
      const btn = document.createElement("button")
      btn.classList.add(...buttonClasses)
      changeReading(btn, pId)
      btn.onclick = () => changeReading(btn, pId)
      insertAfter(btn, p)
    }
  })
}