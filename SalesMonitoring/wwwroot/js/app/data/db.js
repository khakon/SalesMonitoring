Debts.dbREST = window.Debts.dbREST || {};
Debts.dbREST = {
    loadDataPar: function (url, par) {
        var d = new $.Deferred();
        return $.getJSON(url, par, function (result) { d.resolve(result);});
        return d.promise();
    },
    loadData: function (url) {
        return $.getJSON(url);
    },
    sendPost: function (url, par) {
        return $.post(url, par);
    },
    delete: function (url, id) {
        var d = new $.Deferred();
        $.ajax({
            url: url + '/' + id,
            type: "DELETE",
            success: function (result) {
                d.resolve(result);
            }
        });
        return d.promise();
    },
}
