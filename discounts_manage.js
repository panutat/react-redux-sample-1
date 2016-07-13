var style = {
    container: {
        margin: '0px 6px',
        width: '100%'
    },
    createDiscount: {
        backgroundColor: '#f3f3f3',
        padding: '15px',
        textAlign: 'left'
    },
    listDiscount: {
        marginBottom: '20px'
    },
    heading: {
        paddingLeft: '0px'
    },
    fieldSmall: {
        width: '80px',
        marginRight: '10px'
    },
    fieldTinyInline: {
        width: '35px',
        padding: '2px 4px',
        fontSize: '12px'
    },
    fieldLarge: {
        width: '100px',
        marginRight: '10px'
    },
    table: {
        width: '100%',
        border: '1px solid #eeeeee',
        borderCollapse: 'collapse'
    },
    tableCell: {
        textAlign: 'left',
        padding: '8px 15px',
        border: '1px solid #eeeeee'
    },
    tableCellCode: {
        textAlign: 'left',
        padding: '8px 15px',
        border: '1px solid #eeeeee',
        fontFamily: 'Courier',
        fontSize: '13px'
    },
    tableCellCenter: {
        padding: '8px 15px',
        border: '1px solid #eeeeee'
    },
    tableCellRight: {
        textAlign: 'right',
        padding: '8px 15px',
        border: '1px solid #eeeeee'
    },
    tableCellEmpty: {
        padding: '20px'
    },
    tableHeader: {
        backgroundColor: '#dddddd'
    },
    tableButton: {
        padding: '5px 12px',
        margin: '0 2px'
    }
}

function formatDecimal(number) {
    var decimalplaces = 2;
    var decimalcharacter = ".";
    var thousandseparater = ",";
    number = parseFloat(number);
    var sign = number < 0 ? "-" : "";
    var formatted = new String(number.toFixed(decimalplaces));
    if (decimalcharacter.length && decimalcharacter != ".") {
        formatted = formatted.replace(/\./, decimalcharacter);
    }
    var integer = "";
    var fraction = "";
    var strnumber = new String(formatted);
    var dotpos = decimalcharacter.length ? strnumber.indexOf(decimalcharacter) : -1;
    if (dotpos > -1) {
        if (dotpos) {
            integer = strnumber.substr(0, dotpos);
        }
        fraction = strnumber.substr(dotpos + 1);
    } else {
        integer = strnumber;
    }
    if (integer) {
        integer = String(Math.abs(integer));
    }
    while (fraction.length < decimalplaces) {
        fraction += "0";
    }
    var temparray = new Array();
    while (integer.length > 3) {
        temparray.unshift(integer.substr(-3));
        integer = integer.substr(0, integer.length - 3);
    }
    temparray.unshift(integer);
    integer = temparray.join(thousandseparater);
    return sign + integer + decimalcharacter + fraction;
}

var DiscountCodeList = React.createClass({
    handleEdit: function(code, e) {
        e.preventDefault();

        var updateCode = code;
        updateCode.editable = true;

        var codes = this.props.codes.map(function(code) {
            if (code.id != updateCode.id) {
                return code;
            } else {
                return updateCode;
            }
        });
        this.handleSetState(codes);
    },
    handleSave: function(code, e) {
        e.preventDefault();

        var updateCode = code;
        updateCode.editable = false;

        var codes = this.props.codes.map(function(code) {
            if (code.id != updateCode.id) {
                return code;
            } else {
                return updateCode;
            }
        });
        this.handleSetState(codes);
    },
    handleDelete: function(code, e) {
        e.preventDefault();
        alert('Delete ' + code.code);
    },
    handleCheck: function(code, e) {
        e.preventDefault();
        alert('Check ' + code.code);
    },
    handleSetState: function(codes) {
        this.props.handleSetState(codes);
    },
    render: function() {
        var parent = this;
        var codes = this.props.codes.map(function(code) {
            if (code.editable) {
                return (
                    <tr key={code.id}>
                        <td style={style.tableCellCode}>{code.code}</td>
                        <td style={style.tableCellCenter} width="1">{code.type}</td>
                        <td style={style.tableCellCenter} width="1">
                            {code.type == 'P' ? formatDecimal(code.amount) + '%' : '$' + formatDecimal(code.amount)}
                        </td>
                        <td style={style.tableCellCenter} width="60">
                            <input type="text" ref={'minimum_' + code.id} style={style.fieldTinyInline} defaultValue={formatDecimal(code.minimum)} />
                        </td>
                        <td style={style.tableCellCenter} width="60">
                            <input type="text" ref={'minimum_' + code.id} style={style.fieldTinyInline} defaultValue={code.redeem_limit} />
                        </td>
                        <td style={style.tableCellCenter} width="1">
                            <input type="checkbox" defaultChecked={code.active} onClick={parent.handleCheck.bind(parent, code)} />
                        </td>
                        <td style={style.tableCell} width="125">
                            <button style={style.tableButton} onClick={parent.handleDelete.bind(parent, code)}>Delete</button>
                            <button style={style.tableButton} onClick={parent.handleSave.bind(parent, code)}>Save</button>
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={code.id}>
                        <td style={style.tableCellCode}>{code.code}</td>
                        <td style={style.tableCellCenter} width="1">{code.type}</td>
                        <td style={style.tableCellCenter} width="1">
                            {code.type == 'P' ? formatDecimal(code.amount) + '%' : '$' + formatDecimal(code.amount)}
                        </td>
                        <td style={style.tableCellCenter} width="60">{'$' + formatDecimal(code.minimum)}</td>
                        <td style={style.tableCellCenter} width="60">{code.redeem_limit}</td>
                        <td style={style.tableCellCenter} width="1">
                            <input type="checkbox" defaultChecked={code.active} onClick={parent.handleCheck.bind(parent, code)} />
                        </td>
                        <td style={style.tableCell} width="125">
                            <button style={style.tableButton} onClick={parent.handleDelete.bind(parent, code)}>Delete</button>
                            <button style={style.tableButton} onClick={parent.handleEdit.bind(parent, code)}>Edit</button>
                        </td>
                    </tr>
                );
            }
        });
        return (
            <div style={style.listDiscount}>
                <table style={style.table} cellSpacing="0">
                    <thead>
                        <tr style={style.tableHeader}>
                            <th style={style.tableCell}>Code</th>
                            <th style={style.tableCellCenter}>Type</th>
                            <th style={style.tableCellCenter}>Amount</th>
                            <th style={style.tableCellCenter}>Minimum</th>
                            <th style={style.tableCellCenter}>Limit</th>
                            <th style={style.tableCellCenter}>Active</th>
                            <th style={style.tableCell}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.length > 0 ? codes : <tr><td colSpan="7" style={style.tableCellEmpty}>No Codes Found</td></tr>}
                    </tbody>
                </table>
            </div>
        )
    }
});

var DiscountCreateForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        var code = this.refs.code.value.trim();
        var type = this.refs.type.value.trim();
        var amount = this.refs.amount.value.trim();
        var minimum = this.refs.minimum.value.trim();
        var redeem_limit = this.refs.redeem_limit.value.trim();

        // All fields are required
        if (!code || !type || !amount || !redeem_limit) {
            alert('All fields are required');
            return;
        }

        if (!this.validateNumeric(amount)) {
            alert('Amount must be a valid number');
            return;
        }

        if (!this.validateNumeric(minimum)) {
            alert('Minimum must be a valid number');
            return;
        }

        if (!this.validateNumeric(redeem_limit)) {
            alert('Limit must be a valid number');
            return;
        }

        // Call parent save function
        this.props.onDiscountSubmit({
            id: 0,
            code: code,
            type: type,
            amount: amount,
            minimum: minimum,
            redeem_limit: redeem_limit,
            active: 1,
            stat: 1
        });

        // Clear form fields
        this.clearForm();

        return;
    },
    validateNumeric: function(value) {
        return !isNaN(value);
    },
    clearForm: function() {
        this.refs.code.value = '';
        this.refs.type.value = '';
        this.refs.amount.value = '';
        this.refs.minimum.value = '';
        this.refs.redeem_limit.value = '';
    },
    render: function() {
        return (
            <div style={style.createDiscount}>
                <h3 style={style.heading}>New Discount Code</h3>
                <form className="discountForm" onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Code" className="form-input" ref="code" style={style.fieldLarge} />
                    <select className="form-input" ref="type" style={style.fieldSmall}>
                        <option value="">Type</option>
                        <option value="P">Percent</option>
                        <option value="F">Fixed</option>
                    </select>
                    <input type="text" placeholder="Amount" className="form-input" ref="amount" style={style.fieldSmall} />
                    <input type="text" placeholder="Minimum" className="form-input" ref="minimum" style={style.fieldSmall} />
                    <input type="text" placeholder="Limit" className="form-input" ref="redeem_limit" style={style.fieldSmall} />
                    <input type="submit" value="Create" className="form-button" />
                </form>
            </div>
        )
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {
            codes: []
        };
    },
    componentDidMount: function() {
        // Initial load of active codes
        this.loadCodesFromServer();
    },
    handleDiscountSubmit: function(code) {
        // Optimistic update
        var codes = this.state.codes;
        var codes = discounts.concat([code]);
        this.setState({
            codes: codes
        });

        // Send data to server to be saved
        $.ajax({
            url: '/discounts/saveCodeByPlaceId/' + place_id,
            dataType: 'json',
            cache: false,
            data: {
                code: code.code,
                type: code.type,
                amount: code.amount,
                minimum: code.minimum,
                redeem_limit: code.redeem_limit
            },
            success: function(data) {
                this.loadCodesFromServer();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    },
    handleSetState: function(state) {
        this.setState(state);
    },
    render: function() {
        return (
            <div style={style.container}>
                <DiscountCreateForm onDiscountSubmit={this.handleDiscountSubmit} />
                <DiscountCodeList codes={this.state.codes} handleSetState={this.handleSetState} />
            </div>
        )
    },
    loadCodesFromServer: function() {
        // Get all active codes from server
        $.ajax({
            url: '/discounts/getCodesByPlaceId/' + place_id,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    codes: data.map(function(code) {
                        code.editable = false;
                        return code;
                    })
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }
});

setTimeout(function() {
    ReactDOM.render(
        <App />,
        document.getElementById('app')
    )
}, 500);
