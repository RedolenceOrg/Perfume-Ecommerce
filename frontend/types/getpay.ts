import { CartItem } from "./perfumes";
const T = {
  primary: "#271310",
  secondary: "#775a19",
  background: "#fbf9f5",
  surface: "#fbf9f5",
  surfaceLow: "#f5f3ef",
  surfaceHigh: "#eae8e4",
  outline: "#827472",
  outlineVar: "#d3c3c0",
  secContainer: "#fed488",
  fontHeadline: "'Noto Serif', Georgia, serif",
  fontBody: "'Manrope', Arial, sans-serif",
};

interface OrderInfoParams {
  items: CartItem[]
  subtotal: number
  total: number
  shippingCharge: number
  district: string
  discount_percent: number
  discount_amount: number
  valleyDistricts: string[]   // ← this fixes it
}

/**
 * Generates the orderInformationUI HTML string for GetPay.
 *
 * @param {Object} params
 * @param {Array}  params.items            - Cart items
 * @param {string} params.items[].images   - Image URL
 * @param {string} params.items[].variant_name
 * @param {number} params.items[].quantity
 * @param {number} params.items[].total_price
 * @param {number} params.subtotal
 * @param {number} params.total
 * @param {number} params.shippingCharge
 * @param {string} params.district         - Selected district string
 * @param {number} params.discount_percent
 * @param {number} params.discount_amount
 * @param {Array}  params.valleyDistricts  - VALLEY_DISTRICTS array
 * @returns {string} HTML string
 */

export function buildOrderInformationUI({
  items = [],
  subtotal = 0,
  total = 0,
  shippingCharge = 0,
  district = "",
  discount_percent = 0,
  discount_amount = 0,
  valleyDistricts = [],
}: OrderInfoParams) {
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const isValley = valleyDistricts.includes(district);

  // ─── Item rows ──────────────────────────────────────────────────────────────
  const itemRows = items.map((item) => `
    <div style="
      display:flex;
      align-items:center;
      gap:14px;
      padding:14px 0;
      border-bottom:1px solid ${T.outlineVar};
    ">
      <div style="
        width:64px; height:64px;
        border-radius:4px;
        border:1px solid ${T.outlineVar};
        background:${T.surfaceLow};
        flex-shrink:0;
        overflow:hidden;
      ">
        <img
          src="${item.images}"
          alt="${item.variant_name}"
          style="width:100%;height:100%;object-fit:contain;padding:4px;"
        />
      </div>
      <div style="flex:1;min-width:0;">
        <p style="
          margin:0 0 2px;
          font-family:${T.fontBody};
          font-size:13px;
          font-weight:700;
          color:${T.primary};
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        ">${item.variant_name}</p>
        <p style="
          margin:0;
          font-family:${T.fontBody};
          font-size:11px;
          letter-spacing:0.12em;
          text-transform:uppercase;
          color:${T.outline};
        ">Qty: ${item.quantity}</p>
      </div>
      <p style="
        margin:0;
        font-family:${T.fontBody};
        font-size:13px;
        font-weight:700;
        color:${T.primary};
        white-space:nowrap;
      ">NPR ${Math.round(item.total_price).toLocaleString()}</p>
    </div>
  `).join("");

  // ─── Discount row (conditional) ─────────────────────────────────────────────
  const discountRow = discount_percent > 0 ? `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-family:${T.fontBody};font-size:13px;color:#2e7d32;">
        Discount (${discount_percent}%)
      </span>
      <span style="font-family:${T.fontBody};font-size:13px;font-weight:600;color:#2e7d32;">
        − NPR ${Math.round(discount_amount).toLocaleString()}
      </span>
    </div>
  ` : "";

  // ─── Shipping row ───────────────────────────────────────────────────────────
  const shippingRow = district ? `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-family:${T.fontBody};font-size:13px;color:${T.outline};">Delivery</span>
      <span style="font-family:${T.fontBody};font-size:13px;font-weight:700;color:${T.primary};">
        NPR ${shippingCharge}
        <span style="font-size:10px;font-weight:400;color:${T.outline};margin-left:4px;">
          (${isValley ? "inside valley" : "outside valley"})
        </span>
      </span>
    </div>
  ` : `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-family:${T.fontBody};font-size:13px;color:${T.outline};">Delivery</span>
      <span style="font-family:${T.fontBody};font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${T.outline};opacity:0.5;">
        Select district
      </span>
    </div>
  `;

  // ─── Full HTML string ────────────────────────────────────────────────────────
  return `
<div style="
  font-family:${T.fontBody};
  background:${T.background};
  padding:clamp(16px, 4%, 32px) clamp(16px, 5%, 32px);
  box-sizing:border-box;
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  overflow:hidden;
">

  <!-- Header -->
  <p style="
    margin:0 0 4px;
    font-family:${T.fontBody};
    font-size:10px;
    letter-spacing:0.3em;
    text-transform:uppercase;
    color:${T.outline};
  ">Your Selection</p>

  <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:24px;flex-wrap:wrap;">
    <h2 style="
      margin:0;
      font-family:${T.fontHeadline};
      font-size:28px;
      font-weight:400;
      color:${T.primary};
      line-height:1.2;
    ">Order Summary</h2>
    <span style="
      font-family:${T.fontBody};
      font-size:13px;
      color:${T.outline};
      font-weight:400;
    ">(${totalItems} ${totalItems === 1 ? "item" : "items"})</span>
  </div>

  <!-- Items -->
  <div style="flex:1;overflow-y:auto;margin-bottom:16px;min-height:0;">
  ${itemRows}
</div>

  <!-- Price breakdown -->
  <div style="
    padding-top:16px;
    border-top:1px solid ${T.outlineVar};
  ">
    <!-- Subtotal -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <span style="font-family:${T.fontBody};font-size:13px;color:${T.outline};">Subtotal</span>
      <span style="font-family:${T.fontBody};font-size:13px;color:${T.outline};">
        NPR ${Math.round(subtotal).toLocaleString()}
      </span>
    </div>

    ${discountRow}
    ${shippingRow}

    <!-- Total -->
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding-top:14px;
      margin-top:4px;
      border-top:1px solid ${T.outlineVar};
    ">
      <span style="font-family:${T.fontHeadline};font-size:18px;color:${T.primary};">Total</span>
      <span style="font-family:${T.fontBody};font-size:18px;font-weight:700;color:${T.primary};">
        NPR ${Math.round(total).toLocaleString()}
      </span>
    </div>
  </div>

</div>
  `.trim();
}