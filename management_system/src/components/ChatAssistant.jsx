import {useState} from "react";
import {alertFailed} from "../lib/alert.js";
import {FaPaperPlane} from "react-icons/fa";

export default function ChatAssistant({fields = [],onAIResponse}) {
    const [input,setInput] = useState("")
    const [loading,setLoading] = useState(false);

    const handleSend = async ()=>{
        if(!input.trim()) return;

        setLoading(true)

        const formatFields =fields.map(f=>`${f}:""`).join(", ")
        const prompt = `Kamu adalah sistem backend assistant. Jawab hanya dengan JSON mentah tanpa penjelasan tambahan.\\n\\nUbah perintah ini ke JSON format untuk tambah data\n\n${input}\n\nFormat: { action: "add", items: [ { ${formatFields} } ] }.\nJika ada banyak data, buat dalam items[] secara lengkap.`;

        try{
            const res = await fetch(`${import.meta.env.VITE_BOT_API_PATH}`, {
                method: "POST",
                body: JSON.stringify({
                    model: `${import.meta.env.VITE_BOT_MODEL}`,
                    prompt: prompt,
                    stream: false,
                }),
            });

            const data = await res.json()

            console.log(data)
            const jsonText = data.response.match(/\{[\s\S]*\}/)?.[0];
            const parsed = JSON.parse(jsonText);
            onAIResponse(parsed);
        }catch (e) {
            await alertFailed("❌ Gagal memproses respon AI. Coba pastikan inputnya jelas.")
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-4">
            <div className="border rounded shadow-sm p-3 bg-white">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <img
                        src="/images/chatbot.png"
                        alt="Botty"
                        width={40}
                        height={40}
                        className="rounded-circle border"
                    />
                    <strong>Botty</strong>
                </div>

                {/* Input & Button */}
                <div className="d-flex gap-2 align-items-center">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="💬 Contoh: Tambahkan bahan kajian Etika Profesi referensi REF001"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={loading}
                    />
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={handleSend}
                        disabled={loading}
                    >
                        {loading ? "Mengirim..." : <>
                            <FaPaperPlane /> Kirim
                        </>}
                    </button>
                </div>
            </div>
        </div>
    );
}