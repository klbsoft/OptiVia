import type { CardFormData, SignUpFormData } from "./Singup";

function getRandomFormData() {
  const randStr = (len: number) => Math.random().toString(36).substring(2, 2 + len);
  const randNum = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join("");
  const randBool = () => Math.random() > 0.5;

  const name = randStr(6);
  const lastName = randStr(8);
  const fullName = `${name} ${lastName}`;

  const fileContent = `document from: ${fullName}`;
  const buffer = new Blob([fileContent], { type: "text/plain" });
  const file = new File([buffer], "file.txt", { type: "text/plain" });

  return {
    user: {
      name,
      lastName,
      dateOfBirth: `19${randNum(2)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      email: `${name}@test.com`,
      phone: `(${randNum(3)}) ${randNum(3)}-${randNum(4)}`,
      password: `pass${randNum(4)}`,
      confirmPassword: `pass${randNum(4)}`,
      isSpecialUser: randBool(),
      userType: randBool() ? (randBool() ? "gov" : "student") : "",
      verificationDoc: file,
      docPreview: null,
    } as SignUpFormData,
    card: {
      nameOnCard: fullName,
      cardNumber: `${randNum(4)}-${randNum(4)}-${randNum(4)}-${randNum(4)}`,
      expiryDate: `202${Math.floor(Math.random() * 8)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}`,
      cvv: randNum(3),
      cardType: randBool() ? "visa" : "mastercard",
      addCard: randBool(),
    } as CardFormData,
  };
}
export default getRandomFormData; 