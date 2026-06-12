
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
        success_url: `${process.env.NEXT_PUBLIC_API_URL}/cart/payment/esewa/confirm/${data.transaction_uuid}/`,
        failure_url: `${process.env.NEXT_PUBLIC_API_URL}/cart/payment/esewa/confirm/${data.transaction_uuid}/`,
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


export const initiateGetPayPayment = (data: any) => {
    const options = {
        papInfo: process.env.NEXT_PUBLIC_PAP_INFO,
        oprKey: process.env.NEXT_PUBLIC_OPR_KEY,
        insKey: process.env.NEXT_PUBLIC_INS_KEY || '',
        clientRequestId: data.clientRequestId,
        price: data.price,
        currency: data.currency,
        allowBillingAddressFields: true,
        websiteDomain: data.websiteDomain,
        businessName: data.businessName,
        imageUrl: data.imageUrl,
        themeColor: '#5662FF',
        userInfo: data.userInfo,
        prefill: data.prefill,
        baseUrl: process.env.NEXT_PUBLIC_GETPAY_BASE_URL,
        orderInformationUI: data.orderInformationUI,
        callbackUrl: {
            successUrl: data.callbackUrl.successUrl,
            failUrl: data.callbackUrl.failUrl,
        },

        onSuccess: (response: any) => {
            data.onSuccess?.(response)
        },
        onError: (error: any) => {
            data.onError?.(error)
        },
    }
    const getPay = new (window as any).GetPay(options)
    getPay.initialize()
}