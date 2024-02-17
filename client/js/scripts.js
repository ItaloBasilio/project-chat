// login


const login = document.querySelector(".login")
const loginForm = login.querySelector(".login_form")
const loginInput = login.querySelector(".login_input")

// chat


const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat_form")
const chatInput = chat.querySelector(".chat_input")
const chatMessages = chat.querySelector(".chat_messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id:"", name:"", color:"" }

let websocket 

const createMessageSelfElement = (content) => {
    const div = document.createElement( "div" )

    div.classList.add("message-self")
    div.innerHTML = content
    
    return div
}


const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement( "div" )
    const span = document.createElement( "span" )

    div.classList.add("message-other")

    div.classList.add("message-self")
    span.classList.add("message-sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender

    div.innerHTML += content
    
    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors [randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data })=>{
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message = userId == user.id 
        ? createMessageSelfElement(content)
        : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()

}

const handleLogin = (event) =>{
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-backend-q33p.onrender.com")
    websocket.onmessage = processMessage

}



const sendMessage = (event)=>{
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin )
chatForm.addEventListener("submit", sendMessage )