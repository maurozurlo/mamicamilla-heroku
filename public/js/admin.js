const storeToken = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  if (token !== undefined) {
    localStorage.setItem('authToken', token)
  }
}
