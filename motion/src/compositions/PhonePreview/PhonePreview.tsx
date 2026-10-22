import { AbsoluteFill } from "remotion";
import { fary } from "../../theme/fary";
import { PhoneMockup } from "../../components/PhoneMockup";
import { BookingScreen } from "../../screens/BookingScreen";

/** Banco de pruebas del PhoneMockup: se enciende y muestra una interfaz real de reserva. */
export function PhonePreview() {
  return (
    <AbsoluteFill style={{ background: fary.color.bg, alignItems: "center", justifyContent: "center" }}>
      <PhoneMockup width={520} active since={10}>
        <BookingScreen from={20} />
      </PhoneMockup>
    </AbsoluteFill>
  );
}
