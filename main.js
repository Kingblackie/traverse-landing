import './style.css'

// Image Slider
const slideBtns = document.querySelectorAll('[data-slide-btn]')
const slideContainer = document.querySelector('[data-slide-container]')
const slides = [...document.querySelectorAll('[data-slide]')]
let currentIndex = 0
let isMoving = false

// Btn handle function
const handleSlideBtnClick = e => {  
  if (isMoving) return
  isMoving = true
  e.currentTarget.id === 'prev' ? currentIndex-- : currentIndex++
  slideContainer.dispatchEvent(new Event('slidermove'))
}

// Remove/add Attribute function
const removeDisabledAttribute = (elements) => elements.forEach(element => element.removeAttribute('disabled'))
const addDisabledAttribute = (elements) => elements.forEach(element => element.setAttribute('disabled', 'true'))

// Event Listeners
slideBtns.forEach(btn => btn.addEventListener('click', handleSlideBtnClick))
slideContainer.addEventListener('slidermove', () => {
  // 1. Translate container to right or left
  slideContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`
  // 2. Remove disabled attributes
  removeDisabledAttribute(slideBtns)
  // 3. Re-enable disabled attributes if needed
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]])
})
// Transitionend Event
slideContainer.addEventListener('transitionend', () => isMoving = false)

// Disable image drag events
document.querySelectorAll('[data-slide] img').forEach(img => img.ondragstart = () => false)

// Intersection observer for slider
const slideObserver = new IntersectionObserver((slide) => {
  if (slide[0].isIntersecting) {
    addDisabledAttribute([slideBtns[1]])
  }
}, {threshold: .75})
slideObserver.observe(slides[slides.length - 1])

// Form Submit Handle
const contactForm = document.querySelector('#contact-form')
const contactBtn = document.querySelector('#contact-btn')
const contactInput = document.querySelector('#email')

// Fake sending email to API endpoint
const postEmailToDb = (email) => {
  console.info(`Your email is ${email}`)
  return new Promise(resolve => setTimeout(resolve, 2000))
}

// Options for submit button 
const contatctBtnOptions = {
  pending: `
    <svg xmlns="http://www.w3.org/2000/svg" class='animate-spin' width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm88,88H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg> 
    <span class='uppercase tracking-wide'>Sending...</span>
  `,
  success: `
    <span class='uppercase tracking-wide'>Thank You!</span>
    <span class='uppercase tracking-wide'>✌🏻</span>
  `
}

// Submit Function
const handleFormSubmit = async (e) => {
  e.preventDefault()
  addDisabledAttribute([contactForm, contactBtn])
  contactBtn.innerHTML = contatctBtnOptions.pending
  const userEmail = contactInput.value
  contactInput.style.display = 'none'
  await postEmailToDb(userEmail)
  contactBtn.innerHTML = contatctBtnOptions.success
}

// Event Listeners For Form
contactForm.addEventListener('submit', handleFormSubmit)

// Fade up observer
const fadeUpObserverCallback = (elsToWatch) => {
  elsToWatch.forEach((el) => {
    if (el.isIntersecting) {
      el.target.classList.add('faded')
      fadeUpObserver.unobserve(el.target)
      el.target.addEventListener('transitionend', () => {
        el.target.classList.remove('fade-up', 'faded')
      }, {once: true})
    }

  })
}

const fadeUpObserverOptions = {
  threshold: .6
}

const fadeUpObserver = new IntersectionObserver(fadeUpObserverCallback, fadeUpObserverOptions)

document.querySelectorAll('.fade-up').forEach(item => {
  fadeUpObserver.observe(item)
})