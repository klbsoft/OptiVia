import { useState } from "react";
import type { CardFormData } from "./Singup";
import { commonStyles } from "../../components/theme/default";

interface CardFormProps {
  cardData: CardFormData;
  setCardData: (data: CardFormData) => void;
  userName: string;
}

const cardTypes = ["visa", "mastercard"];

const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  const trimmed = digits.slice(0, 16);
  const groups = trimmed.match(/.{1,4}/g);
  return groups ? groups.join("-") : "";
};

const inputStyle: React.CSSProperties = {
  borderRadius: "20px",
  padding: "12px 16px",
  border: `2px solid ${commonStyles.green}`,
  backgroundColor: "#FFFFFF",
  color: commonStyles.blue,
  width: "100%",
  outline: "none",
  fontSize: commonStyles.text_font_size,
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: commonStyles.blue,
  marginBottom: "6px",
  opacity: 0.7,
};

function CardForm({ cardData, setCardData, userName }: CardFormProps) {
  const [showCardType, setShowCardType] = useState(false);

  const updateField = (field: keyof CardFormData, value: any) => {
    setCardData({ ...cardData, [field]: value });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
        <span style={{ color: commonStyles.blue, fontSize: commonStyles.text_font_size }}>
          ¿Agregar método de pago?
        </span>
        <div
          onClick={() => updateField("addCard", !cardData.addCard)}
          style={{
            width: "48px",
            height: "26px",
            borderRadius: "13px",
            backgroundColor: cardData.addCard ? commonStyles.green : "#CCCCCC",
            position: "relative",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              backgroundColor: "white",
              position: "absolute",
              top: "2px",
              left: cardData.addCard ? "24px" : "2px",
              transition: "left 0.2s",
            }}
          />
        </div>
      </div>

      {cardData.addCard && (
        <>
          <div>
            <div style={labelStyle}>Nombre en la tarjeta</div>
            <input
              type="text"
              style={inputStyle}
              value={cardData.nameOnCard}
              onChange={(e) => updateField("nameOnCard", e.target.value)}
              placeholder={userName || "Nombre en la tarjeta"}
            />
          </div>

          <div>
            <div style={labelStyle}>Número de tarjeta</div>
            <input
              type="text"
              style={inputStyle}
              value={cardData.cardNumber}
              onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
              placeholder="0000-0000-0000-0000"
              maxLength={19}
            />
          </div>

          <div>
            <div style={labelStyle}>Fecha de expiración</div>
            <input
              type="date"
              style={inputStyle}
              value={cardData.expiryDate}
              onChange={(e) => updateField("expiryDate", e.target.value)}
            />
          </div>

          <div>
            <div style={labelStyle}>CVV</div>
            <input
              type="text"
              style={inputStyle}
              value={cardData.cvv}
              onChange={(e) => updateField("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="123"
              maxLength={3}
            />
          </div>

          <div>
            <div style={labelStyle}>Tipo de tarjeta</div>
            <div style={{ position: "relative" }}>
              <div
                onClick={() => setShowCardType(!showCardType)}
                style={{ ...inputStyle, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span>{cardData.cardType === "visa" ? "Visa" : "Mastercard"}</span>
                <span style={{ color: commonStyles.green }}>▼</span>
              </div>
              {showCardType && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "white", border: "1px solid #E0E0E0", borderRadius: "12px", marginTop: "4px", zIndex: 1000 }}>
                  {cardTypes.map((type) => (
                    <div
                      key={type}
                      onClick={() => { updateField("cardType", type); setShowCardType(false); }}
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                        color: commonStyles.blue,
                        backgroundColor: cardData.cardType === type ? "rgba(108, 194, 74, 0.1)" : "white",
                      }}
                    >
                      {type === "visa" ? "Visa" : "Mastercard"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CardForm;