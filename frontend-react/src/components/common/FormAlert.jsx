import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const FormAlert = ({ type = 'danger', message, onClose }) => {
    if (!message) return null;

    const iconMap = {
        danger: faExclamationTriangle,
        success: faCheckCircle,
        info: faInfoCircle,
        warning: faExclamationTriangle,
    };

    const alertClass = {
        danger: 'error-banner',
        success: 'success-banner',
        info: 'alert alert-info',
        warning: 'alert alert-warning',
    }[type] || 'error-banner';

    return (
        <div className={`${alertClass} mb-3 d-flex align-items-center justify-content-between`}>
            <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={iconMap[type] || faExclamationTriangle} className="flex-shrink-0" />
                <div>{Array.isArray(message) ? message.join(', ') : message}</div>
            </div>
            {onClose && (
                <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    onClick={onClose}
                    aria-label="Close"
                />
            )}
        </div>
    );
};

export default FormAlert;
