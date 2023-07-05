$.ajax({
    url:  "../Authorization/ThisAuthorized",
    method: 'post',   
    dataType: 'html',
    success: function() {window.location.href = '/cabinet';},
    error: function() {
        $.ajax({
            url:  "../Authorization/TryUpdate",
            method: 'post',   
            dataType: 'html',
            success: function() {window.location.href = '/cabinet';},
        });
    }
});
document.getElementById("RegisterButton").addEventListener("click", function ()
{
    const Name = document.getElementById("NameField").value;
    const Email = document.getElementById("EmailField").value;
    const Password = document.getElementById("Pass").value;
    const RepPassword = document.getElementById("PassRepeat").value;

    if (Password == RepPassword && Name.length > 0 && Email.length > 0 && Password.length > 5) {
        let user = JSON.stringify({
            UserName: Name,
            Password: Password,
            Email: Email
        });

        $.ajax({
            url:  "../Authorization/TryRegister",         
            method: 'post',             
            dataType: 'html',          
            data: { data: user },
            error: function(e)
            {
                document.getElementById("Message").textContent = "Error: uncorrect password and/or email";
            },
            success: function() {window.location.href = '/cabinet';},
        });
    }
    else if (Name.length < 1)
        NonName();
    else if (Password.length < 1)
        NonPass();
    else
        NonEmail();
});

function NonName()
{
    document.getElementById("ServerMessage").textContent = "Name";
}
function NonPass()
{
    document.getElementById("ServerMessage").textContent = "Pass";
}
function NonEmail()
{
    document.getElementById("ServerMessage").textContent = "Email";
}
