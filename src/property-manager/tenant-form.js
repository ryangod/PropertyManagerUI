import React from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from 'primereact/inputtext';
import {apiRootUrl, submitButtonDisabled} from "../global";
import {InputNumber} from 'primereact/inputnumber';
import {InputSwitch} from 'primereact/inputswitch';

export class TenantForm extends React.Component {
    sendingRequest = false;

    defaultFormValues = {
        name: null,
        occupation: null,
        creditScore: null
    };

    constructor(props) {
        super(props);

        this.state = {
            displayForm: false,
            formValues: {...this.defaultFormValues}
        };
    }

    resetForm() {
        this.setState({displayForm: false});
        this.setState({formValues: {...this.defaultFormValues}});
    }

    setFormValue(key, value) {
        let newFormValues = new Object(this.state.formValues);
        newFormValues[key] = value;

        this.setState({formValues: newFormValues});
    }

    submitForm() {
        const unit = {
            unitId: this.props.unit.propertyUnitId,
            ...this.state.formValues
        };

        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unit)
        };

        this.sendingRequest = true;

        fetch(`${apiRootUrl}tenant`, requestOptions)
            .then(async response => {
                const data = await response.json();

                this.sendingRequest = false;

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }

                this.resetForm();
                this.props.onCreate();
            })
            .catch(error => {
                this.sendingRequest = false;
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
                            <InputText id="name" style={{width: '100%'}} value={this.state.formValues.name}
                                       onChange={(e) => this.setFormValue('name', e.target.value)} />
                            <label htmlFor="name">Tenant Name</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputText id="occupation" style={{width: '100%'}} value={this.state.formValues.occupation}
                                       onChange={(e) => this.setFormValue('occupation', e.target.value)}/>
                            <label htmlFor="occupation">Tenant Occupation</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputNumber id="creditScore" style={{width: '100%'}} value={this.state.formValues.creditScore}
                                         onChange={(e) => this.setFormValue('creditScore', e.value)}/>
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
                <Button label="Submit" icon="pi pi-check" onClick={() => this.submitForm()} disabled={submitButtonDisabled(this.sendingRequest, this.state.formValues)}/>
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