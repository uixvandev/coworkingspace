import { useState } from "react";

interface ReviewModalProps {
    reservation_id: number;
    onClose: () => void;
    onSubmit: (reservation_id: number, komentar: string) => void;
}

export const ReviewModal = ({ reservation_id, onClose, onSubmit }: ReviewModalProps) => {
    const [komentar, setKomentar] = useState('');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-backgroundLight p-6 rounded-lg w-[500px] border-2 border-background shadow-xl">
                <h3 className="text-xl mb-4 text-highlight font-bold">Write Review</h3>
                <textarea 
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    className="w-full p-2 rounded bg-background border border-paragraph focus:border-highlight focus:outline-none text-paragraph"
                    rows={4}
                    placeholder="Write your review here..."
                />
                <div className="flex justify-end gap-2 mt-6">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 rounded bg-attention text-background hover:bg-red-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {onSubmit(reservation_id, komentar);onClose();}}
                        className="px-4 py-2 rounded bg-highlight text-background hover:bg-[#FFB340] transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};