// document.getElementById("UserName").textContent = UserInfo.value.Name;
$.ajax({
    url:  "../Authorization/ThisAuthorized",
    method: 'post',   
    dataType: 'html',
    error: function() {
        $.ajax({
            url:  "../Authorization/TryUpdate",
            method: 'post',   
            dataType: 'html',
            error: function () 
            {
                window.location.href = '/login';
            }
        }); 
    },
});

document.getElementById("Logout").addEventListener("click", function () {
    $.ajax({
        url:  "../Authorization/Logout",
        method: 'post',   
        dataType: 'html',
        success: function() {window.location.href = '/login';},
    });
    window.location.replace('/login');
});

