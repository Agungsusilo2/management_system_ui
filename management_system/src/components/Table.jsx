import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function DataTable({
                                      title = "Data",
                                      data = [],
                                      columns = [],
                                      searchPlaceholder = "Cari...",
                                      onEdit,
                                      onDelete,
                                      onAdd,
                                      customActions,
                                  }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey,setSortKey] = useState(null)
    const [sortOrder,setSortOrder] = useState(null)

    const filteredData = data.filter((row) =>
        columns.some((col) =>
            String(row[col.key] || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    );

    const handleSort = (key)=>{
        if(sortKey === key){
            setSortOrder((prevOrder)=>(prevOrder === "asc" ? "desc" : "asc"))
        }else{
            setSortKey(key);
            setSortOrder("asc")
        }
    }

    const sortedData = [...filteredData].sort((a,b)=>{
        if(!sortKey) return 0 ;

        const valueA = String(a[sortKey] || "").toLowerCase();
        const valueB = String(b[sortKey] || "").toLowerCase();

        return sortOrder === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
    })

    return (
        <div className="container py-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
                <h5 className="mb-0">{title}</h5>
                <input
                    type="text"
                    className="form-control"
                    placeholder={`🔍 ${searchPlaceholder}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {onAdd && (
                    <button className="btn btn-outline-primary" onClick={onAdd}>
                        <FaPlus /> Tambah
                    </button>
                )}
            </div>

            <div className="table-responsive shadow-sm border rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                    <tr>
                        <th>#</th>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={()=>handleSort(col.key)}
                                className="cursor-pointer user-select-none"
                            >
                                {col.label}
                                {sortKey === col.key && (sortOrder === "asc" ? "↑" : "↓")}
                            </th>
                        ))}
                        {(onEdit || onDelete || customActions) && <th>Aksi</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedData.length> 0 ? (
                        sortedData.map((row, index) => (
                            <tr key={row.id || index}>
                                <td>{index + 1}</td>
                                {columns.map((col) => (
                                    <td key={col.key}>{row[col.key]}</td>
                                ))}
                                {(onEdit || onDelete || customActions) && (
                                    <td>
                                        <div className="btn-group">
                                            {onEdit && (
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => onEdit(row)}
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => onDelete(row)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                            {customActions && customActions(row)}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 2} className="text-center text-muted py-3">
                                Tidak ada data ditemukan.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
