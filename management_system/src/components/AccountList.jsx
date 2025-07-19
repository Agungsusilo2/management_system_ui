import { useEffect, useState } from "react";
import {
    userAll,
    userRegister,
} from "../lib/api/userApi.js";

import {
    alertSuccess,
    alertFailed,
    alertConfirm,
} from "../lib/alert.js";

import DataTable from "../components/Table.jsx";
import ModalForm from "../components/ModelForm.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import ChatAssistant from "./ChatAssistant.jsx";

export default function AccountList() {
    const { authToken, user } = useAuth();
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const isAdmin = user?.user_type === "Admin";

    const fetchData = async () => {
        const res = await userAll({ token: authToken, page: page, size: size });
        const body = await res.json();

        console.log("User data fetched from API:", body);

        if (res.ok) {
            const mapped = body.data.map((item) => ({
                id: item.id,
                username: item.username,
                email: item.email,
                fullName: item.full_name,
                userType: item.user_type,
            }));
            setData(mapped);
            setTotalItems(body.paging?.total_item || mapped.length);
        } else {
            await alertFailed(body.errors || "Failed to fetch user data.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, authToken]);

    const prevHandle = () => {
        if (page > 1) setPage(page - 1);
    };

    const nextHandle = () => {
        const totalPages = Math.ceil(totalItems / size);
        if (page < totalPages) setPage(page + 1);
    };

    const handleAdd = () => {
        setSelectedRow(null);
        setModalVisible(true);
    };

    // const handleEdit = (row) => {
    //     setSelectedRow({
    //         id: row.id,
    //         username: row.username,
    //         email: row.email,
    //         fullName: row.fullName,
    //         userType: row.userType,
    //         // Password is not fetched/edited directly
    //     });
    //     setModalVisible(true);
    // };

    // const handleDelete = async (row) => {
    //     const confirm = await alertConfirm("Are you sure you want to delete this user?");
    //     if (!confirm) return;
    //
    //     const res = await userDelete({ token: authToken, id: row.id }); // Assuming userDelete takes user ID
    //     const body = await res.json();
    //     if (res.ok) {
    //         await alertSuccess("User deleted successfully!");
    //         fetchData();
    //     } else {
    //         await alertFailed(body.errors || "Failed to delete user.");
    //     }
    // };

    const handleSubmit = async (formData) => {
        const payload = {
            token: authToken,
            id: selectedRow ? selectedRow.id : undefined,
            username: formData.username,
            email: formData.email,
            full_name: formData.fullName,
            password_hash: formData.password,
            user_type: formData.userType,
        };

        console.log("Payload to API:", payload);

        let res;
        if (selectedRow) {
            // res = await userUpdate(payload);
        } else {
            res = await userRegister(payload);
        }

        const body = await res.json();
        console.log("API Response:", body);
        if (res.ok) {
            await alertSuccess("User saved successfully!");
            fetchData();
            setModalVisible(false);
        } else {
            await alertFailed(body.errors || "Failed to save user.");
        }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "fullName", label: "Full Name" },
        { key: "userType", label: "User Type" },
    ];

    const userTypeOptions = [
        { label: "Admin", value: "Admin" },
        { label: "Dosen", value: "Dosen" },
        // { label: "Mahasiswa", value: "Mahasiswa" },
        // { label: "Guest", value: "Guest" },
    ];

    const formFields = [
        {
            name: "id",
            label: "ID",
            type: "text",
            required: false,
            disabled: true,
        },
        {
            name: "username",
            label: "Username",
            type: "text",
            required: true,
            disabled: !!selectedRow,
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            required: !selectedRow,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
        },
        {
            name: "fullName",
            label: "Full Name",
            type: "text",
            required: true,
        },
        {
            name: "userType",
            label: "User Type",
            type: "select",
            options: userTypeOptions,
            required: true,
        },
    ];

    const handleAIResponse = async (result) => {
        if (!result || result.action !== "add" || !Array.isArray(result.items)) {
            await alertFailed("❌ AI format is incorrect. Must have `action: add` and `items[]`.");
            return;
        }
        for (const item of result.items) {
            const payload = {
                token: authToken,
                username: item.username,
                email: item.email,
                full_name: item.fullName,
                password_hash: item.password, // AI might generate a default password
                user_type: item.userType,
            };

            try {
                const res = await userAdd(payload);
                const body = await res.json();

                if (!res.ok) {
                    console.error("Failed:", body);
                    await alertFailed(`❌ Failed to add user: ${payload.username} - ${body.errors || 'Unknown error'}`);
                }
            } catch (err) {
                console.error(err);
                await alertFailed(`❌ Connection error: ${err.message}`);
            }
        }

        await alertSuccess("✅ All users added successfully!");
        fetchData();
    };


    return (
        <>
            {isAdmin && (
                <ChatAssistant
                    fields={[
                        "username", "password", "email", "fullName", "userType"
                    ]}
                    onAIResponse={handleAIResponse}
                />
            )}

            <DataTable
                title="Account List"
                data={data}
                columns={columns}
                onAdd={isAdmin ? handleAdd : undefined}
                // onEdit={isAdmin ? handleEdit : undefined}
                // onDelete={isAdmin ? handleDelete : undefined}
                searchPlaceholder="Search by username or email..."
            />

            <ModalForm
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                initialData={selectedRow}
                fields={formFields}
            />

            <div className="flex justify-center items-center gap-4 mt-4">
                <button
                    onClick={prevHandle}
                    disabled={page <= 1}
                    className={`btn btn-secondary px-4 py-2 rounded-md text-white ${
                        page <= 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    ← Prev
                </button>

                <span className="text-gray-700 font-medium">Page {page}</span>

                <button
                    onClick={nextHandle}
                    disabled={page >= Math.ceil(totalItems / size)}
                    className={`btn btn-primary px-4 py-2 rounded-md text-white ${
                        page >= Math.ceil(totalItems / size)
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    Next →
                </button>
            </div>
        </>
    );
}