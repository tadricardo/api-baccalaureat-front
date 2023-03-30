import React, { Component } from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import SockJS from 'sockjs-client';
import NotificationService from '../services/notification.service';
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
class TheHeaderDropdownNotif extends Component {
  constructor(props) {
    super(props);
    this.retrieveNotification = this.retrieveNotification.bind(this);
    this.addNotif = this.addNotif.bind(this);
    this.connect = this.connect.bind(this);
    this.state = {
      data: [],
      message: '',
      socket: null,
      stompClient: null,
      count:0,
      user: null
    };
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token !== null) {
      const user = jwt_decode(token);
      this.setState({ user: user });
      this.connect(user);
      this.retrieveNotification(user);  
    }
  }


  retrieveNotification(user) {
    NotificationService.countNonLuesBySalarie(user?.id)
      .then((resp) => {
        this.setState({ count: resp.data });
      })
      .catch((e) => {
        console.log(e);
      });
      NotificationService.getNotificationNonLuesByIdSalarie(user?.id)
      .then((response) => {
        this.setState({
          data: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  connect(user) {
    const Stomp = require("stompjs");
    var socket = this.state.socket;
    var stompClient = this.state.stompClient;
    socket = new SockJS(`${process.env.REACT_APP_URL_API}/ws/`);
    stompClient = Stomp.over(socket);
    stompClient.debug = null;
    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/${user.id}/notif/get`,
        (message) => {
          this.addNotif(message)
        }
      );
      stompClient.subscribe(`/topic/notif/count`,
      (message) => {
        this.setState({count: message.body})
      }
    );
    });

    this.setState({
      socket: socket,
      stompClient: stompClient
    });
  }

  disconnect() {
    var stompClient = this.state.stompClient;
    if (stompClient != null) {
      stompClient.disconnect();
    }
  }


  addNotif(message) {
    const {count,data} = this.state;
    let notifs = [...data];
    notifs.push(JSON.parse(message.body));
    notifs.sort((a, b) => a.id - b.id);
    notifs.reverse();
    this.setState(({data: notifs,count: count+1}));
  }

  componentWillUnmount() {
    this.disconnect()
  }
  
  render() {
    const {count,data} = this.state;
    return (
      <CDropdown inNav className="c-header-nav-item mx-2">
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <CIcon name="cil-bell" />
          <CBadge shape="pill" color="danger">{count}</CBadge>
        </CDropdownToggle>
        <CDropdownMenu style={{"width" : "350px" }}  placement="bottom-end" className="m-0 pt-0 pb-0">
          
          <CDropdownItem header tag="div" className="text-center" color="light">
            <p>Vous avez {count} notifications non-lues</p>
          </CDropdownItem>
          <div className='overflow-auto drop-notify'>
          {
            data.length === 0 ?
            <CDropdownItem className="border-top "> Vous n'avez aucune notification.</CDropdownItem>
            :
            data.map((notif,index) => {
                return <CDropdownItem className="d-inline-block border-top text-truncate" key={index} title={notif.content} alt={notif.content}>{notif.content}</CDropdownItem>
            }
              
            )
            
          }
           </div>
          {
            <CDropdownItem header tag="div" className=" text-center border-top" color="light"><Link to={"/notification"} className="text-dark"> <FontAwesomeIcon icon={faEye}/> Voir plus de notification... </Link></CDropdownItem>
          }
         
        </CDropdownMenu>
      </CDropdown>

    )
  }
}

export default TheHeaderDropdownNotif;