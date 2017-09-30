Debts.db = window.Debts.db || {};
(function () {
    var db = {
        api: function (url) {
            return {
                get: function () {
                    var d = new $.Deferred();
                    $.when(Debts.dbREST.loadData(url)).done(function (response) {
                        d.resolve(response.model);
                    });
                    return d.promise();
                },
                getById: function (par) {
                    var d = new $.Deferred();
                    Debts.dbREST.loadDataPar(url, par).done(function (response) {
                        d.resolve(response.model);
                    });
                    return d.promise();
                },
                add: function (par) {
                    var d = new $.Deferred();
                    $.when(Debts.dbREST.sendPost(url, par)).done(function (response) {
                        d.resolve(response);
                    });
                    return d.promise();
                },
                delete: function (id) {
                    var d = new $.Deferred();
                    Debts.dbREST.delete(url, id).done(function (response) {
                        d.resolve(response);
                    });
                    return d.promise();
                }

            };
        }
    };
    $.extend(Debts.db, db);
})();