import React from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {apiRootUrl, submitButtonDisabled} from "../global";
import {InputNumber} from "primereact/inputnumber";

export class PropertyForm extends React.Component {
    sendingRequest = false;

    defaultFormValues = {
        address: null,
        datePurchased: null,
        cost: null,
        downPayment: null,
        interestRate: null
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
        const property = {...this.state.formValues};

        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(property)
        };

        this.sendingRequest = true;

        fetch(`${apiRootUrl}property`, requestOptions)
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
                            <InputText id="address" style={{width: '100%'}} value={this.state.formValues.address}
                                       onChange={(e) => this.setFormValue('address', e.target.value)} />
                            <label htmlFor="address">Address</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span>
                            <label>Date of Purchase</label>
                            <Calendar id="purchaseDate" value={this.state.formValues.datePurchased} style={{width: '100%'}} appendTo={document.body}
                                      onChange={(e) => this.setFormValue('datePurchased', e.value.toISOString())} />
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputNumber id="cost" style={{width: '100%'}} value={this.state.formValues.cost}
                                         onChange={(e) => this.setFormValue('cost', e.value)} mode="currency" currency="USD" locale="en-US" />
                            <label htmlFor="cost">Cost</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputNumber id="downPayment" style={{width: '100%'}} value={this.state.formValues.downPayment}
                                         onChange={(e) => this.setFormValue('downPayment', e.value)} mode="currency" currency="USD" locale="en-US" />
                            <label htmlFor="downPayment">Down Payment</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputNumber id="interestRate" style={{width: '100%'}} value={this.state.formValues.interestRate}
                                         onChange={(e) => this.setFormValue('interestRate', e.value)}
                                         mode="decimal" suffix="%" mode="decimal" minFractionDigits={2} maxFracionDigits={2}/>
                            <label htmlFor="interestRate">Interest Rate</label>
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
                <Dialog header="Add Property"
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