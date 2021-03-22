const submit = document.getElementById("submit")
const username = document.getElementById("username")
const password = document.getElementById("password")
const srvResponse = document.getElementById("response")

const submitData = async(event) => {
    event.preventDefault()

    const data = {
        username: username.value,
        password: password.value
    }

    if (!data.username || !data.password) return alert("Fields can't be empty")
    StartLoading(submit)

    const req = await fetch(`${baseURL}user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const res = await req.json();

    if (req.status === 400)
        srvResponse.innerHTML = createNotification('danger','notification',res.message)
        srvResponse.classList.add('my-2')
        StopLoading(submit)
    if (req.status === 200) {
        const {
            auth,
            token
        } = res
        if (auth) {
            window.location.href = `/admin/dashboard?token=${token}`
        }
    }
}
