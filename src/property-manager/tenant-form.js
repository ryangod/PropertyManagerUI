import React from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from 'primereact/inputtext';
import {apiRootUrl} from "../global";
import {InputNumber} from 'primereact/inputnumber';
import {InputSwitch} from 'primereact/inputswitch';


export class TenantForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayForm: false,
            nameValue: null,
            occupationValue: null,
            creditScoreValue: null
        };
    }

    submitForm() {
        const unit = {
            unitId: this.props.unit.propertyUnitId,
            name: this.state.nameValue,
            occupation: this.state.occupationValue,
            creditScore: this.state.creditScoreValue
        };

        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unit)
        };

        fetch(`${apiRootUrl}tenant`, requestOptions)
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                console.log('successful');
            })
            .catch(error => {
                this.setState({ errorMessage: error.toString() });
                console.error('There was an error!', error);
            });
    }

    renderForm() {
        return (
            <form>
                <div className="p-grid p-dir-col">
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputText id="name" style={{width: '100%'}} value={this.state.nameValue} onChange={(e) => this.setState({nameValue: e.target.value})} />
                            <label htmlFor="name">Tenant Name</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputText id="occupation" style={{width: '100%'}} value={this.state.occupationValue} onChange={(e) => this.setState({occupationValue: e.target.value})} />
                            <label htmlFor="occupation">Tenant Occupation</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputNumber id="creditScore" style={{width: '100%'}} value={this.state.creditScoreValue} onChange={(e) => this.setState({creditScoreValue: e.value})}/>
                            <label htmlFor="creditScore">Credit Score</label>
                        </span>
                    </div>
                </div>
            </form>
        )
    }

    renderFooter() {
        return (
            <div>
                <Button label="Submit" icon="pi pi-check" onClick={() => this.submitForm()}/>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.setState({displayForm: false})} className="p-button-secondary"/>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className="p-grid p-jusify-start">
                    <div className="p-col-fixed" style={{width: '50px'}}>
                        <Button
                            style={{ alignContent: "left" }}
                            icon="pi pi-plus"
                            onClick={() => this.setState({displayForm: true})}
                        />
                    </div>
                </div>
                <Dialog header="Add Tenant"
                        visible={this.state.displayForm}
                        style={{width: '400px'}}
                        onHide={() => this.setState({displayForm: false})}
                        footer={this.renderFooter()}
                >
                    {this.renderForm()}
                </Dialog>
            </div>
        );
    }
}