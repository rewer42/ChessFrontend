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

document.getElementById("LoginButton").addEventListener("click", function () 
{
    const Email = document.getElementById("EmailField").value;
    const Password = document.getElementById("Pass").value;
    
    if (Password.length > 4 && Email.length > 0) {
        let user = JSON.stringify({
            Password: Password,
            Email: Email
        });
        $.ajax({
            url:  "../Authorization/TryLogin",         
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
    else if (Password.length < 1)
        NonPass();
    else
        NonEmail();
});

function NonPass() {
    document.getElementById("Message").textContent = "Error: uncorrect password";
}
function NonEmail() {
    document.getElementById("Message").textContent = "Error: uncorrect email";
}