import React from "react";
import {apiRootUrl} from "../global";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {LeaseForm} from "./lease-form";

export class LeaseTable extends React.Component {
    loading = false;

    constructor(props) {
        super(props);

        this.state = {
            leases: null,
            selectedLease: null
        };

        this.startDateTemplate = this.startDateTemplate.bind(this);
        this.endDateTemplate = this.endDateTemplate.bind(this);
    }

    componentDidMount() {
        this.loadLeases();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tenant.unitTenantId !== this.props.tenant.unitTenantId) {
            this.handleLeaseSelection({value: null});
            this.loadLeases();
        }
    }

    async loadLeases() {
        this.loading = true;
        const response = await fetch(`${apiRootUrl}lease?tenantId=${this.props.tenant.unitTenantId}`, );
        const jsonResponse = await response.json();

        this.loading = false;
        if (jsonResponse?.data) {
            this.setState({leases: jsonResponse.data.Items});
        }
    }

    handleLeaseSelection(event) {
        this.setState({selectedLease: event.value});
        this.props.onSelectedLeaseChanged(event);
    }

    startDateTemplate(rowData, column) {
        return <span>{`${this.formatDate(rowData.startDate)}`}</span>;
    }

    endDateTemplate(rowData, column) {
        return <span>{`${this.formatDate(rowData.endDate)}`}</span>;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US').format(new Date(date))
    }

    render() {
        return [
            <LeaseForm tenant={this.props.tenant} onCreate={() => {this.loadLeases()}}/>,
            <DataTable value={this.state.leases}
                       selectionMode="single"
                       loading={this.loading}
                       emptyMessage="No Leases Found"
                       header={`Leases for ${this.props.tenant.name}`}
                       selection={this.state.selectedLease}
                       onSelectionChange={e => this.handleLeaseSelection(e)}>
                <Column field="monthlyCost" header="Monthly Rent"/>
                <Column field="startDate" header="Start Date" body={this.startDateTemplate}/>
                <Column field="endDate" header="End Date" body={this.endDateTemplate}/>
            </DataTable>
        ];
    }
}