import { useState } from "react";

export function useSocialSection(viewUserPets) {
  const [currentStep, setCurrentStep] = useState("SEARCH");
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedTargetPet, setSelectedTargetPet] = useState(null);

  const handleOwnerClick = async (user) => {
    setSelectedOwner(user);
    await viewUserPets(user.id);
    setCurrentStep("OWNER");
  };

  const handlePetClick = (pet) => {
    setSelectedTargetPet(pet);
    setCurrentStep("DETAILS");
  };

  const goBack = () => {
    if (currentStep === "DETAILS") {
      setCurrentStep("OWNER");
    } else {
      setCurrentStep("SEARCH");
      setSelectedOwner(null);
    }
  };

  const resetStep = () => setCurrentStep("SEARCH");

  return {
    currentStep,
    selectedOwner,
    selectedTargetPet,
    handleOwnerClick,
    handlePetClick,
    goBack,
    resetStep,
  };
}
