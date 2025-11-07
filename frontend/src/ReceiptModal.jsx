export default function ReceiptModal({ receipt, onClose }){
  if(!receipt) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>🧾 Receipt</h2>
        <p><strong>Total:</strong> ₹{receipt.total}</p>
        <p><strong>Time:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
