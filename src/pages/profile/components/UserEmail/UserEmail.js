import globalStyles from "@styles/globalStyles";
import { Card, Paragraph, Title } from "react-native-paper";

export const EmailCard = ({ user }) => {
  return (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Title style={globalStyles.title}>Email cadastrado:</Title>
        <Paragraph style={globalStyles.paragraph}>{user.email}</Paragraph>
      </Card.Content>
    </Card>
  );
};
