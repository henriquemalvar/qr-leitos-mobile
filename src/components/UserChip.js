import React from "react";
import { Chip } from "react-native-paper";
import { permissionsIcons } from "../shared/util/constantsUtils";

export default function UserChip({ parsedUser, onPress }) {
    return (
        <Chip
            style={{
                alignSelf: "flex-end",
                marginRight: 10,
                marginTop: 10,
            }}
            icon={permissionsIcons[parsedUser?.permission]}
            mode="outlined"
            onPress={onPress}
        >
            {parsedUser?.name}
        </Chip>
    );
}