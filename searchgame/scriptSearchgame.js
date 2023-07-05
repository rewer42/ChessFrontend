this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/searchHub")
    .build();

function TryUpdateToken()
{
    $.ajax({
        url:  "../Authorization/TryUpdate",
        method: 'post',   
        dataType: 'html',
        error: function () 
        {
            window.location.href = '/login';
        }
    }); 
}

async function start() {
    try 
    {
        await hubConnection.start();
        hubConnection.invoke("GetListGames");  
        document.getElementById("AddGame").disabled = false;
        return true;
    } catch (err) 
    {
        TryUpdateToken();
        setTimeout(start, 5000);
    }
};

hubConnection.onclose(async () => {
    if (!await start())
        window.location.href = '/login';
});


start();  
var SelectedRow = -1;

hubConnection.on("SetListLobby", function (data) //// todo adds every times all old records
{
    var array = data.value;
    let table = document.querySelector('#Table');
    table
    array.forEach(element => 
    {
	    let tr = document.createElement('tr');
        tr.id = "Row";
        tr.data = element.id;

        tr.addEventListener("click", function ()
        {
            if (SelectedRow != -1 && SelectedRow < table.rows.length)
                table.rows[SelectedRow].id = "Row";
            tr.id = "SelectedRow";
            SelectedRow = tr.rowIndex;
        });

		let td = document.createElement('td');
        td.id = "Cell";
		td.textContent = element.name;
		tr.appendChild(td);

		td = document.createElement('td');
        td.id = "Cell";
		td.textContent = element.email;
		tr.appendChild(td);
	        
	    table.appendChild(tr);
    });
})

document.getElementById("AddGame").addEventListener("click", function ()
{
    const Name = document.getElementById("NameField").value;
    const Password = document.getElementById("PasswordField").value;
    let data = JSON.stringify({
        name: Name,
        password: Password
    });
    hubConnection.invoke("CreateGame", data);

});
document.getElementById("Connect").addEventListener("click", function ()
{
    var table = document.querySelector('#Table');
    const Id = table.rows[SelectedRow].data;
    const Password = document.getElementById("PasswordGameField").value;
    let data = JSON.stringify({
        id: Id,
        password: Password
    });
    hubConnection.invoke("ConnectToGame", data);

});

hubConnection.on("RedirectToGame", (idGame) =>
{
    sessionStorage.setItem("gameId", idGame);
    window.location.href = '../game'
})
