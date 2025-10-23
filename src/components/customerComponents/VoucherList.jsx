import React from 'react';
import Voucher from './Voucher';


const VoucherList = ({ vouchers, active }) => {
    if (!vouchers || vouchers.length === 0) {
        return <p>No vouchers available right now!</p>;
    }

    return (
        <section id="voucher-list" className={active}>
            {vouchers.map(voucher => (
                <Voucher
                    key={voucher.id}
                    voucher={voucher}
                />
            ))}
        </section>
    );
};

export default VoucherList;