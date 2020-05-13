import React from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from 'primereact/inputtext';
import {apiRootUrl} from "../global";
import {InputNumber} from 'primereact/inputnumber';
import {InputSwitch} from 'primereact/inputswitch';
import {Calendar} from "primereact/calendar";


export class LeaseForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayForm: false,
            monthlyCostValue: null,
            startDateValue: null,
            endDateValue: null
        };
    }

    submitForm() {
        const lease = {
            unitTenantId: this.props.tenant.unitTenantId,
            monthlyCost: this.state.monthlyCostValue,
            startDate: this.state.startDateValue,
            endDate: this.state.endDateValue
        };

        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lease)
        };

        fetch(`${apiRootUrl}lease`, requestOptions)
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
                            <InputNumber id="monthlyCost" style={{width: '100%'}} value={this.state.monthlyCostValue}
                                         onChange={(e) => this.setState({monthlyCostValue: e.value})} mode="currency" currency="USD" locale="en-US" />
                            <label htmlFor="monthlyCost">Monthly Rent</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <label>Start Date</label>
                        <Calendar value={this.state.startDateValue} style={{width: '100%'}} appendTo={document.body} onChange={(e) => this.setState({startDateValue: e.value.toISOString()})} />
                    </div>
                    <div className="p-col-12">
                        <label>End Date</label>
                        <Calendar value={this.state.endDateValue} style={{width: '100%'}} appendTo={document.body} onChange={(e) => this.setState({endDateValue: e.value.toISOString()})} />
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