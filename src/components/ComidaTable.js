import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const ComidaTable = () => {
    const [comida, setComida] = useState([]);
    const tableRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, 'comida'), orderBy('esCongelado', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const comidaData = [];
            querySnapshot.forEach((doc) => {
                comidaData.push({ id: doc.id, ...doc.data() });
            });
            setComida(comidaData);
        });
        return () => unsubscribe();
    }, []);


    const exportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { html: tableRef.current });
        doc.save('comida.pdf');
    };

    const exportExcel = () => {
        const dataToExport = comida.map(item => ({
            Alimento: item.nombreAlimento,
            Congelado: item.esCongelado ? 'Sí' : 'No'
        }));
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Comida');
        XLSX.writeFile(wb, 'comida.xlsx');
    };

    const exportPNG = () => {
        html2canvas(tableRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'comida.png';
            link.click();
        });
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h2 className="card-title text-center h4">Comida</h2>
                <div className="text-center mb-3">
                    <button onClick={exportPDF} className="btn btn-danger btn-sm me-2">PDF</button>
                    <button onClick={exportExcel} className="btn btn-success btn-sm me-2">Excel</button>
                    <button onClick={exportPNG} className="btn btn-info btn-sm text-white">PNG</button>
                </div>

                <div className="table-responsive">
                    <table ref={tableRef} id="comida-table" className="table table-bordered table-hover align-middle text-center">
                        <thead className="table-primary">
                            <tr>
                                <th>Alimento</th>
                                <th>Congelado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comida.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.nombreAlimento}</td>
                                    <td>{item.esCongelado ? 'Sí' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComidaTable;