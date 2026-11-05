 function Popup({ message, onClose, onConfirm, confirmLabel }) {
    return (
        <div className="overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="popup" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className="actions">
                    {onConfirm &&(
                <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel || 'Confirm'}</button>
                )}
                <button className="btn btn-outline" onClick={onClose}>{onConfirm ? 'Cancel' : 'Close'}</button>
                </div>
            </div>
        </div>
    );

}export default Popup