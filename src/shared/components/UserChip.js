import globalStyles from "@styles/globalStyles";
import { permissionsIcons } from "@utils/constantsUtils";
import { translatePermission } from "@utils/translationUtils";
import { Chip } from "react-native-paper";

export default function UserChip({ parsedUser }) {
  const icon = permissionsIcons[parsedUser?.permission] || "account";

  return (
    <Chip
      style={globalStyles.chip}
      icon={icon}
      mode="outlined"
    >
      {translatePermission(parsedUser?.permission)}
    </Chip>
  );
}