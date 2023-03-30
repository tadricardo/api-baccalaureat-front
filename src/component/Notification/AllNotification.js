import React, { Component } from 'react'
import ReactPaginate from 'react-paginate';
import notificationService from 'src/services/notification.service';
import jwt_decode from "jwt-decode";
import { CButton, CCol, CRow } from '@coreui/react';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';


class AllNotification extends Component {

  constructor(props) {
    super(props);
    this.retrieveNotification = this.retrieveNotification.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.state = {
      notifications: [],
      itemsPerPage: 10,
      currentPage: 0,
      pageCount: 0,
      user: null,
      loading: false
    }
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token !== null) {
      const user = jwt_decode(token);
      this.setState({ user: user })
      this.retrieveNotification(user);
    }

  }

  retrieveNotification(user) {
    notificationService.count(user.id).then((resp) => {
      let nbPage = Math.ceil(resp.data / this.state.itemsPerPage)
      this.setState({ pageCount: nbPage })
    }).catch((e) => { console.log(e) });
    notificationService.getAllNotificationByPageAndRecipient(user.id, this.state.currentPage, this.state.itemsPerPage)
      .then(response => {
        this.setState({
          notifications: response.data,
          loading: false
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handlePageClick = (data) => {
    let selected = data.selected;
    this.setState({ currentPage: selected }, () => {
      this.retrieveNotification(this.state.user);
    });
  };


  read(notification) {
    const notif = [...this.state.notifications];
    const lastIndex = notif.findIndex((n) => n.id === notification.id);
    const notifChange = notif.find((n) => n.id === notification.id);
    if(notification.status){
      notifChange.status = false;
    }else{
      notifChange.status = true;
    }
    notificationService.update(notifChange).then(response => {
      if (lastIndex !== -1)
        notif[lastIndex] = response.data
    });
    this.setState({notifications : notif})
  }


  render() {
    const { notifications, pageCount, loading, currentPage } = this.state;
    return (
      <>
        <CRow className="mt-4">
          <CCol className="col-lg-12">
            <table className="table table-hover table-striped">
              <tbody>
                {loading ? (<tr><td colSpan="6" className="text-center font-weight-bold">Chargement...</td></tr>) : (
                  notifications.length !== 0 ?
                    notifications.map((notif, index) =>
                      <tr key={index}>
                        <td><p className='m-0'>{notif.content} <br />  <small>Envoyé {notif.sender !== null && notif.sender.id !== notif.recipient.id  ? `par ${notif.sender.nom} ${notif.sender.prenom}` : 'automatique'}</small></p></td>
                        <td>{moment(notif.dateCreated).format("ll")}</td>
                        <td>
                          { <CButton className="mr-2" onClick={() => this.read(notif)} color={!notif.status ? "info" : "danger"} ><FontAwesomeIcon icon={faEye} /> Marquer comme lu</CButton>}
                        </td>
                      </tr>
                    ) : (<tr><td colSpan="6" className="text-center font-weight-bold">Aucune notification</td></tr>))}
              </tbody>
            </table>
            {pageCount > 1 && (<ReactPaginate
              previousLabel={'Précédent'}
              nextLabel={'Suivant'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={4}
              onPageChange={this.handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              pageLinkClassName="page-link"
              breakLinkClassName="page-link"
              nextLinkClassName="page-link"
              previousLinkClassName="page-link"
              pageClassName="page-item"
              breakClassName="page-item"
              nextClassName="page-item"
              previousClassName="page-item"
              forcePage={currentPage}
            />)}
          </CCol>
        </CRow>
      </>
    )
  }
}
export default AllNotification;