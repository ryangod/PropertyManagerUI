import React from "react";
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import {InputText} from 'primereact/inputtext';
import {apiRootUrl} from "../global";
import {InputNumber} from 'primereact/inputnumber';
import {InputSwitch} from 'primereact/inputswitch';


export class UnitForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            displayForm: false,
            unitNameValue: null,
            bedsValue: null,
            isOccupiedValue: false,
            valueValue: null
        };
    }

    submitForm() {
        const unit = {
            propertyId: this.props.property.propertyId,
            unitName: this.state.unitNameValue,
            beds: this.state.bedsValue,
            isOccupied: this.state.isOccupiedValue,
            value: this.state.valueValue
        };

        // POST request using fetch with error handling
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unit)
        };

        fetch(`${apiRootUrl}unit`, requestOptions)
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
                            <InputText id="unitName" style={{width: '100%'}} value={this.state.unitNameValue} onChange={(e) => this.setState({unitNameValue: e.target.value})} />
                            <label htmlFor="unitName">Unit Name</label>
                        </span>
                    </div>
                    <div className="p-col-12">
                        <label htmlFor="beds">Number of Bedrooms</label>
                        <InputNumber id="beds" value={this.state.bedsValue} onChange={(e) => this.setState({bedsValue: e.value})} showButtons buttonLayout="horizontal" spinnerMode="horizontal"
                                     decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <label>Currently Occupied</label>
                            <InputSwitch id="isOccupied"  checked={this.state.isOccupiedValue} onChange={(e) => this.setState({isOccupiedValue: e.value})} />
                        </span>
                    </div>
                    <div className="p-col-12">
                        <span className="p-float-label">
                            <InputNumber id="value" style={{width: '100%'}} value={this.state.valueValue} onChange={(e) => this.setState({valueValue: e.value})} mode="currency" currency="USD" locale="en-US" />
                            <label htmlFor="value">Monthly Cost</label>
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
                <Dialog header="Add Unit"
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