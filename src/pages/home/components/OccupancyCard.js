import globalStyles from "@styles/globalStyles";
import { Card, List } from "react-native-paper";

export default function OccupancyCard({ percentage }) {
  return (
    <Card style={globalStyles.card}>
      <List.Item
        title={`Taxa de Ocupação: ${percentage.toFixed(1)}%`}
        titleStyle={[globalStyles.title, { textAlign: "center" }]}
        style={{ marginTop: 0, paddingBottom: 0 }}
      />
    </Card>
  );
}
