import crypto from "crypto";
import axios from "axios";

const { PHONEPE_MERCHANT_ID, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX, PHONEPE_BASE_URL } = process.env;

console.log({
  merchantId: PHONEPE_MERCHANT_ID,
  baseUrl: PHONEPE_BASE_URL,
  saltIndex: PHONEPE_SALT_INDEX,
  saltKey: PHONEPE_SALT_KEY.slice(0, 4) + '...' 
});

// 🔹 Create payment helper
export const createPhonePePayment = async (amount, userId) => {
  try {
    const transactionId = `txn_${Date.now()}`;

    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId || "guest_user",
      amount: amount * 100, 
      redirectUrl: `${process.env.FRONTEND_URL}/payment-status/${transactionId}`,
      redirectMode: "REDIRECT",
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const data = Buffer.from(JSON.stringify(payload)).toString("base64");
    const checksum =
      crypto.createHash("sha256").update(data + "/pg/v1/pay" + PHONEPE_SALT_KEY).digest("hex") +
      "###" + PHONEPE_SALT_INDEX;

    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: data },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
      }
    );

    const paymentUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;
        const qrString = response.data?.data?.instrumentResponse?.redirectInfo?.qrCode;
console.log("paymentUrl",paymentUrl);
console.log("qrString",paymentUrl);

    return { paymentUrl, transactionId, qrString };
  } catch (error) {
    console.error("Error creating PhonePe payment:", error.response?.data || error);
    throw new Error("PhonePe payment creation failed");
  }
};


export const checkPhonePeStatus = async (transactionId) => {
  const checksum =
    crypto
      .createHash("sha256")
      .update(`/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}` + PHONEPE_SALT_KEY)
      .digest("hex") +
    "###" +
    PHONEPE_SALT_INDEX;

  const response = await axios.get(
    `${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${transactionId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
      },
    }
  );

  return response.data;
};
