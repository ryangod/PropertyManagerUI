import React from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import {apiRootUrl, submitButtonDisabled} from "../global";
import {InputNumber} from 'primereact/inputnumber';
import {Dropdown} from 'primereact/dropdown';

export class TransactionForm extends React.Component {
    sendingRequest = false;

    paymentMethods = [
        {label: 'Visa', value: 'Visa'},
        {label: 'Mastercard', value: 'Mastercard'},
        {label: 'American Express', value: 'American Express'},
        {label: 'Venmo', value: 'Venmo'},
        {label: 'PayPal', value: 'PayPal'}
    ];

    defaultFormValues = {
        amountPaid: null,
        paymentMethod: null
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
        const transaction = {
            tenantLeaseId: this.props.lease.tenantLeaseId,
            ...this.state.formValues
        };

        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        };

        this.sendingRequest = true;

        fetch(`${apiRootUrl}transaction`, requestOptions)
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
                            <InputNumber id="amountPaid" style={{width: '100%'}} value={this.state.formValues.amountPaid}
                                         onChange={(e) => this.setFormValue('amountPaid', e.value)} mode="currency" currency="USD" locale="en-US" />
                            <label htmlFor="amountPaid">Amount Paid</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <label>Payment Method</label>
                        <Dropdown value={this.state.formValues.paymentMethod} options={this.paymentMethods}
                                  onChange={(e) => this.setFormValue('paymentMethod', e.value)}
                                  placeholder="Select a Payment Method" appendTo={document.body}/>
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
                <Dialog header="Add Transaction"
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