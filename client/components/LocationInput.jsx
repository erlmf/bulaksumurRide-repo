export default function LocationInput({ label, value, onChange, placeholder }) {
    return (
        <div className="mb-4">
            <label className="block font-semibold mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
        </div>
    );
}