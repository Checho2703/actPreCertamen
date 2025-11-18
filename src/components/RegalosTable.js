import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const RegalosTable = () => {
    const [regalos, setRegalos] = useState([]);
    const tableRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, 'regalo'), orderBy('prioridad', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const regalosData = [];
            querySnapshot.forEach((doc) => {
                regalosData.push({ id: doc.id, ...doc.data() });
            });
            setRegalos(regalosData);
        });
        return () => unsubscribe();
    }, []);

    const exportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { html: tableRef.current });
        doc.save('regalos.pdf');
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(regalos);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Regalos');
        XLSX.writeFile(wb, 'regalos.xlsx');
    };

    const exportPNG = () => {
        html2canvas(tableRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'regalos.png';
            link.click();
        });
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h2 className="card-title text-center h4"> Regalos</h2>
                <div className="text-center mb-3">
                    <button onClick={exportPDF} className="btn btn-danger btn-sm me-2">PDF</button>
                    <button onClick={exportExcel} className="btn btn-success btn-sm me-2">Excel</button>
                    <button onClick={exportPNG} className="btn btn-info btn-sm text-white">PNG</button>
                </div>

                <div className="table-responsive">
                    <table ref={tableRef} id="regalos-table" className="table table-bordered table-hover align-middle text-center">
                        <thead className="table-primary">
                            <tr>
                                <th>Regalo</th>
                                <th>Familiar</th>
                                <th>Prioridad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {regalos.map((regalo) => (
                                <tr key={regalo.id}>
                                    <td>{regalo.nombreRegalo}</td>
                                    <td>{regalo.nombreFamiliar}</td>
                                    <td>{regalo.prioridad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RegalosTable;