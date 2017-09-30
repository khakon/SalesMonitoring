var Debts = window.Debts || {};
Debts.view = function () {
    var urlSuper = Debts.configAPI.entities('supers'),
    urlAgent = Debts.configAPI.entities('agents'),
    urlCust = Debts.configAPI.entities('customers'),
    urlRoot = Debts.configAPI.entities('root'),
    urlGroup = Debts.configAPI.entities('groups'),
    agents = ko.observableArray([]),
    customers = ko.observableArray([]),
    products = ko.observableArray([]),
    customerProducts = ko.observableArray([]),
    modeSuper = ko.observable(true),
    modeProduct = ko.observable(true),
    _groups = ko.observableArray([]),
    _groupsCustomer = ko.observableArray([]),
    _super = ko.observable('0'),
    _agent = ko.observable('0'),
    _customer = ko.observable('0'),
    _product = ko.observable('0'),
    isLoad = ko.observable(false),
    visiblePopupGrid = ko.observable(false),
    supers = ko.observableArray([]);
    ////handlers/////
    var selectSuper = function () {
        isLoad(true);
        _agent('0');
        _customer('0');
        if (_product() == '0') $.when(loadAgents(), loadRootGroups(products)).done(function () { isLoad(false); });
        else $.when(loadAgents()).done(function () { isLoad(false); });
    };
    var clickRootSuper = function () {
        isLoad(true);
        _super('0');
        _agent('0');
        _customer('0');
        _product('0');
        _groups([]);
        loadRootList();
    };
    var selectAgent = function () {
        isLoad(true);
        _customer('0');
        //_product('0');
        customerProducts([]);
        if (_product() == '0') loadRootGroups(products).done(function () { isLoad(false); });
    };
    var clickAgent = function (id) {
        isLoad(true);
        $.when(loadCustomers(id)).done(function () { isLoad(false); });
        visiblePopupGrid(true);
        isLoad(false);    
    };
    var clickRootAgent = function () {
        _agent('0');
        _customer('0');
        //  _product('0');
        if (_product() == '0') {
            _groups([]);
            loadRootGroups(products);
        }
        else {
            _super('0');
            isLoad(true);
            loadAgents().done(function () { isLoad(false); });
        }
    };
    var selectCustomer = function () {
        loadRootGroups(customerProducts)
    };
    var selectProduct = function (id, parent,el) {
        isLoad(true);
        _super('0');
        _agent('0');
        _customer('0');
        if (_product() == '0') loadGroups(products, parent);
        _product(id);
        $.when(loadAgents(), loadSupers()).done(function () {
            isLoad(false);
        });
    };
    var clickProduct = function (id,parent) {
        var result = _groups();
        result.push(parent);
        _groups(result);
        loadGroups(products,id);
    };
    var clickUpProduct = function () {
        var id = '0';
        var result = _groups();
        if (result.length > 1) {
            id = result.pop();
            _groups(result);
        }
        loadGroups(products, id);
    };
    var clickRootProduct = function () {
         _groups([]);
        loadRootGroups(products);
    };
    var clickCustomerProduct = function (id) {
        loadGroups(customerProducts,id);
    };
    var clickUpCustomerProduct = function () {
        var id = '0';
        var result = _groupsCustomer();
        if (result.length > 1) {
            id = result.pop();
            _groupsCustomer(result);
        }
        loadGroups(customerProducts, id);
    };
    var clickRootCustomerProduct = function () {
        _groupsCustomer([]);
        loadRootGroups(customerProducts);
    };
    var popupHidden = function () {
        _customer('0');
    }
    ////handlers end/////
    ///loaders///
    var loadRootList = function () {
        isLoad(true);
        $.when(loadSupers(), loadAgents(), loadRootGroups(products)).done(function () { isLoad(false); })
    }
    var loadSupers = function () {
        var d = new $.Deferred();
        Debts.db.api(urlSuper).getById({ product: _product() }).done(function (result) {
            ko.utils.arrayForEach(result, function (item) {
                item.quant = Math.round((item.quant) * 100) / 100;
                item.total = Math.round((item.total) * 100) / 100;
            });
            result.sort(function (l, r) { return l.super > r.super ? 1 : -1; });
            supers(result);
            d.resolve();
        });
        return d.promise();
    }
    var loadAgents = function () {
        var d = new $.Deferred();
        Debts.db.api(urlAgent).getById({ id: _super(), product: _product() }).done(function (result) {
            ko.utils.arrayForEach(result, function (item) {
                item.quant = Math.round((item.quant) * 100) / 100;
                item.total = Math.round((item.total) * 100) / 100;
            });
            result.sort(function (l, r) { return l.agent > r.agent ? 1 : -1; });
            agents(result);
            d.resolve();
        });
        return d.promise();
    },
    loadRootGroups = function (list) {
        var d = new $.Deferred();
        isLoad(true);
        var s = _super();
        var a = _agent();
        var c = _customer();
        if (_product() != '0') {
            s = '0';
            a = '0';
            c = '0';
        }
        Debts.db.api(urlRoot).getById({ sup: s, agent:a, cust:c }).done(function (result) {
            ko.utils.arrayForEach(result, function (item) {
                item.quant = Math.round((item.quant) * 100) / 100;
                item.total = Math.round((item.total) * 100) / 100;
            });
            result.sort(function (l, r) { return l.grup > r.grup ? 1 : -1; });
            list(result);
            isLoad(false);
            d.resolve();
        });
        return d.promise();
    },
    loadGroups = function (list,id) {
        var d = new $.Deferred();
        isLoad(true);
        var s = _super();
        var a = _agent();
        var c = _customer();
        if (_product() != '0') {
            s = '0';
            a = '0';
            c = '0';
        }
        Debts.db.api(urlGroup).getById({ parent: id, supr: s, agent: a, cust: c }).done(function (result) {
            ko.utils.arrayForEach(result, function (item) {
                item.quant = Math.round((item.quant) * 100) / 100;
                item.total = Math.round((item.total) * 100) / 100;
            });
            result.sort(function (l, r) { return l.grup > r.grup ? 1 : -1; });
            list(result);
            isLoad(false);
            d.resolve();
        });
        return d.promise();
    },
    loadCustomers = function (id) {
        Debts.db.api(urlCust).getById({ agent: id, product: _product() }).done(function (result) {
            ko.utils.arrayForEach(result, function (item) {
                item.quant = Math.round((item.quant) * 100) / 100;
                item.total = Math.round((item.total) * 100) / 100;
            });
            result.sort(function (l, r) { return l.customer > r.customer ? 1 : -1; });
            customers(result);
        });
    };
    ///loaders end///
    var init = function () {
        _super('0');
        _agent('0');
        _customer('0');
        _product('0');
        loadRootList();
    }
    init();
    return {
        supers: supers,
        isLoad:isLoad,
        gridSaleSupersOptions: Debts.configView.gridSaleSupersOptions(selectSuper, _super, supers, clickRootSuper),
        gridSaleAgentsOptions: Debts.configView.gridSaleAgentsOptions(selectAgent, clickAgent, _agent, agents, clickRootAgent),
        gridSaleCustomersOptions: Debts.configView.gridSaleCustomersOptions(selectCustomer, _customer, customers),
        gridProductsOptions: Debts.configView.gridProductsOptions(selectProduct, clickProduct, _product, products, clickUpProduct, clickRootProduct),
        gridCustomerProductsOptions: Debts.configView.gridCustomerProductsOptions(clickCustomerProduct, customerProducts, clickUpCustomerProduct, clickRootCustomerProduct),
        popupSaleOptionsGrid: Debts.configView.popupSaleOptionsGrid(visiblePopupGrid, popupHidden),
        toolbarOptions: Debts.configView.toolbarOptions(loadRootGroups, products, _agent, _customer),
        toolbarCustomerOptions: Debts.configView.toolbarCustomerOptions(loadRootGroups, customerProducts),
        agents: agents
    };
}
ko.applyBindings(Debts.view());
