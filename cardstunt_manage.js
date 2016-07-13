"use strict";

const { Component } = window.React;
const { Router, Route, IndexRoute, Link, browserHistory, withRouter } = window.ReactRouter;
const { combineReducers, createStore, applyMiddleware } = window.Redux;
const { Provider, connect } = window.ReactRedux;
const { render } = window.ReactDOM;
const ReduxThunk = window.ReduxThunk.default;

// Action Types
const SYNC_CARDS = 'SYNC_CARDS';
const GET_CARDS = 'GET_CARDS';
const SET_CARDS = 'SET_CARDS';
const EDIT_CARD = 'EDIT_CARD';
const DELETE_CARD = 'DELETE_CARD';
const SELECT_ACTIVE = 'SELECT_ACTIVE';
const SET_ACTIVE = 'SET_ACTIVE';
const SET_ERROR = 'SET_ERROR';
const SET_INFO = 'SET_INFO';
const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
const SET_LOADING = 'SET_LOADING';
const SET_LOADED = 'SET_LOADED';
const SET_SPONSOR_SHOW = 'SET_SPONSOR_SHOW';
const GET_CHANNEL_INFO = 'GET_CHANNEL_INFO';
const SET_SUCSCRIBER_COUNT = 'SET_SUCSCRIBER_COUNT';

// Action Creators
const syncCardsAsync = () => {
  return (dispatch, getState) => {
    dispatch(setLoading());
    fetch('/cardstunt/syncCardsAsync/' + place_id, {
      method: 'get',
      credentials: 'include'
    }).then((response) => {
      dispatch(setLoaded());
      return response.json();
    }).then((json) => {
      dispatch(setLoaded());
      if (json.success) {
        displayInfo(dispatch, 'Cards sync successful');
      } else {
        throw new Error('Could not sync cards');
      }
    }).catch((error) => {
      dispatch(setLoaded());
      displayError(dispatch, 'Could not sync cards');
    });
  }
}

const getCardsAsync = () => {
  return (dispatch, getState) => {
    dispatch(setLoading());
    fetch('/cardstunt/getCardsAsync/' + place_id, {
      method: 'get',
      credentials: 'include'
    }).then((response) => {
      dispatch(setLoaded());
      return response.json();
    }).then((cards) => {
      dispatch(setLoaded());
      dispatch(setCards(cards));
    }).catch((error) => {
      dispatch(setLoaded());
      displayError(dispatch, 'Could not get cards');
    });
  }
}

const selectActiveAsync = (card) => {
  return (dispatch, getState) => {
    dispatch(setLoading());
    var data = new FormData();
    data.append('json', JSON.stringify(card));
    fetch('/cardstunt/setActiveCardAsync/' + place_id, {
      method: 'post',
      credentials: 'include',
      body: data
    }).then((response) => {
      dispatch(setLoaded());
      return response.json();
    }).then((json) => {
      dispatch(setLoaded());
      if (json.success) {
        dispatch(setActive(card));
        displayInfo(dispatch, 'Active status set successfully');
      } else {
        throw new Error('Could not set active card');
      }
    }).catch((error) => {
      dispatch(setLoaded());
      displayError(dispatch, 'Could not set active status');
    });
  }
}

const addCardAsync = (card) => {
  return (dispatch, getState) => {
    dispatch(setLoading());
    var data = new FormData();
    data.append('json', JSON.stringify(card));
    fetch('/cardstunt/addCardAsync/' + place_id, {
      method: 'post',
      credentials: 'include',
      body: data
    }).then((response) => {
      dispatch(setLoaded());
      return response.json();
    }).then((json) => {
      dispatch(setLoaded());
      if (json.success) {
        displayInfo(dispatch, 'Card added successfully');
        browserHistory.push('/cardstunt/manage/' + place_id);
      } else {
        throw new Error('Could not add card');
      }
    }).catch((error) => {
      dispatch(setLoaded());
      displayError(dispatch, 'Could not add card');
    });
  }
}

const deleteCardAsync = (card) => {
  return (dispatch, getState) => {
    dispatch(setLoading());
    var data = new FormData();
    data.append('json', JSON.stringify(card));
    fetch('/cardstunt/deleteCardAsync/' + place_id, {
      method: 'post',
      credentials: 'include',
      body: data
    }).then((response) => {
      dispatch(setLoaded());
      return response.json();
    }).then((json) => {
      dispatch(setLoaded());
      if (json.success) {
        displayInfo(dispatch, 'Card deleted successfully');
        browserHistory.push('/cardstunt/manage/' + place_id);
      } else {
        throw new Error('Could not delete card');
      }
    }).catch((error) => {
      dispatch(setLoaded());
      displayError(dispatch, 'Could not delete card');
    });
  }
}

const editCardAsync = (card) => {
  return (dispatch, getState) => {
    dispatch(setLoading());
    var data = new FormData();
    data.append('json', JSON.stringify(card));
    fetch('/cardstunt/editCardAsync/' + place_id, {
      method: 'post',
      credentials: 'include',
      body: data
    }).then((response) => {
      dispatch(setLoaded());
      return response.json();
    }).then((json) => {
      dispatch(setLoaded());
      if (json.success) {
        displayInfo(dispatch, 'Card updated successfully')
        browserHistory.push('/cardstunt/manage/' + place_id);
      } else {
        throw new Error('Could not update card');
      }
    }).catch((error) => {
      dispatch(setLoaded());
      displayError(dispatch, 'Could not update card');
    });
  }
}

const getChannelInfoAsync = () => {
  return (dispatch, getState) => {
    fetch('/cardstunt/getChannelInfo/' + place_id, {
      method: 'get',
      credentials: 'include'
    }).then((response) => {
      return response.json();
    }).then((info) => {
      dispatch(setSubscriberCount(info.subscription_count));
    }).catch((error) => {
      displayError(dispatch, 'Could not get channel info');
    });
  }
}

const displayInfo = (dispatch, message) => {
  dispatch(setInfo(message));
  dispatch(clearMessageAsync());
}

const displayError = (dispatch, message) => {
  dispatch(setError(message));
  dispatch(clearMessageAsync());
}

const clearMessageAsync = () => {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch(clearMessage());
    }, 2000);
  }
}

const getCards = () => ({
  type: GET_CARDS
});

const setActive = (card) => ({
  type: SET_ACTIVE, card
});

const setCards = (cards) => ({
  type: SET_CARDS, cards
});

const editCard = (card) => ({
  type: EDIT_CARD, card
});

const deleteCard = (card) => ({
  type: DELETE_CARD, card
});

const setError = (error_message) => ({
  type: SET_ERROR, error_message
});

const setInfo = (info_message) => ({
  type: SET_INFO, info_message
});

const clearMessage = () => ({
  type: CLEAR_MESSAGE
});

const setLoading = () => ({
  type: SET_LOADING
});

const setLoaded = () => ({
  type: SET_LOADED
});

const setSponsorShow = (card) => ({
  type: SET_SPONSOR_SHOW, card
});

const setSubscriberCount = (count) => ({
  type: SET_SUCSCRIBER_COUNT, count
});

// Initial state
let initialState = {
  placeid: 0,
  cards: [],
  error_message: '',
  info_message: '',
  is_loading: false,
  subscriber_count: 0
}

// Reducers
function cards(state = initialState, action) {
  switch (action.type) {
    case GET_CARDS:
      return state;
    case SET_CARDS:
      return {
        ...state,
        cards: action.cards
      }
    case SET_ERROR:
      return {
        ...state,
        error_message: action.error_message
      }
    case SET_INFO:
      return {
        ...state,
        info_message: action.info_message
      }
    case CLEAR_MESSAGE:
      return {
        ...state,
        error_message: '',
        info_message: ''
      }
    case SET_ACTIVE:
      let cards = state.cards.map((card) => {
        if (card.id === action.card.id) {
          return {
            ...card,
            active: action.card.active
          }
        } else {
          return card;
        }
      });
      return {
        ...state,
        cards: cards
      }
    case SET_LOADING:
      return {
        ...state,
        is_loading: true
      }
    case SET_LOADED:
      return {
        ...state,
        is_loading: false
      }
    case SET_SPONSOR_SHOW:
      let sponsorCards = state.cards.map((card) => {
        if (card.id === action.card.id) {
          return {
            ...card,
            sponsor_show: action.card.sponsor_show
          }
        } else {
          return card;
        }
      });
      return {
        ...state,
        cards: sponsorCards
      }
    case SET_SUCSCRIBER_COUNT:
      return {
        ...state,
        subscriber_count: action.count
      }
    default:
      return state;
  }
}

// Store
let store = createStore(
  cards,
  applyMiddleware(ReduxThunk)
);

// Stylesheet
const Style = {
  Clear: {
    clear: 'both',
    display: 'block'
  },
  HalfPanel: {
    float: 'left',
    width: '260px',
    marginRight: '10px'
  },
  ThirdPanel: {
    float: 'left',
    width: '285px',
    marginRight: '10px'
  },
  FourthPanel: {
    float: 'left',
    width: '190px',
    marginRight: '0px'
  },
  ButtonPanel: {
    float: 'left',
    width: '100%',
    marginTop: '10px',
    textAlign: 'right'
  },
  Error: {
    padding: '6px 10px',
    backgroundColor: '#FFCCCC',
    color: '#b60f0f',
    float: 'right',
    width: '300px'
  },
  Info: {
    padding: '6px 10px',
    backgroundColor: '#afccf7',
    color: '#006699',
    float: 'right',
    width: '300px'
  },
  Header: {
    width: '100%',
    margin: '10px 0px',
    Title: {
      float: 'left',
      margin: '3px 0px',
      padding: '0px'
    }
  },
  NavMenu: {
    listStyle: 'none',
    float: 'right',
    NavMenuItem: {
      float: 'left',
      NavMenuItemLink: {
        backgroundColor: '#eeeeee',
        border: '1px solid #dddddd',
        padding: '5px 15px',
        marginLeft: '10px',
        display: 'block',
        color: '#006699',
        fontSize: '12px'
      }
    }
  },
  Main: {
    width: '100%'
  },
  CardsTable: {
    width: '100%',
    marginTop: '10px',
    Th: {
      padding: '10px',
      backgroundColor: '#eeeeee'
    },
    Td: {
      padding: '5px 10px'
    },
    Button: {
      padding: '8px 15px',
      marginLeft: '10px',
      border: '1px solid #dddddd',
      backgroundColor: '#eeeeee',
      float: 'right',
      fontSize: '12px'
    },
    Color: {
      padding: '17px 10px',
      color: '#ffffff',
      textAlign: 'center',
      fontSize: '14px',
      border: '1px solid #cccccc'
    },
    Img: {
      maxHeight: '52px',
      maxWidth: '80px'
    }
  },
  Form: {
    marginTop: '10px',
    Label: {
      display: 'block',
      fontSize: '14px',
      color: '#666666',
      marginTop: '20px',
    },
    Input: {
      padding: '5px',
      fontSize: '14px',
      marginTop: '5px',
      width: '120px'
    },
    File: {
      marginTop: '10px',
      width: '200px'
    },
    Button: {
      padding: '10px 20px',
      marginTop: '20px',
      marginRight: '10px',
      fontSize: '14px'
    },
    Preview: {
      marginTop: '10px',
      border: '1px solid #cccccc'
    }
  },
  Youtube: {
    Preview: {
      height: '200px',
      marginTop: '10px'
    }
  },
  Loading: {
    position: 'absolute',
    margin: '200px 340px'
  },
  Checkmark: {
    float: 'right',
    marginTop: '20px',
    color: 'green'
  }
}

const Clear = () => {
  return (
    <div style={Style.Clear}></div>
  );
}

const App = ({children}) => {
  return (
    <div>
      <LoadingConnected />
      <Header title='Manage Cards' />
      <Clear />
      {children}
    </div>
  );
}

class Loading extends Component {
  render() {
    let {is_loading} = this.props;
    if (is_loading) {
      return (
        <div style={Style.Loading}>
          <img src='/img/loading.gif' />
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
const LoadingConnected = withRouter(connect(
  (state, {params}) => ({
    is_loading: state.is_loading
  })
)(Loading));

class Message extends Component {
  render() {
    let {info_message, error_message} = this.props;
    if (info_message) {
      return (
        <div style={Style.Info}>
          {info_message}
        </div>
      );
    } else if (error_message) {
      return (
        <div style={Style.Error}>
          {error_message}
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
const MessageConnected = withRouter(connect(
  (state, {params}) => ({
    error_message: state.error_message,
    info_message: state.info_message
  })
)(Message));

const Header = ({title}) => {
  return (
    <div style={Style.Header}>
      <NavConnected />
      <MessageConnected />
      <h2 style={Style.Header.Title}>{title}</h2>
      <Clear />
    </div>
  );
}

class Nav extends Component {
  componentDidMount() {
    let {getChannelInfoAsync} = this.props;
    getChannelInfoAsync();
    setInterval(getChannelInfoAsync, 5000);
  }
  handleSyncClick(e) {
    e.preventDefault();

    let {syncCardsAsync} = this.props;
    syncCardsAsync();
  }
  render() {
    let {subscriber_count} = this.props;
    let linkStyle = Style.NavMenu.NavMenuItem.NavMenuItemLink;

    return (
      <ul style={Style.NavMenu}>
        <li style={Style.NavMenu.NavMenuItem}>
          <Link to={`/cardstunt/manage/${place_id}`} style={linkStyle}>Home</Link>
        </li>
        <li style={Style.NavMenu.NavMenuItem}>
          <Link to={`/cardstunt/manage/${place_id}/add`} style={linkStyle}>Add Card</Link>
        </li>
        <li style={Style.NavMenu.NavMenuItem}>
          <button onClick={this.handleSyncClick.bind(this)} style={linkStyle}>Sync {subscriber_count} Clients</button>
        </li>
      </ul>
    );
  }
}
const NavConnected = connect(
  (state, ownProps) => ({
    subscriber_count: state.subscriber_count
  }),
  {syncCardsAsync, getChannelInfoAsync}
)(Nav);

const Manage = () => {
  return (
    <div style={Style.Main}>
      <h3 style={Style.Header.Title}>Current Card List</h3>
      <Clear />
      <CardsTableConnected />
    </div>
  );
}

class CardsTable extends Component {
  componentDidMount() {
    let {getCardsAsync} = this.props;
    getCardsAsync();
  }
  render() {
    let radioStyle = { ...Style.CardsTable.Th, textAlign: 'center' }
    let {cards} = this.props;

    return (
      <table style={Style.CardsTable} cellSpacing='0' cellPadding='0'>
        <thead>
          <tr>
            <th style={radioStyle}>Active</th>
            <th style={Style.CardsTable.Th}>Color</th>
            <th style={Style.CardsTable.Th}>YouTube ID</th>
            <th style={Style.CardsTable.Th}>Image</th>
            <th style={Style.CardsTable.Th}>Sponsor (Show)</th>
            <th style={Style.CardsTable.Th}></th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => <CardsTableRowConnected key={card.id} card={card} />)}
        </tbody>
      </table>
    );
  }
}
const CardsTableConnected = connect(
  (state, ownProps) => ({
    cards: state.cards
  }),
  {getCardsAsync}
)(CardsTable);

const CardsTableButton = ({action, card}) => {
  let url = '/cardstunt/manage/' + place_id + '/' + action.toLowerCase() + '/' + card.id;
  return (
    <Link to={url} style={Style.CardsTable.Button}>{action}</Link>
  );
}

class CardsTableRow extends Component {
  handleActiveChange(e) {
    e.preventDefault();

    let {selectActiveAsync, card} = this.props;
    let {active} = this.refs;

    let updateCard = {
      ...card,
      active: active.checked ? '1' : '0'
    }

    selectActiveAsync(updateCard);
  }
  renderYoutube(youtube_id) {
    if (youtube_id) {
      return (
        <a href={'https://www.youtube.com/watch?v=' + youtube_id} target='_blank'>
          <img src={'http://img.youtube.com/vi/' + youtube_id + '/0.jpg'} style={Style.CardsTable.Img} />
        </a>
      );
    } else {
      return null;
    }
  }
  render() {
    let {card} = this.props;
    let cardStyle = { ...Style.CardsTable.Color, backgroundColor: card.bg_color }
    let radioStyle = { ...Style.CardsTable.Td, textAlign: 'center' }
    let youtubeStyle = { ...Style.CardsTable.Td, textAlign: 'center' }
    let imageStyle = { ...Style.CardsTable.Td, textAlign: 'center' }

    return (
      <tr>
        <td style={radioStyle} width={40}>
          <input type='checkbox' onChange={this.handleActiveChange.bind(this)} ref='active' checked={card.active === '1' ? 'checked' : ''} />
        </td>
        <td style={Style.CardsTable.Td} width='25%'>
          <div style={cardStyle}>{card.bg_color}</div>
        </td>
        <td style={youtubeStyle} width='15%'>
          {this.renderYoutube(card.youtube_id)}
        </td>
        <td style={imageStyle} width='15%'>
          {card.has_img > 0 ? <a href={card.image_url} target='_blank'><img src={card.image_url} style={Style.CardsTable.Img} /></a> : null}
        </td>
        <td style={imageStyle} width='15%'>
          {card.sponsor_img > 0 ? <a href={card.sponsor_url} target='_blank'><img src={card.sponsor_url} style={Style.CardsTable.Img} /></a> : null}
          {card.sponsor_img > 0 && card.sponsor_show > 0 ? <span style={Style.Checkmark}>&#10004;</span> : null}
        </td>
        <td style={Style.CardsTable.Td} width={150} nowrap='nowrap'>
          <CardsTableButton action={'Delete'} card={card} />
          <CardsTableButton action={'Edit'} card={card} />
        </td>
      </tr>
    );
  }
}
const CardsTableRowConnected = connect(
  null,
  {selectActiveAsync}
)(CardsTableRow);

class Add extends Component {
  componentDidMount() {
    $('.colorPicker').miniColors();
    this.createImageUploader();
    this.createSponsorUploader();
  }
  createImageUploader() {
    $('#file_upload').uploadify({
      'uploader'  : '/swf/uploadify.swf',
      'script'    : '/cardstunt/uploadFile/' + Math.random(),
      'cancelImg' : '/img/cancel.png',
      'folder'    : '/',
      'multi'     : false,
      'scriptData': {'file_name': place_id},
      'fileExt'   : '*.jpg;*.jpeg;*.png;*.gif;*.JPG;*.JPEG;*.PNG;*.GIF;',
      'fileDesc'  : 'Web Image Files',
      'auto'      : true,
      'removeCompleted' : false,
      'sizeLimit'	: 10485760,
      'onSelect'	:	function(event,data) {},
      'onComplete':	function(event, ID, fileObj, response, data) {
                      if (response == 'error') {
                        $('#form-errors').html('<div id="form-error-message"><ul>There were problems with the following fields: <br><br><li>Cardstunt Image: Dasdak only supports jpg, gif, and png image formats.</li></ul></div>');
                        $('#file_upload').uploadifyClearQueue();
                      } else {
                        $('#form-errors').html('');
                        $('#previewImage').attr('src', '/tmp/places/Cardstunt_' + place_id + '.tmp?' + Math.random());
                      }
                    }
    });
  }
  createSponsorUploader() {
    $('#sponsor_upload').uploadify({
      'uploader'  : '/swf/uploadify.swf',
      'script'    : '/cardstunt/uploadSponsorFile/' + Math.random(),
      'cancelImg' : '/img/cancel.png',
      'folder'    : '/',
      'multi'     : false,
      'scriptData': {'file_name': place_id},
      'fileExt'   : '*.jpg;*.jpeg;*.png;*.gif;*.JPG;*.JPEG;*.PNG;*.GIF;',
      'fileDesc'  : 'Web Image Files',
      'auto'      : true,
      'removeCompleted' : false,
      'sizeLimit'	: 10485760,
      'onSelect'	:	function(event,data) {},
      'onComplete':	function(event, ID, fileObj, response, data) {
                      if (response == 'error') {
                        $('#form-errors').html('<div id="form-error-message"><ul>There were problems with the following fields: <br><br><li>Cardstunt Image: Dasdak only supports jpg, gif, and png image formats.</li></ul></div>');
                        $('#sponsor_upload').uploadifyClearQueue();
                      } else {
                        $('#form-errors').html('');
                        $('#sponsorImage').attr('src', '/tmp/places/CardstuntSponsor_' + place_id + '.tmp?' + Math.random());
                      }
                    }
    });
  }
  handleSubmit(e) {
    e.preventDefault();

    let {bg_color, youtube_id} = this.refs;
    let {placeid, addCardAsync} = this.props;

    addCardAsync({
      place_id: placeid,
      bg_color: bg_color.value,
      bg_image: '',
      youtube_id: youtube_id.value
    });
  }
  handleCancel(e) {
    e.preventDefault();

    browserHistory.push('/cardstunt/manage/' + place_id);
  }
  render() {
    let headerStyle = { ...Style.Header.Title, ...Style.Clear }

    return (
      <div style={Style.Main}>
        <h3 style={headerStyle}>Add New Card</h3>
        <Clear />
        <form style={Style.Form}>
          <div style={Style.ThirdPanel}>
            <label style={Style.Form.Label}>Color Hex Code</label>
            <input style={Style.Form.Input} type='text' className='colorPicker' ref='bg_color' />
            <Clear />
            <label style={Style.Form.Label}>YouTube Video ID</label>
            <input style={Style.Form.Input} type='text' ref='youtube_id' />
          </div>
          <div style={Style.HalfPanel}>
            <label style={Style.Form.Label}>Background Image</label>
            <div style={Style.Form.File}>
              <input type='file' name='file_upload' id='file_upload' ref='filename' />
            </div>
            <img style={Style.Form.Preview} src='/img/places/default_place.png' id='previewImage' width={240} />
          </div>
          <div style={Style.FourthPanel}>
            <label style={Style.Form.Label}>Sponsor Image</label>
            <div style={Style.Form.File}>
              <input type='file' name='sponsor_upload' id='sponsor_upload' ref='sponsor' />
            </div>
            <img style={Style.Form.Preview} src='/img/places/default_place.png' id='sponsorImage' width={180} />
          </div>
          <div style={Style.ButtonPanel}>
            <button style={Style.Form.Button} onClick={this.handleSubmit.bind(this)}>Add</button>
            <button style={Style.Form.Button} onClick={this.handleCancel.bind(this)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}
const AddConnected = withRouter(connect(
  (state, {params}) => ({
    placeid: params.placeid
  }),
  {addCardAsync}
)(Add));

class Edit extends Component {
  componentWillMount() {
    let {cards, getCardsAsync} = this.props;

    if (cards.length === 0) {
      getCardsAsync();
    }
  }
  componentDidUpdate() {
    $('.colorPicker').miniColors();
    if (!document.getElementById('file_uploadUploader')) {
      this.createImageUploader();
      this.createSponsorUploader();
    }
  }
  componentDidMount() {
    $('.colorPicker').miniColors();
    if (!document.getElementById('file_uploadUploader')) {
      this.createImageUploader();
      this.createSponsorUploader();
    }
  }
  createImageUploader() {
    $('#file_upload').uploadify({
      'uploader'  : '/swf/uploadify.swf',
      'script'    : '/cardstunt/uploadFile/' + Math.random(),
      'cancelImg' : '/img/cancel.png',
      'folder'    : '/',
      'multi'     : false,
      'scriptData': {'file_name': place_id},
      'fileExt'   : '*.jpg;*.jpeg;*.png;*.gif;*.JPG;*.JPEG;*.PNG;*.GIF;',
      'fileDesc'  : 'Web Image Files',
      'auto'      : true,
      'removeCompleted' : false,
      'sizeLimit'	: 10485760,
      'onSelect'	:	function(event,data) {},
      'onComplete':	function(event, ID, fileObj, response, data) {
                      if (response == 'error') {
                        $('#form-errors').html('<div id="form-error-message"><ul>There were problems with the following fields: <br><br><li>Cardstunt Image: Dasdak only supports jpg, gif, and png image formats.</li></ul></div>');
                        $('#file_upload').uploadifyClearQueue();
                      } else {
                        $('#form-errors').html('');
                        $('#previewImage').attr('src', '/tmp/places/Cardstunt_' + place_id + '.tmp?' + Math.random());
                      }
                    }
    });
  }
  createSponsorUploader() {
    $('#sponsor_upload').uploadify({
      'uploader'  : '/swf/uploadify.swf',
      'script'    : '/cardstunt/uploadSponsorFile/' + Math.random(),
      'cancelImg' : '/img/cancel.png',
      'folder'    : '/',
      'multi'     : false,
      'scriptData': {'file_name': place_id},
      'fileExt'   : '*.jpg;*.jpeg;*.png;*.gif;*.JPG;*.JPEG;*.PNG;*.GIF;',
      'fileDesc'  : 'Web Image Files',
      'auto'      : true,
      'removeCompleted' : false,
      'sizeLimit'	: 10485760,
      'onSelect'	:	function(event,data) {},
      'onComplete':	function(event, ID, fileObj, response, data) {
                      if (response == 'error') {
                        $('#form-errors').html('<div id="form-error-message"><ul>There were problems with the following fields: <br><br><li>Cardstunt Image: Dasdak only supports jpg, gif, and png image formats.</li></ul></div>');
                        $('#sponsor_upload').uploadifyClearQueue();
                      } else {
                        $('#form-errors').html('');
                        $('#sponsorImage').attr('src', '/tmp/places/CardstuntSponsor_' + place_id + '.tmp?' + Math.random());
                      }
                    }
    });
  }
  handleSubmit(e) {
    e.preventDefault();

    let {cardid, cards, editCardAsync} = this.props;
    let currentCard = this.getCurrentCard(cardid, cards);

    let {bg_color, youtube_id, update_btn} = this.refs;

    let updateCard = {
      ...currentCard,
      bg_color: bg_color.value,
      youtube_id: youtube_id.value
    }

    editCardAsync(updateCard);
  }
  handleSponsorShowChange(e) {
    let {cardid, cards, setSponsorShow} = this.props;
    let currentCard = this.getCurrentCard(cardid, cards);

    let {sponsor_show} = this.refs;

    let updateCard = {
      ...currentCard,
      sponsor_show: sponsor_show.checked ? '1' : '0'
    }

    setSponsorShow(updateCard);
  }
  handleCancel(e) {
    e.preventDefault();

    browserHistory.push('/cardstunt/manage/' + place_id);
  }
  getCurrentCard(id, cards) {
    for (const [index, card] of cards.entries()) {
      if (card.id === id) {
        return card;
      }
    }
  }
  renderYoutube(youtube_id) {
    if (youtube_id) {
      return (
        <a href={'https://www.youtube.com/watch?v=' + youtube_id} target='_blank'>
          <img src={'http://img.youtube.com/vi/' + youtube_id + '/0.jpg'} style={Style.Youtube.Preview} />
        </a>
      );
    } else {
      return null;
    }
  }
  render() {
    let {cardid, cards} = this.props;
    let currentCard = this.getCurrentCard(cardid, cards);

    if (currentCard) {
      let customStyle = { backgroundColor: currentCard.bg_color, marginTop: '10px', width: '200px' }
      let cardStyle = { ...Style.CardsTable.Color, ...customStyle }

      let image_url = '/img/places/default_place.png';
      if (currentCard.image_url) {
        image_url = currentCard.image_url;
      }

      let sponsor_url = '/img/places/default_place.png';
      if (currentCard.sponsor_url) {
        sponsor_url = currentCard.sponsor_url;
      }

      return (
        <div style={Style.Main}>
          <h3 style={Style.Header.Title}>Edit Card</h3>
          <Clear />
          <form style={Style.Form}>
            <div style={Style.ThirdPanel}>
              <label style={Style.Form.Label}>Current Card:</label>
              <div style={cardStyle}>{currentCard.bg_color}</div>
              <Clear />
              <label style={Style.Form.Label}>Color Hex Code</label>
              <input style={Style.Form.Input} type='text' className='colorPicker' ref='bg_color' defaultValue={currentCard.bg_color} />
              <Clear />
              <label style={Style.Form.Label}>YouTube Video ID</label>
              <input style={Style.Form.Input} type='text' ref='youtube_id' defaultValue={currentCard.youtube_id} />
              <Clear />
              {this.renderYoutube(currentCard.youtube_id)}
            </div>
            <div style={Style.HalfPanel}>
              <label style={Style.Form.Label}>Background Image</label>
              <div style={Style.Form.File}>
                <input type='file' name='file_upload' id='file_upload' ref='filename' />
              </div>
              <img style={Style.Form.Preview} src={image_url} id='previewImage' width={240} />
            </div>
            <div style={Style.FourthPanel}>
              <label style={Style.Form.Label}>Sponsor Image</label>
              <div style={Style.Form.File}>
                <input type='file' name='sponsor_upload' id='sponsor_upload' ref='sponsor' />
              </div>
              <img style={Style.Form.Preview} src={sponsor_url} id='sponsorImage' width={180} />
              <Clear /><br />
              <input type='checkbox' onChange={this.handleSponsorShowChange.bind(this)} ref='sponsor_show' checked={currentCard.sponsor_show === '1' ? 'checked' : ''} /> Show Sponsor Overlay
            </div>
            <div style={Style.ButtonPanel}>
              <button style={Style.Form.Button} onClick={this.handleSubmit.bind(this)} ref='update_btn'>Update</button>
              <button style={Style.Form.Button} onClick={this.handleCancel.bind(this)}>Cancel</button>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div style={Style.Main}></div>
      );
    }
  }
}
const EditConnected = withRouter(connect(
  (state, {params}) => ({
    cards: state.cards,
    cardid: params.cardid
  }),
  {getCardsAsync, editCardAsync, setSponsorShow}
)(Edit));

class Delete extends Component {
  componentWillMount() {
    let {cards, getCardsAsync} = this.props;

    if (cards.length === 0) {
      getCardsAsync();
    }
  }
  handleSubmit(e) {
    e.preventDefault();

    let {cardid, cards, deleteCardAsync} = this.props;
    let currentCard = this.getCurrentCard(cardid, cards);

    deleteCardAsync(currentCard);
  }
  handleCancel(e) {
    e.preventDefault();

    browserHistory.push('/cardstunt/manage/' + place_id);
  }
  getCurrentCard(id, cards) {
    for (const [index, card] of cards.entries()) {
      if (card.id === id) {
        return card;
      }
    }
  }
  renderYoutube(youtube_id) {
    if (youtube_id) {
      return (
        <a href={'https://www.youtube.com/watch?v=' + youtube_id} target='_blank'>
          <img src={'http://img.youtube.com/vi/' + youtube_id + '/0.jpg'} style={Style.Youtube.Preview} />
        </a>
      );
    } else {
      return null;
    }
  }
  renderImage(image_url) {
    if (image_url) {
      return (
        <div>
          <label style={Style.Form.Label}>Background Image</label>
          {image_url ? <a href={image_url} target='_blank'><img style={Style.Form.Preview} src={image_url} id='previewImage' width={240} /></a> : null}
        </div>
      );
    } else {
      return null;
    }
  }
  renderSponsor(sponsor_url) {
    if (sponsor_url) {
      return (
        <div>
          <label style={Style.Form.Label}>Sponsor Image</label>
          {sponsor_url ? <a href={sponsor_url} target='_blank'><img style={Style.Form.Preview} src={sponsor_url} id='sponsorImage' width={180} /></a> : null}
        </div>
      );
    } else {
      return null;
    }
  }
  render() {
    let {cardid, cards} = this.props;
    let currentCard = this.getCurrentCard(cardid, cards);

    if (currentCard) {
      let customStyle = {backgroundColor: currentCard.bg_color, marginTop: '10px', width: '200px'}
      let cardStyle = { ...Style.CardsTable.Color, ...customStyle }

      return (
        <div style={Style.Main}>
          <h3 style={Style.Header.Title}>Delete Card</h3>
          <Clear />
          <form style={Style.Form}>
            <div style={Style.ThirdPanel}>
              <label style={Style.Form.Label}>Are you sure you want to delete:</label>
              <div style={cardStyle}>{currentCard.bg_color}</div>
              <Clear />
              {this.renderYoutube(currentCard.youtube_id)}
            </div>
            <div style={Style.HalfPanel}>
              {this.renderImage(currentCard.image_url)}
            </div>
            <div style={Style.FourthPanel}>
              {this.renderSponsor(currentCard.sponsor_url)}
            </div>
            <div style={Style.ButtonPanel}>
              <button style={Style.Form.Button} onClick={this.handleSubmit.bind(this)}>Confirm</button>
              <button style={Style.Form.Button} onClick={this.handleCancel.bind(this)}>Cancel</button>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div style={Style.Main}></div>
      );
    }
  }
}
const DeleteConnected = withRouter(connect(
  (state, {params}) => ({
    cards: state.cards,
    cardid: params.cardid
  }),
  {getCardsAsync, deleteCardAsync}
)(Delete));

const Root = ({store}) => {
  return (
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path='/cardstunt/manage/:placeid' component={App}>
          <IndexRoute component={Manage} />
          <Route path='add' component={AddConnected} />
          <Route path='edit/:cardid' component={EditConnected} />
          <Route path='delete/:cardid' component={DeleteConnected} />
        </Route>
      </Router>
    </Provider>
  );
}

$(document).ready(function() {
  render(
    <Root store={store} />,
    document.getElementById('app')
  );
});
