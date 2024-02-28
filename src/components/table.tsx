import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net';
import "../App.css"
import { useSelector } from 'react-redux';
import { FormValues } from '../interfaces/auth';

const Tabledata: React.FC = () => {
    const tableRef = useRef<HTMLTableElement>(null);
    const userDetails = useSelector((data: any) => data.userDetailsSlice);
    const dataTableRef = useRef<any>();

    useEffect(() => {
        if (tableRef.current) {
            // Check if DataTable instance exists
            const dataTableExists = $.fn.DataTable.isDataTable(tableRef.current);

            // If DataTable instance exists, destroy it
            if (dataTableExists) {
                dataTableRef.current?.destroy();
            }

            // Initialize DataTable
            dataTableRef.current = $(tableRef.current).DataTable({
                paging: true,
                scrollY: "50vh",
            });
        }
    }, []);


    useEffect(() => {
        // Add new data to the DataTable
        if (dataTableRef.current && userDetails?.registerData) {
            //clearing initial ref  
            dataTableRef.current.clear();
            userDetails.registerData.forEach((data: FormValues) => {
                // Extract the values for each column from the object
                const rowData = [
                    data["Name"],
                    data["Age"],
                    data["Mobile"] || "",
                    data["Sex"],
                    data["ID_type"],
                    data["ID"],
                    data["Address"],
                    data["State"] || "",
                    data["City"] || "",
                    data["Country"] || ""
                ];
                dataTableRef.current.row.add(rowData);
            });

            dataTableRef.current.draw(false); //
        }
    }, [userDetails?.registerData]);

    return (
        <table className='table hover stripe' ref={tableRef}>
            <thead>
                <tr className='tableHeading'>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Mobile</th>
                    <th>Gender</th>
                    <th>Govt ID type</th>
                    <th>ID</th>
                    <th>Address</th>
                    <th>State</th>
                    <th>City</th>
                    <th>Country</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    );
};

export default Tabledata;
