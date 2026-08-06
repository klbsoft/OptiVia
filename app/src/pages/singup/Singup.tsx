import { useState } from "react";
import { commonStyles } from "../../components/theme/default";
// import { useAuth } from "../../context/AuthContext";
import Submit from "./Submit";
import StepIndicator from "./StepIndicator";
import PersonalDataForm from "./PersonalDataForm";
import CardForm from "./CardForm";
import SuccessMessage from "./SuccessMessage";
import Logo from "./Logo";
// import Login from "../login/Login";
import "../../animation.css"
// import getRandomFormData from "./Tester"

export interface SignUpFormData {
  name: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isSpecialUser: boolean;
  userType: string;
  verificationDoc: File | null;
  docPreview: string | null;
}

export interface CardFormData {
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardType: string;
  addCard: boolean;
}

function SignUp({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  // const { login } = useAuth();
  const [step, setStep] = useState<"user" | "card">("user");
  const [saved, setSaved] = useState(false);

  // Personal data
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isSpecialUser: false,
    userType: "",
    verificationDoc: null,
    docPreview: null,
  });

  // Card data
  const [cardData, setCardData] = useState<CardFormData>({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardType: "visa",
    addCard: false,
  });
  // const run_test=()=>{
  //   const r = getRandomFormData();
  //   Submit(r.user,r.card);
  // }
  const handleSignUp = () => {
    const { name, lastName, email, phone, password, dateOfBirth, isSpecialUser, userType } = formData;

    if (!name || !lastName || !email || !password) return;
    if (password !== formData.confirmPassword) return;

    const finalUserType = isSpecialUser ? userType : "regular";

    const newUser = {
      name,
      last_name: lastName,
      date_of_birth: dateOfBirth || null,
      email,
      phone: phone || null,
      password_hash: `${password}`,
      user_type: finalUserType,
      is_verified: finalUserType === "regular",
    };

    console.log("New user:", newUser);

    // if (cardData.addCard && cardData.cardNumber && cardData.expiryDate && cardData.cvv) {
   
    const newCard = {
      name_on_card: cardData.nameOnCard || `${name} ${lastName}`,
      card_number: cardData.cardNumber.replace(/-/g, ""),
      expiry_date: cardData.expiryDate,
      cvv: cardData.cvv,
      card_type: cardData.cardType,
    };
    console.log("New card:", newCard);
    console.log({formData});
      // console.log("New card:", newCard);

    setSaved(true);
    setTimeout(async() => {
        const submit = await Submit(formData,cardData); 
        if (submit === "ok"){
          onSwitchToLogin();
        }
        console.log(submit);
    }, 500);
  };

  if (saved) {
    return (
      <SuccessMessage
        userType={formData.isSpecialUser ? formData.userType : "regular"}
      />
    );
  }

  const isUserStepValid = () => {
    const { name, lastName, email, password, confirmPassword, isSpecialUser, userType, verificationDoc } = formData;
    return name &&
      lastName &&
      email &&
      password &&
      password === confirmPassword &&
      (!isSpecialUser || (userType && verificationDoc));
  };

  return (
    <div
        className="page-transition"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <Logo />
      
      <p style={{ marginTop: "16px", color: commonStyles.blue, textAlign: "center", fontSize: commonStyles.text_font_size }}>
        Crear cuenta
      </p>
      
      <p style={{ marginTop: "16px", color: commonStyles.blue, fontSize: "14px", opacity: 0.7 }}>
        ¿Ya tienes cuenta?{" "}
        <span style={{ color: commonStyles.green, fontWeight: "600", cursor: "pointer" }} onClick={onSwitchToLogin}>
          Iniciar sesión
        </span>
      </p>

      <StepIndicator currentStep={step} onStepChange={setStep} />

      <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
        {step === "user" ? (
          <PersonalDataForm formData={formData} setFormData={setFormData} />
        ) : (
          <CardForm cardData={cardData} setCardData={setCardData} userName={`${formData.name} ${formData.lastName}`} />
        )}
      </div>

      <button
        onClick={handleSignUp}
        disabled={step === "user" ? !isUserStepValid() : false}
        // onClick={run_test}
        
        style={{
          backgroundColor: (step === "user" && !isUserStepValid()) ? "#CCCCCC" : commonStyles.blue,
          border: "none",
          width: "80%",
          borderRadius: "20px",
          padding: "12px",
          color: "white",
          marginTop: "24px",
          fontSize: commonStyles.button_fontSize,
          fontWeight: commonStyles.button_fontWeight,
          cursor: (step === "user" && !isUserStepValid()) ? "not-allowed" : "pointer",
        }}
      >
        Crear cuenta
      </button>
    </div>
  );
}

export default SignUp;