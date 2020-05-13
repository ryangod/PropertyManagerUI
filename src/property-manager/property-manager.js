import React from "react";
import {PropertyTable} from "./property-table";
import {Card} from "primereact/card";
import {UnitTable} from "./unit-table";
import {TenantTable} from "./tenant-table";
import {LeaseTable} from "./lease-table";
import {TransactionTable} from "./transaction-table";

export class PropertyManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProperty: null,
            selectedUnit: null,
            selectedTenant: null,
            selectedLease: null,
            selectedTransaction: null
        };
    }

    handlePropertySelection = (evt) => {
        this.setState({selectedProperty: evt.value});
        this.handleUnitSelection({value: null});
    };

    handleUnitSelection = (evt) => {
        this.setState({selectedUnit: evt.value});
        this.handleTenantSelection({value: null});
    };

    handleTenantSelection = (evt) => {
        this.setState({selectedTenant: evt.value});
        this.handleLeaseSelection({value: null});
    };

    handleLeaseSelection = (evt) => {
        this.setState({selectedLease: evt.value});
        this.handleTransactionSelection({value: null});
    };

    handleTransactionSelection = (evt) => {
        this.setState({selectedTransaction: evt.value});
    };

    renderPropertyTableCard() {
        return (
            <Card>
                <PropertyTable onSelectedPropertyChanced={this.handlePropertySelection}/>
            </Card>
        );
    }

    renderPropertyDetailsCard() {
        return (
            <Card>
                <div className="p-grid p-jusify-center">
                    <div className="p-col-12">
                        <h3>{this.state.selectedProperty.address}</h3>
                    </div>
                    <div className="p-col-12">
                        <UnitTable property={this.state.selectedProperty}
                                   onSelectedUnitChanged={this.handleUnitSelection}/>
                    </div>
                    {
                        this.state.selectedUnit &&
                        <hr/> &&
                        <div className="p-col-12">
                            <TenantTable unit={this.state.selectedUnit}
                                         onSelectedTenantChanged={this.handleTenantSelection}/>
                        </div>
                    }
                    {
                        this.state.selectedTenant &&
                        <hr/> &&
                        <div className="p-col-12">
                            <LeaseTable tenant={this.state.selectedTenant}
                                         onSelectedLeaseChanged={this.handleLeaseSelection}/>
                        </div>
                    }
                    {
                        this.state.selectedLease &&
                        <div className="p-col-12">
                            <TransactionTable lease={this.state.selectedLease}
                                              onSelectedTransactionChanged={this.handleTransactionSelection}/>
                        </div>
                    }
                </div>
            </Card>
        );
    }

    render() {
        return (
            <div className="p-grid p-justify-center">
                <div className="p-col-12 p-lg-10 p-xl-8">
                    <div className="p-grid">
                        <div className="p-col">
                            {this.renderPropertyTableCard()}
                        </div>
                        {this.state.selectedProperty &&
                        <div className="p-col">
                            {this.renderPropertyDetailsCard()}
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

}
