import React, { Component } from 'react';
import { withRouter } from "react-router";
import moment from 'moment';
import momentFR from 'moment/locale/fr';

class Entretien extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            currentErrors: {},
            entretien: {
                dateEntretien: null,
                salarie: {
                    prenom: null,
                    nom: null
                },
                managerEntretien: {
                    prenom: null,
                    nom: null
                },
                compteRendu: {}
            },
            ifError: null
        };
        moment.locale('fr', momentFR);
    }

    componentDidMount() {
        const { state } = this.props.location;
        this.setState({ entretien: state })
        if (state === undefined) {
            this.props.history.push("/home");
        }
    }

    render() {
        const { entretien } = this.state;
        return (
            <>
                <table className="table table-hover table-striped table-bordered ">
                    <thead>
                        <tr>
                            <th>Date / heure</th>
                            <th>Compte rendu</th>
                            <th>Salarie  (Prenom-Nom)</th>
                            <th>Manager  (Prenom-Nom)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={entretien.id}>
                            <td>{moment(entretien.dateEntretien).format("llll")}</td>
                            <td>{!entretien.compteRendu ? "Aucun" : entretien.compteRendu.compteRendu}</td>
                            <td>{`${entretien.salarie.prenom} ${entretien.salarie.nom}`}</td>
                            <td>{`${entretien.managerEntretien.prenom} ${entretien.managerEntretien.nom}`}</td>
                        </tr>
                    </tbody>
                </table>
            </>
        )
    }
}
export default withRouter(Entretien);