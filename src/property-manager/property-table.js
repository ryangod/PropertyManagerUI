import React from "react";
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {apiRootUrl} from "../global";
import {PropertyForm} from "./property-form";

export class PropertyTable extends React.Component {
    loading = false;

    constructor(props) {
        super(props);

        this.state = {
            properties: null,
            selectedProperty: null
        };
    }

    componentDidMount() {
        this.loadProperties();
    }

    async loadProperties() {
        this.loading = true;

        const response = await fetch(`${apiRootUrl}property`);
        const jsonResponse = await response.json();

        this.loading = false;

        if (jsonResponse?.data) {
            const properties = jsonResponse.data.Items;

            if (properties) {
                properties.forEach(p => {
                    if (p.datePurchased) {
                        p.datePurchasedDisplay = new Intl.DateTimeFormat('en-US').format(new Date(p.datePurchased));
                    }
                });
            }

            this.setState({properties: jsonResponse.data.Items});
        }
    }

    handlePropertySelected(event) {
        this.setState({selectedProperty: event.value});
        this.props.onSelectedPropertyChanced(event);
    }

    render() {
        return [
            <PropertyForm/>,
            <DataTable value={this.state.properties}
                       selectionMode="single"
                       header="Properties"
                       loading={this.loading}
                       emptyMessage="No Properties Found"
                       selection={this.state.selectedProperty}
                       onSelectionChange={e => this.handlePropertySelected(e)}>
                <Column field="address" header="Address"/>
                <Column field="datePurchasedDisplay" header="Date of Purchase"/>
                <Column field="downPayment" header="Down Payment"/>
                <Column field="interestRate" header="Loan Interest Rate"/>
            </DataTable>
        ];
    }
}