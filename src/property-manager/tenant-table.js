import React from "react";
import {apiRootUrl} from "../global";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {UnitForm} from "./unit-form";
import {TenantForm} from "./tenant-form";

export class TenantTable extends React.Component {
    loading = false;

    constructor(props) {
        super(props);

        this.state = {
            tenants: null,
            selectedTenant: null
        };
    }

    componentDidMount() {
        this.loadTenants();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.unit.propertyUnitId !== this.props.unit.propertyUnitId) {
            this.handleTenantChanged({value: null});
            this.loadTenants();
        }
    }

    async loadTenants() {
        this.loading = true;

        const response = await fetch(`${apiRootUrl}tenant?unitId=${this.props.unit.propertyUnitId}`);
        const jsonResponse = await response.json();

        this.loading = false;

        if (jsonResponse?.data) {
            this.setState({tenants: jsonResponse.data.Items});
        }
    }

    handleTenantChanged(event) {
        this.setState({selectedTenant: event.value});
        this.props.onSelectedTenantChanged(event);
    }

    render() {
        return [
            <TenantForm unit={this.props.unit} onCreate={() => this.loadTenants()}/>,
            <DataTable value={this.state.tenants}
                       selectionMode="single"
                       loading={this.loading}
                       emptyMessage="No Tenants Found"
                       header={`Unit ${this.props.unit.unitName? this.props.unit.unitName: ''} Tenants`}
                       selection={this.state.selectedTenant}
                       onSelectionChange={e => this.handleTenantChanged(e)}>
                <Column field="name" header="Tenant Name"/>
                <Column field="occupation" header="Occupation"/>
                <Column field="creditScore" header="Credit Score"/>
            </DataTable>
        ];
    }
}