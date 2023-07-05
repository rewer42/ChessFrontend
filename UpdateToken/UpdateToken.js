$.ajax({
    url: 'tryUpdate',
    method: 'post',
    dataType: 'html',
    error: function () {
        window.location.href = '/login';
    }
});

