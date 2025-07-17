import { useEffect, useState } from "react";

export default function ModalForm({ show, onClose, onSubmit, initialData = {}, fields = [] }) {
    const [formState, setFormState] = useState({});

    useEffect(() => {
        const newState = {};
        fields.forEach((field) => {
            newState[field.name] = initialData?.[field.name] || "";
        });
        setFormState(newState);
    }, [initialData, fields]);

    if (!show) return null;

    const handleChange = (e, name) => {
        setFormState({ ...formState, [name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formState);
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header">
                            <h5 className="modal-title">{initialData ? "Edit" : "Tambah"} Data</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            {fields.map((field) => (
                                <div className="mb-3" key={field.name}>
                                    <label className="form-label">{field.label}</label>
                                    {field.type === "select" ? (
                                        <select
                                            className="form-select"
                                            value={formState[field.name]}
                                            onChange={(e) => handleChange(e, field.name)}
                                            required={field.required}
                                            disabled={field.disabled}
                                        >
                                            <option value="">-- Pilih --</option>
                                            {field.options?.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.type === "textarea" ? (
                                        <textarea
                                            className="form-control"
                                            value={formState[field.name]}
                                            onChange={(e) => handleChange(e, field.name)}
                                            required={field.required}
                                            disabled={field.disabled}
                                        />
                                    ) : (
                                        <input
                                            type={field.type || "text"}
                                            className="form-control"
                                            value={formState[field.name]}
                                            onChange={(e) => handleChange(e, field.name)}
                                            required={field.required}
                                            disabled={field.disabled}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">Simpan</button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
