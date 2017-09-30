window.Debts.configView = window.Debts.configView || {};
(function () {
    var config = {
        commonGridOptions: function (list) {
            return {
                dataSource: list,
                sorting: {
                    mode: "multiple"
                },
                headerFilter: {
                    visible: true
                },
                paging: {
                    pageSize: 30
                },
                selection: { mode: 'single', deferred: true },
                hoverStateEnabled: true,
            }
        },
        gridSaleSupersOptions: function (handlerSelect, value, list, clickRoot) {
            var conf = {
                columns: [{ dataField: 'super', caption: "Department" },
                    { dataField: 'quant', caption: "Quant" },
                    { dataField: 'total', caption: "Sum" }],
                onSelectionChanged: function (selectedItems) {
                    selectedItems.component.getSelectedRowsData().done(function (d) {
                        value(d[0].code);
                        handlerSelect();
                    });
                }, onToolbarPreparing: function (e) {
                    var toolbarItems = e.toolbarOptions.items;
                    toolbarItems.push({
                        widget: 'dxButton',
                        options: { icon: 'pulldown', onClick: clickRoot, text:'Reload'},
                        location: 'before'
                    });
                },
                onCellPrepared: function (options) {
                    if (options.rowType == "data" && options.columnIndex > 0) options.cellElement.text(Utils.numberWithSpaces(options.value));
                },
                summary: {
                    totalItems: [{
                        column: 'quant',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    },
                    {
                        column: 'total',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    }]
                }
            };
            return $.extend(config.commonGridOptions(list), conf);
        },
        gridSaleAgentsOptions: function (selectHandler, clickHandler, value, list, clickRoot) {
            var conf = {
                columns: [{
                        caption: "",width:30, cellTemplate: function (container, options) {
                            $('<a/>').addClass('dx-button')
                                .html('<span class="dx-icon-search icon">')
                                .on('dxclick', function () {
                                    clickHandler(options.data.code);
                                })
                                .appendTo(container);
                        }
                    },
                    { dataField: 'agent', caption: "Agent" },
                    { dataField: 'quant', caption: "Quant" },
                    { dataField: 'total', caption: "Sum" }],
                onSelectionChanged: function (selectedItems) {
                    selectedItems.component.getSelectedRowsData().done(function (d) {
                        value(d[0].code);
                        selectHandler(list);
                    });
                }, onToolbarPreparing: function (e) {
                    var toolbarItems = e.toolbarOptions.items;
                    toolbarItems.push({
                        widget: 'dxButton',
                        options: { icon: 'pulldown', onClick: clickRoot,text:'Reload' },
                        location: 'before'
                    });
                },
                onCellPrepared: function (options) {
                    if (options.rowType == "data" && options.columnIndex > 1) options.cellElement.text(Utils.numberWithSpaces(options.value));
                },
                summary: {
                    totalItems: [{
                        column: 'quant',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    },
                    {
                        column: 'total',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    }]
                }
            };
            return $.extend(config.commonGridOptions(list), conf);
        },
        gridSaleCustomersOptions: function (selectHandler, value,list) {
            var conf = {
                headerFilter: {
                    visible: true
                },
                searchPanel: {
                    visible: true,
                    width: 240,
                    placeholder: "Поиск..."
                },
                paging: {
                    pageSize: 15
                },
                columns: [{ dataField: 'customer', caption: "Customer", width: 250 },
                    { dataField: 'quant', caption: "Quant" },
                    { dataField: 'total', caption: "Sum" }],
                onSelectionChanged: function (selectedItems) {
                    selectedItems.component.getSelectedRowsData().done(function (d) {
                        value(d[0].code);
                        selectHandler();
                    });
                },
                onCellPrepared: function (options) {
                    if (options.rowType == "data" && options.columnIndex > 0) options.cellElement.text(Utils.numberWithSpaces(options.value));
                },
                summary: {
                    totalItems: [{
                        column: 'quant',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    },
                    {
                        column: 'total',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    }]
                }
            };
            return $.extend(config.commonGridOptions(list), conf);
        },
        gridProductsOptions: function (selectHandler, clickHandler, value, list, clickUp, clickRoot) {
            var conf = {
                keyExpr: "code",
                columns: [{
                    caption: "", width: 32, cellTemplate: function (container, options) {
                        if (options.data.isfolder) {
                            $('<a/>').addClass('dx-button')
                                .html('<span class="dx-icon-plus icon">')
                                .on('dxclick', function () {
                                    clickHandler(options.data.code, options.data.parent);
                                })
                                .appendTo(container);
                        }
                        else {
                            $('<span/>').text('').appendTo(container);
                        }
                    }
                },
                    { dataField:"grup", caption: "Product", width: 200 },
                    { dataField: 'quant', caption: "Quant" },
                    { dataField: 'total', caption: "Sum" },
                    { dataField: 'code', visible: false }],
                onSelectionChanged: function (selectedItems) {
                    $.when(selectedItems.component.getSelectedRowsData(), selectedItems.component.getSelectedRowKeys()).done(function (d,k) {
                        var el = $('.prod tr.dx-selection');
                        selectHandler(d[0].code, d[0].parent, el);
                    });
                },
                onToolbarPreparing: function (e) {
                    var toolbarItems = e.toolbarOptions.items;
                    toolbarItems.push({
                        widget: 'dxButton', 
                        options: { icon: 'chevronup', onClick: clickUp, text:'Up' },
                        location: 'before'
                    }, {
                        widget: 'dxButton',
                        options: { icon: 'arrowup', onClick: clickRoot, text:'Root' },
                        location: 'before'
                    });
                },
                onCellPrepared: function (options) {
                    if (options.rowType == "data" && options.columnIndex > 1) options.cellElement.text(Utils.numberWithSpaces(options.value));
                },
                summary: {
                    totalItems: [{
                        column: 'quant',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    },
                    {
                        column: 'total',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    }]
                }
            };
            return $.extend(config.commonGridOptions(list), conf);
        },
        gridCustomerProductsOptions: function (clickHandler, list, clickUp, clickRoot) {
            var conf = {
                columns: [{
                    caption: "Товар", width: 200, cellTemplate: function (container, options) {
                        if (options.data.isfolder) {
                            $('<a/>').addClass('dx-link')
                                .text(options.data.grup)
                                .on('dxclick', function () {
                                    clickHandler(options.data.code);
                                })
                                .appendTo(container);
                        }
                        else {
                            $('<span/>').text(options.data.grup).appendTo(container);
                        }
                    }
                }, 
                    { dataField: 'quant', caption: "Quant" },
                    { dataField: 'total', caption: "Sum" }],
                onCellPrepared: function (options) {
                    if (options.rowType == "data" && options.columnIndex > 0) options.cellElement.text(Utils.numberWithSpaces(options.value));
                }, onToolbarPreparing: function (e) {
                    var toolbarItems = e.toolbarOptions.items;
                    toolbarItems.push({
                        widget: 'dxButton',
                        options: { icon: 'chevronup', onClick: clickUp },
                        location: 'before'
                    }, {
                        widget: 'dxButton',
                        options: { icon: 'arrowup', onClick: clickRoot },
                        location: 'before'
                    });
                },
                summary: {
                    totalItems: [{
                        column: 'quant',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    },
                    {
                        column: 'total',
                        summaryType: 'sum',
                        customizeText: function (data) { return Utils.numberWithSpaces(data.value); }
                    }]
                }
            };
            return $.extend(config.commonGridOptions(list), conf);
        },
        popupSaleOptionsGrid: function (visiblePopupGrid, popupHidden) {
            return {
                width: 1100,
                height: 750,
                contentTemplate: "customers",
                showTitle: true,
                title: "Sales by customer",
                visible: visiblePopupGrid,
                closeOnOutsideClick: true,
                resizeEnabled: true,
                dragEnabled: true,
                onHidden: popupHidden
            }
        },
        toolbarOptions: function (groups, list,agent,customer) {
            return {
                items: [{
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        type: 'back',
                        text: 'Back',
                        onClick: function () {
                            groups(list);
                        }
                    }
                }, {
                    location: 'before',
                    widget: 'dxButton',
                    options: {
                        text: 'Department',
                        onClick: function () {
                            customer('0');
                            agent('0');
                            groups(list);
                        }
                    }
                }]
            };
        },
        toolbarCustomerOptions: function (groups, list) {
            return {
                items: [{
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        type: 'back',
                        text: 'Back',
                        onClick: function () {
                            groups(list);
                        }
                    }
                }]
            };
        }
    };
    $.extend(Debts.configView, config);
})()
