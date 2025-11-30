
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-md p-6">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
