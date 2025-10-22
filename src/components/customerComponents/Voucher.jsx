import React from 'react';
import './voucher.css';

const getVoucherStatus = (voucher) => {
    const now = new Date();
    const expirationDate = new Date(voucher.expirationDate);

    if (voucher.status == "Used") {
        return { text: 'Used', className: 'status-used' };
    }
    if (expirationDate < now) {
        return { text: 'Expired', className: 'status-expired' };
    }
    if (voucher.status == "Active") {
        return { text: 'Active', className: 'status-active' };
    }
    return { text: 'Inactive', className: 'status-inactive' };
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sr-RS'); 
};

const VoucherCard = ({ voucher }) => {
    const { name, code, discountAmount, expirationDate } = voucher;

    const status = getVoucherStatus(voucher);

    const formattedExpiry = formatDate(expirationDate);

    const discountDisplay = name.includes('%') ? `${discountAmount}%` : `${discountAmount} RSD`;

    return (
        <div className={`voucher-card ${status.className}`}>
            
            <div className="voucher-status-line">
                {status.text}
            </div>

            <div className="voucher-content">
                <div className="voucher-header">
                    <h3>{name}</h3>
                    <span className="voucher-discount">{discountDisplay}</span>
                </div>
                
                <div className="voucher-code-section">
                    <p>Code:</p>
                    <strong className="voucher-code">{code}</strong>
                </div>
            </div>

            <div className="voucher-footer">
                <p>Expires: {formattedExpiry}</p>
            </div>
        </div>
    );
};

export default VoucherCard;