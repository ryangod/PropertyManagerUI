import React from "react";
import {apiRootUrl} from "../global";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {LeaseForm} from "./lease-form";
import {TransactionForm} from "./transaction-form";

export class TransactionTable extends React.Component {
    loading = false;

    constructor(props) {
        super(props);

        this.state = {
            transactions: null,
            selectedTransaction: null
        };

        this.transactionDateTemplate = this.transactionDateTemplate.bind(this);
    }

    componentDidMount() {
        this.loadTransactions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.lease.tenantLeaseId !== this.props.lease.tenantLeaseId) {
            this.handleTransactionSelection({value: null});
            this.loadTransactions();
        }
    }

    async loadTransactions() {
        this.loading = true;
        const response = await fetch(`${apiRootUrl}transaction?leaseId=${this.props.lease.tenantLeaseId}`, );
        const jsonResponse = await response.json();

        this.loading = false;
        if (jsonResponse?.data) {
            this.setState({transactions: jsonResponse.data.Items});
        }
    }

    handleTransactionSelection(event) {
        this.setState({selectedTransaction: event.value});
        this.props.onSelectedTransactionChanged(event);
    }

    transactionDateTemplate(rowData, column) {
        return <span>{`${this.formatDate(rowData.transactionDate)}`}</span>;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US').format(new Date(date))
    }

    render() {
        return [
            <TransactionForm lease={this.props.lease}/>,
            <DataTable value={this.state.transactions}
                       selectionMode="single"
                       loading={this.loading}
                       emptyMessage="No Transactions Found"
                       header={`Lease Transactions`}
                       selection={this.state.selectedTransaction}
                       onSelectionChange={e => this.handleTransactionSelection(e)}>
                <Column field="amountPaid" header="Amount Paid"/>
                <Column field="paymentMethod" header="Payment Method"/>
                <Column field="transactionDate" header="Transaction Date" body={this.transactionDateTemplate}/>
                <Column field="transactionStatus" header="Status"/>
            </DataTable>
        ];
    }
}