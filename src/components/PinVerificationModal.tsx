import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import CountryPicker, { Country } from "react-native-country-picker-modal";
import { colors } from "@theme/colors";
import { sendActivationPin, verifyActivationPin } from "@services/AuthService";
import { SNACKBAR_VARIANTS } from "@constants/snackbarVariants";

type SnackbarVariant = typeof SNACKBAR_VARIANTS[keyof typeof SNACKBAR_VARIANTS];

export function PinVerificationModal({
  visible,
  onClose,
  email,
  showSnackbar,
  onVerified,
}: {
  visible: boolean;
  onClose: () => void;
  email: string;
  showSnackbar: (msg: string, variant: SnackbarVariant) => void;
  onVerified: () => void;
}) {
  const [pinMethod, setPinMethod] = useState<"email" | "sms">("email");
  const [isSendingPin, setIsSendingPin] = useState(false);
  const [pinSent, setPinSent] = useState(false);
  const [pin, setPin] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  const [countryCode, setCountryCode] = useState<Country["cca2"]>("AR");
  const [callingCode, setCallingCode] = useState("54"); // Default Argentina
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [phone, setPhone] = useState("");

  React.useEffect(() => {
    if (!visible) {
      setPin("");
      setPinSent(false);
      setPinMethod("email");
      setCountryCode("AR");
      setCallingCode("54");
      setCountry(undefined);
      setPhone("");
    }
  }, [visible]);

  const handleCountrySelect = (country: Country) => {
    setCountry(country);
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  const handleSendPin = async () => {
    if (pinMethod === "sms") {
        if (!phone || phone.length < 4) {
        showSnackbar("Please enter a valid phone number", SNACKBAR_VARIANTS.ERROR);
        return;
        }
        if (!callingCode) {
        showSnackbar("Please select a country", SNACKBAR_VARIANTS.ERROR);
        return;
        }
    }
    setIsSendingPin(true);
    try {
        const fullPhone = pinMethod === "sms" ? `+${callingCode}${phone}` : "";
        await sendActivationPin({
        email: email,
        phone: fullPhone,
        method: pinMethod,
        });
        setPinSent(true);
        showSnackbar("PIN sent!", SNACKBAR_VARIANTS.SUCCESS);
    } catch (e) {
        showSnackbar("Failed to send PIN", SNACKBAR_VARIANTS.ERROR);
    }
    setIsSendingPin(false);
    };

  const handleVerifyPin = async () => {
    setIsVerifyingPin(true);
    try {
      await verifyActivationPin(email, pin);
      showSnackbar("Account verified! Please log in.", SNACKBAR_VARIANTS.SUCCESS);
      setPin("");
      onVerified();
      onClose();
    } catch (e) {
      showSnackbar("Invalid PIN", SNACKBAR_VARIANTS.ERROR);
    }
    setIsVerifyingPin(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 24,
          width: "85%",
          alignItems: "center"
        }}>
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>
            Verify your account
          </Text>
          <Text style={{ marginBottom: 16 }}>
            Choose how to receive your activation PIN:
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <TouchableOpacity
              style={{
                backgroundColor: pinMethod === "email" ? colors.primary : "#eee",
                padding: 10,
                borderRadius: 8,
                marginRight: 8,
              }}
              onPress={() => setPinMethod("email")}
              disabled={isSendingPin || isVerifyingPin}
            >
              <Text style={{ color: pinMethod === "email" ? "#fff" : "#222" }}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: pinMethod === "sms" ? colors.primary : "#eee",
                padding: 10,
                borderRadius: 8,
              }}
              onPress={() => setPinMethod("sms")}
              disabled={isSendingPin || isVerifyingPin}
            >
              <Text style={{ color: pinMethod === "sms" ? "#fff" : "#222" }}>SMS</Text>
            </TouchableOpacity>
          </View>

          {pinMethod === "sms" && (
            <View style={{ width: "100%", marginBottom: 12 }}>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withAlphaFilter
                withFlag
                withCallingCode
                withCountryNameButton
                onSelect={handleCountrySelect}
                containerButtonStyle={{
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 8,
                  padding: 8,
                  width: "100%",
                }}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{
                  fontSize: 16,
                  marginRight: 6,
                  color: colors.text,
                  backgroundColor: "#eee",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                }}>
                  +{callingCode}
                </Text>
                <TextInput
                  style={{ flex: 1 }}
                  label="Phone number"
                  mode="outlined"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Ej: 1123456789"
                  autoCapitalize="none"
                  disabled={isSendingPin || isVerifyingPin}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: colors.secondary,
              padding: 10,
              borderRadius: 8,
              marginBottom: 16,
              width: "100%",
              alignItems: "center"
            }}
            onPress={handleSendPin}
            disabled={isSendingPin}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {isSendingPin ? "Sending..." : pinSent ? "Resend PIN" : "Send PIN"}
            </Text>
          </TouchableOpacity>

          {pinSent && (
            <>
              <TextInput
                style={{ width: "100%", marginBottom: 12 }}
                label="Enter PIN"
                mode="outlined"
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                autoCapitalize="none"
                disabled={isVerifyingPin}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  padding: 10,
                  borderRadius: 8,
                  width: "100%",
                  alignItems: "center"
                }}
                onPress={handleVerifyPin}
                disabled={isVerifyingPin}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {isVerifyingPin ? "Verifying..." : "Verify"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={{ marginTop: 12 }}
            onPress={onClose}
            disabled={isSendingPin || isVerifyingPin}
          >
            <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}