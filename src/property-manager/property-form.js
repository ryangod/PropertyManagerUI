import React from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from 'primereact/inputtext';
import {Calendar} from 'primereact/calendar';
import {apiRootUrl} from "../global";


export class PropertyForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayForm: false,
            addressValue: null,
            dateOfPurchase: null,
            downPayment: null,
            interestRate: null,
            errorMessage: null
        };
    }

    submitForm() {
        const property = {
            address: this.state.addressValue,
            datePurchased: this.state.dateOfPurchase,
            downPayment: this.state.downPayment,
            interestRate: this.state.interestRate
        };

        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(property)
        };

        fetch(`${apiRootUrl}property`, requestOptions)
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
                            <InputText id="address" style={{width: '100%'}} value={this.state.addressValue} onChange={(e) => this.setState({addressValue: e.target.value})} />
                            <label htmlFor="address">Address</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <label>Date of Purchase</label>
                        <Calendar value={this.state.dateOfPurchase} style={{width: '100%'}} appendTo={document.body} onChange={(e) => this.setState({dateOfPurchase: e.value.toISOString()})} />
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputText id="downPayment" style={{width: '100%'}} value={this.state.downPayment} onChange={(e) => this.setState({downPayment: e.target.value})} />
                            <label htmlFor="address">Down Payment</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputText id="interestRate" style={{width: '100%'}} value={this.state.interestRate} onChange={(e) => this.setState({interestRate: e.target.value})} />
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