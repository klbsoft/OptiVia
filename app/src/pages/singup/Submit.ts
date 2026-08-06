import type { SignUpFormData, CardFormData } from "./Singup";
import {API_SIGNUP, API_APM,API_UPLOAD} from "../../constants/config";



async function Submit(info: SignUpFormData, card: CardFormData) {
  const userData = {
    name: info.name,
    last_name: info.lastName,
    date_of_birth: info.dateOfBirth || null,
    email: info.email,
    phone: info.phone || null,
    password_hash: info.password,
    user_type: info.isSpecialUser ? info.userType : "regular",
  };

  try {
    let response = await fetch(API_SIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    let text = await response.text();
    const split = text.split(':');
    const id = split[1]; 
    if (card){
        const cardPayload = {
        method_type: "card",
        id: id,
        name_on_card: card.nameOnCard,
        card_number: card.cardNumber.replace(/-/g, "").slice(-4),
        card_type: card.cardType === "visa" ? "Visa" : "Mastercard",
        expiry_date: card.expiryDate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        cvv: card.cvv
        };

        response = await fetch(API_APM, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardPayload),
        });

    text = await response.text();
    console.log({text});
    }
    const file = info.verificationDoc ;
    // const url = URL.createObjectURL(file);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = file.name;
    // a.click();
    // URL.revokeObjectURL(url);
    if (file){
        const f = file as File;
        const size = f.size; 
        const MAX_SIZE = 25 * 1024 * 1024; // 25MB

        if (size > MAX_SIZE) {
          alert("El archivo es demasiado grande. El tamaño máximo permitido es 25MB. Por favor, acérquese a la estación de autobuses más cercana para verificar sus documentos en persona, ya que solo se permite un intento de subida.");
          return "ok"; 
        }
        const form = new FormData();
        form.append("user_id", id);
        form.append("file",file as File);

        await fetch(API_UPLOAD, {
        method: "POST",
 
        body: form,
        });
    }
    return "ok"; 
  } catch (error) {
    alert("Error al enviar los datos , intente de nuevo");
    console.error(error);
  }
}

export default Submit;