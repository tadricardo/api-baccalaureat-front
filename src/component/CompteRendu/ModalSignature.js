import React, { Component } from "react";
import { withRouter } from "react-router";
import { CButton, CInputFile, CLabel, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';
import swal from 'sweetalert';
import signatureService from 'src/services/signature.service';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";

class ModalSignature extends Component {
    constructor(props) {
        super(props);
        this.signeAvecSignatureSalarie = this.signeAvecSignatureSalarie.bind(this);
        this.uploadSignatureCompteRendu = this.uploadSignatureCompteRendu.bind(this);
        this.toggle = this.toggle.bind(this);
        this.state = {
            modal: false,
            compteRenduId: this.props.compteRenduId,
            salarieId: this.props.salarieId,
            partiUser: this.props.partiUser,
        }
    }

    toggle() {
        this.setState({ modal: this.state.modal ? false : true });
    };

    signeAvecSignatureSalarie() {
        swal({
            title: "Êtes-vous sûrs ?",
            text: `Voulez-vous signer le compte rendu n°${this.state.compteRenduId} ?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                signatureService.signeCompteRendu(this.state.compteRenduId, this.state.salarieId)
                    .then(resp => {
                        this.setState({
                            currentInterview: resp.data,
                            modal: false,
                        });
                        swal("Validé !", `Compte rendu n°${this.state.compteRenduId} signé.`, "success");
                    }).catch(e => {
                        swal("Erreur !",`Erreur lors de la signature : ${e.message}`, "error");
                    })
            }
        });
    }

    uploadSignatureCompteRendu(e) {
        swal({
            title: "Êtes-vous sûrs ?",
            text: `Voulez-vous signe le compte rendu n°${this.state.compteRenduId} ?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                if (e.target.files[0].type.match("image/png") || e.target.files[0].type.match("image/jpeg") || e.target.files[0].type.match("image/gif") || e.target.files[0].type.match("image/webp")) {
                    if (e.target.files[0].size <= 1000000) {
                        const formData = new FormData();
                        formData.append('file', e.target.files[0]);
                        formData.append('idSalarie', this.state.salarieId);
                        formData.append('idCompteRendu', this.state.compteRenduId);
                        signatureService.uploadSignatureCompteRendu(formData)
                            .then((resp) => {
                                this.setState({
                                    currentInterview: resp.data,
                                    modal: false,
                                });
                                swal("Validé !", `Compte rendu n°${this.state.compteRenduId} signé.`, "success");
                                window.setTimeout(() => { window.location.reload(false); }, 2000);
                            })
                            .catch((e) => {
                                swal("Erreur !", `Erreur lors de la signature : ${e.message}`, "error");
                            });
                    } else {
                        swal("Erreur !", "Fichier trop lourd, taille max : 1Mo.", "warning");
                    }
                } else {
                    swal("Erreur !", "Formats acceptés : png, jpeg, gif et webp.", "warning");
                }
            }
        });
    }

    render() {
        const { compteRenduId, partiUser } = this.state
        return (
            <>
                <CButton color="info" className={'mr-1 btn btn-primary'}
                    onClick={this.toggle}
                >Signer le compte rendu</CButton>
                <CModal
                    show={this.state.modal}
                    onClose={this.toggle}
                >
                    <CModalHeader closeButton>Signer le compte rendu n°{compteRenduId}</CModalHeader>
                    {partiUser.salarie.signatureBase64 &&
                        <CModalBody>
                            Signer avec la signature de votre profil :
                            <CButton color="success" className={'ml-3 mb-1 btn btn-primary mb-2'} onClick={this.signeAvecSignatureSalarie}><FontAwesomeIcon icon={faFileSignature} />
                                {" "}Signer le compte-rendu
                            </CButton>
                        </CModalBody>
                    }
                    <CModalBody>
                        Signer en important une signature uniquement pour ce compte rendu :
                        <div className="form-group mx-sm-1 mb-2">
                            <div className="custom-file">
                                <CInputFile className="custom-file-input" id="signatureCR" onChange={this.uploadSignatureCompteRendu} />
                                <CLabel className="custom-file-label" htmlFor="signatureCR">Choisir sa signature.</CLabel>
                            </div>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton
                            color="danger"
                            onClick={this.toggle}
                        >Annuler</CButton>
                    </CModalFooter>
                </CModal>
            </>
        )
    }
}
export default withRouter(ModalSignature);