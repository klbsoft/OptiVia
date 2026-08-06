import { useState } from "react";
import { commonStyles } from "../../components/theme/default";
import { useUserSession } from "../../context/UserSessionContext";
import type { Card } from "../../session/UserSession";
import "../../animation.css"
 
function Cards() {
  const [name_on_card, setNameOnCard] = useState("");
  const [card_number, setCardNumber] = useState("");
  const [expiry_date, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [card_type, setCardType] = useState("visa");
  const [showCardType, setShowCardType] = useState(false);
  const { session, updateSession } = useUserSession();
  const [savedCards, setSavedCards] = useState<Card[]>(session.cards);
  const cardTypes = ["visa", "mastercard"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new card object
    const newCard: Card = {
      id: Date.now().toString(),
      name_on_card,
      card_number,
      expiry_date,
      cvv,
      card_type
    };
    updateSession({ cards: [...savedCards, newCard] });

    // Add card to the list
    setSavedCards([...savedCards, newCard]);
    
    // Clear form fields
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setNameOnCard("");
    setCardType("visa");
    
    console.log({ card_number, expiry_date, cvv, card_type });
  };

  const handleRemoveCard = (cardId: string) => {
    updateSession({ cards: savedCards.filter(card => card.id !== cardId) });
    setSavedCards(savedCards.filter(card => card.id !== cardId));
  };

  const maskCardNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`;
  };
  const get_payment_type = (card_type:string)=>{
    switch (card_type){
      case "Visa": //card.card_type === "visa" ? "Visa" : "Mastercard"
      return "Visa";
      case "Mastercard":
        return "Mastercard";
      case "Balance":
        return "Balance";
    }
    return "No Soportada"; 
  }
const formatCardNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Limit to 16 digits
  const trimmed = digits.slice(0, 16);
  
  // Add dash after every 4 digits
  const groups = trimmed.match(/.{1,4}/g);
  return groups ? groups.join('-') : '';
};
  return (
    <div 
     className="page-transition"
    style={{ 
      padding: "16px", 
      paddingTop: "16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <p style={{ marginTop: "16px", color: commonStyles.blue, textAlign: "center" }}>
        Agregar o administrar tarjetas
      </p>


      <div style={{ position: "relative", width: "100%", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Nombre en la Tarjeta (opcional)."
          maxLength={16}
          value={name_on_card}
          onChange={(e) => setNameOnCard(e.target.value)}
          style={{
            borderRadius: "20px",
            padding: "12px 16px",
            border: `2px solid ${commonStyles.green}`,
            backgroundColor: "#FFFFFF",
            color: commonStyles.blue,
            width: "80%",
            outline: "none",
            fontSize: commonStyles.text_font_size
          }}
        />
      </div>
            <div style={{ position: "relative", width: "100%", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Número de Tarjeta"
          maxLength={19}
          value={card_number}
          onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setCardNumber(formatted);
          }}
          style={{
            borderRadius: "20px",
            padding: "12px 16px",
            border: `2px solid ${commonStyles.green}`,
            backgroundColor: "#FFFFFF",
            color: commonStyles.blue,
            width: "80%",
            outline: "none",
            fontSize: commonStyles.text_font_size
          }}
        />
      </div>

      <div style={{ position: "relative", width: "100%", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
        <input
          type="date"
          placeholder="Fecha de Expiración (MM/YY)"
          maxLength={5}
          value={expiry_date}
          onChange={(e) => setExpiryDate(e.target.value)}
          style={{
            borderRadius: "20px",
            padding: "12px 16px",
            border: `2px solid ${commonStyles.green}`,
            backgroundColor: "#FFFFFF",
            color: commonStyles.blue,
            width: "80%",
            outline: "none",
            fontSize: commonStyles.text_font_size
          }}
        />
      </div>

      <div style={{ position: "relative", width: "100%", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="CVV"
          maxLength={3}
          value={cvv}
              onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setCvv(value);
          }}
          style={{
            borderRadius: "20px",
            padding: "12px 16px",
            border: `2px solid ${commonStyles.green}`,
            backgroundColor: "#FFFFFF",
            color: commonStyles.blue,
            width: "80%",
            outline: "none",
            fontSize: commonStyles.text_font_size
          }}
        />
      </div>

      <div style={{ position: "relative", width: "100%", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
        <div
          onClick={() => setShowCardType(!showCardType)}
          style={{
            borderRadius: "20px",
            padding: "12px 16px",
            border: `2px solid ${commonStyles.green}`,
            backgroundColor: "#FFFFFF",
            color: commonStyles.blue,
            width: "80%",
            cursor: "pointer",
            position: "relative",
            fontSize: commonStyles.text_font_size
          }}
        >
          {card_type === "visa" ? "Visa" : "Mastercard"}
          <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: commonStyles.green }}>▼</span>
        </div>

        {showCardType && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: "10%",
            right: "10%",
            backgroundColor: "white",
            border: "1px solid #E0E0E0",
            borderRadius: "12px",
            marginTop: "4px",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto"
          }}>
            {cardTypes.map((type) => (
              <div
                key={type}
                onClick={() => { setCardType(type); setShowCardType(false); }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                  color: commonStyles.blue
                }}
              >
                {type === "visa" ? "Visa" : "Mastercard"}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: commonStyles.blue,
          border: "none",
          width: "80%",
          borderRadius: "20px",
          padding: "12px",
          color: "white",
          marginTop: "16px",
          fontSize: commonStyles.button_fontSize,
          fontWeight: commonStyles.button_fontWeight,
          cursor: "pointer"
        }}
      >
        Guardar Tarjeta
      </button>

      {/* Saved Cards List */}
      {savedCards.length > 0 && (
        <div style={{ width: "80%", marginTop: "32px" }}>
          <h3 style={{ 
            color: commonStyles.blue, 
            textAlign: "center",
            marginBottom: "16px",
            fontSize: commonStyles.text_font_size
          }}>
            Tarjetas Guardadas
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {savedCards.map((card) => (
              <div
                key={card.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "20px",
                  padding: "12px 16px",
                  border: `2px solid ${commonStyles.green}`,
                  backgroundColor: "#FFFFFF",
                  color: commonStyles.blue,
                  fontSize: commonStyles.text_font_size
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    {get_payment_type(card.card_type) }
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.8 }}>
                    {
                      card.card_type === "Balance"? `RD$ ${card.card_number}` :maskCardNumber(card.card_number)
                    }
                  </div>
                  <div style={{ fontSize: "12px", opacity: 0.6 }}>
                    {
                      card.card_type === "Balance"?"":`Exp: ${card.expiry_date}`
                    }
                  </div>
                </div>
                <button
                  disabled={card.card_type === "Balance"}
                  onClick={() => handleRemoveCard(card.id)}
                  style={{
                    backgroundColor: card.card_type === "Balance" ? "gray" : "#ff4444",
                    border: "none",
                    borderRadius: "20px",
                    padding: "8px 16px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: commonStyles.text_font_size,
                    fontWeight: "bold",
                    minWidth: "80px"
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;