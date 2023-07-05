const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/loginHub")
.build();

a();
async function a() {
    const response = await fetch("/CheckAuthorize", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    });
    if (response.ok === true) {
        window.location.href = '/cabinet';
    }
};

document.getElementById("LoginButton").addEventListener("click", async e => {
    let user = JSON.stringify({
        Email: document.getElementById("EmailField").value,
        Password: document.getElementById("PasswordField").value
    });
    hubConnection.invoke("Login", user);
});

hubConnection.on("ShowMessage", function (message)
{
    document.getElementById("ServerMessage").textContent = message;
});

hubConnection.on("AuthorizeClient", function (tokens) 
{
    localStorage.setItem("accessToken", tokens.value.tokenA);
    localStorage.setItem("refreshToken", tokens.value.tokenR);
    window.location.href = '/cabinet';
});

hubConnection.start().then(function () { document.getElementById("LoginButton").disabled = false;})
.catch(function (err) { return console.error(err.toString());});
