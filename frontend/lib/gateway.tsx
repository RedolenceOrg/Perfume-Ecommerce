export const initiateEsewaPayment = (data: any) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    const fields = {
        amount: String(data.amount),
        tax_amount: String(data.tax_amount),
        total_amount: String(data.total_amount),
        transaction_uuid: data.transaction_uuid,
        product_code: data.product_code,
        product_service_charge: String(data.product_service_charge),
        product_delivery_charge: String(data.product_delivery_charge),
        success_url: `http://localhost:8000/cart/payment/esewa/confirm/${data.transaction_uuid}/`,
        failure_url: `http://localhost:8000/cart/payment/esewa/confirm/${data.transaction_uuid}/`,
        signed_field_names: data.signed_field_names,
        signature: data.signature,
    };

    Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
};