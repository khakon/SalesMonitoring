Debts.configAPI = window.Debts.configAPI || {};
(function () {
    var config = {
        entities: function (entity) {
            var urls = {
                supers: 'api/sales',
                agents: 'api/sales_agents',
                customers: 'api/sales_customers',
                root: 'api/sales_root',
                groups: 'api/sales_groups',
            }
            return urls[entity];
        }
    };
    $.extend(Debts.configAPI, config);
})();