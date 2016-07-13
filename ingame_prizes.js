var style = {
    container: {
        margin: '0px 6px',
        width: '100%'
    },
    createPrize: {
        backgroundColor: '#f3f3f3',
        padding: '15px',
        textAlign: 'left'
    },
    listPrize: {
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
    fieldMedium: {
        width: '180px',
        marginRight: '10px'
    },
    fieldLarge: {
        width: '300px',
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

var PrizeList = React.createClass({
    handleEdit: function(prize, e) {
        e.preventDefault();

        var updatePrize = prize;
        updatePrize.editable = true;

        var prizes = this.props.prizes.map(function(prize) {
            if (prize.id != updatePrize.id) {
                return prize;
            } else {
                return updatePrize;
            }
        });
        this.handleSetState(prizes);
    },
    handleSave: function(prize, e) {
        e.preventDefault();

        var updatePrize = prize;
        updatePrize.editable = false;

        var prizes = this.props.prizes.map(function(prize) {
            if (prize.id != updatePrize.id) {
                return prize;
            } else {
                return updatePrize;
            }
        });
        this.handleSetState(prizes);
    },
    handleDelete: function(prize, e) {
        e.preventDefault();
    },
    handleSetState: function(prizes) {
        this.props.handleSetState(prizes);
    },
    render: function() {
        var parent = this;
        var prizes = this.props.prizes.map(function(prize) {
            if (prize.editable) {
                return (
                    <tr key={prize.id}>
                        <td style={style.tableCellCode} width="30%">
                            <input type="text" ref={'name_' + prize.id} style={style.fieldMedium} defaultValue={prize.name} />
                        </td>
                        <td style={style.tableCellCode}>
                            <input type="text" ref={'description_' + prize.id} style={style.fieldMedium} defaultValue={prize.description} />
                        </td>
                        <td style={style.tableCellCenter} width="60">
                            <input type="text" ref={'retail_value_' + prize.id} style={style.fieldTinyInline} defaultValue={prize.retail_value} />
                        </td>
                        <td style={style.tableCell} width="125">
                            <button style={style.tableButton} onClick={parent.handleDelete.bind(parent, prize)}>Delete</button>
                            <button style={style.tableButton} onClick={parent.handleSave.bind(parent, prize)}>Save</button>
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={prize.id}>
                        <td style={style.tableCellCode} width="30%">{prize.name}</td>
                        <td style={style.tableCellCode}>{prize.description}</td>
                        <td style={style.tableCellCenter} width="60">{'$' + formatDecimal(prize.retail_value)}</td>
                        <td style={style.tableCell} width="125">
                            <button style={style.tableButton} onClick={parent.handleDelete.bind(parent, prize)}>Delete</button>
                            <button style={style.tableButton} onClick={parent.handleEdit.bind(parent, prize)}>Edit</button>
                        </td>
                    </tr>
                );
            }
        });
        return (
            <div style={style.listPrize}>
                <table style={style.table} cellSpacing="0">
                    <thead>
                        <tr style={style.tableHeader}>
                            <th style={style.tableCell}>Name</th>
                            <th style={style.tableCell}>Description</th>
                            <th style={style.tableCellCenter}>Retail</th>
                            <th style={style.tableCell} width="125">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prizes.length > 0 ? prizes : <tr><td colSpan="4" style={style.tableCellEmpty}>No Prizes Found</td></tr>}
                    </tbody>
                </table>
            </div>
        )
    }
});

var PrizeCreateForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        var name = this.refs.name.value.trim();
        var description = this.refs.description.value.trim();
        var retail_value = this.refs.retail_value.value.trim();

        // All fields are required
        if (!name) {
            alert('All fields are required');
            return;
        }

        if (!this.validateNumeric(retail_value)) {
            alert('Amount must be a valid number');
            return;
        }

        // Call parent save function
        this.props.onPrizeSubmit({
            id: 0,
            name: name,
            description: description,
            retail_value: retail_value,
            active: 1
        });

        // Clear form fields
        this.clearForm();

        return;
    },
    validateNumeric: function(value) {
        return !isNaN(value);
    },
    clearForm: function() {
        this.refs.name.value = '';
    },
    render: function() {
        return (
            <div style={style.createPrize}>
                <h3 style={style.heading}>New Prize</h3>
                <form className="prizeForm" onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Name" className="form-input" ref="name" style={style.fieldMedium} />
                    <input type="text" placeholder="Description" className="form-input" ref="description" style={style.fieldLarge} />
                    <input type="text" placeholder="Value" className="form-input" ref="retail_value" style={style.fieldSmall} />
                    <input type="submit" value="Create" className="form-button" />
                </form>
            </div>
        )
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {
            prizes: []
        };
    },
    componentDidMount: function() {
        // Initial load of active codes
        this.loadPrizesFromServer();
    },
    handlePrizeSubmit: function(prize) {
        // Optimistic update
        var prizes = this.state.prizes;
        var prizes = prizes.concat([prize]);
        this.setState({
            prizes: prizes
        });

        // Send data to server to be saved
        $.ajax({
            url: '/ingame/savePrizeByPlaceId/' + place_id,
            dataType: 'json',
            cache: false,
            data: {
                name: prize.name,
                description: prize.description,
                retail_value: prize.retail_value
            },
            success: function(data) {
                this.loadPrizesFromServer();
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
                <PrizeCreateForm onPrizeSubmit={this.handlePrizeSubmit} />
                <PrizeList prizes={this.state.prizes} handleSetState={this.handleSetState} />
            </div>
        )
    },
    loadPrizesFromServer: function() {
        // Get all active codes from server
        $.ajax({
            url: '/ingame/getPrizesByPlaceId/' + place_id,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    prizes: data.map(function(prize) {
                        prize.editable = false;
                        return prize;
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
