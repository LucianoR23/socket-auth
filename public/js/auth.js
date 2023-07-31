
const miForm = document.querySelector('form')

const url = ( window.location.hostname.includes('localhost') ) 
            ? 'http://localhost:8084/api/auth/' 
            : 'http://localhost:8080/api/auth/';

miForm.addEventListener('submit', ev => {
    ev.preventDefault();


})

function handleCredentialResponse(response) {
  // Google token
  // console.log( 'id_token', response.credential );

const body = { id_token: response.credential };

fetch( url + 'google', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
})  .then((resp) => resp.json())
    .then(( {token} ) => {
        localStorage.setItem("token", token);
    })
    .catch(console.warn);
}

const button = document.getElementById("google-sign-out");
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
});

};
