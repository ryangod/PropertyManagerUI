import React from "react";
import {apiRootUrl} from "../global";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {UnitForm} from "./unit-form";

export class UnitTable extends React.Component {
    loading = false;

    constructor(props) {
        super(props);

        this.state = {
            units: null,
            selectedUnit: null
        };

        this.booleanTemplate = this.booleanTemplate.bind(this);
    }

    componentDidMount() {
        this.loadUnits();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.property.propertyId !== this.props.property.propertyId) {
            this.handleUnitChanged({value: null});
            this.loadUnits();
        }
    }

    async loadUnits() {
        this.loading = true;

        const response = await fetch(`${apiRootUrl}unit?propertyId=${this.props.property.propertyId}`, );
        const jsonResponse = await response.json();

        this.loading = false;

        if (jsonResponse?.data) {
            this.setState({units: jsonResponse.data.Items});
        }
    }

    booleanTemplate(rowData, column) {
        return <span>{`${rowData.isOccupied? 'Yes': 'No'}`}</span>;
    }

    handleUnitChanged(event) {
        this.setState({selectedUnit: event.value});
        this.props.onSelectedUnitChanged(event);
    }

    render() {
        return [
            <UnitForm property={this.props.property} onCreate={() => this.loadUnits()}/>,
            <DataTable value={this.state.units}
                       selectionMode="single"
                       loading={this.loading}
                       emptyMessage="No Units Found"
                       header="Units"
                       selection={this.state.selectedUnit}
                       onSelectionChange={e => this.handleUnitChanged(e)}>
                <Column field="unitName" header="Unit"/>
                <Column field="beds" header="Number of Bedrooms"/>
                <Column field="isOccupied" header="Occupied" body={this.booleanTemplate} />
                <Column field="value" header="Monthly Cost"/>
            </DataTable>
        ];
    }
}