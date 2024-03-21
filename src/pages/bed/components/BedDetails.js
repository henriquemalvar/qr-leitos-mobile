import globalStyles from "@styles/globalStyles";
import { theme } from "@styles/theme";
import { View } from "react-native";
import { Card, Divider, Headline, List, Paragraph } from "react-native-paper";
import BedModificationInfo from "./BedModificationInfo";


const CardInfo = ({ header, content }) => (
  <Card style={globalStyles.card}>
    <Card.Content>
      <Headline style={globalStyles.title}>{header}</Headline>
      <Divider style={globalStyles.divider} />
      {Array.isArray(content) && content.length > 0 ? (
        content.map((item) => (
          <Paragraph key={item} style={globalStyles.paragraph}>
            {item}
          </Paragraph>
        ))
      ) : (
        <Paragraph style={globalStyles.paragraph}>Não informado</Paragraph>
      )}
    </Card.Content>
  </Card>
);

const BedDetails = ({ bed, lastLog }) => {
  return (
    <List.Accordion
      title={bed.name}
      titleStyle={{
        ...globalStyles.title,
        textAlign: "center",
        color: theme.colors.primary,
      }}
      style={globalStyles.card}
    >
      <View style={{ ...globalStyles.centeredContainer, padding: 15 }}>
        <CardInfo header="Endereço" content={bed.location} />
        <CardInfo header="Tipo" content={bed.type} />
        <BedModificationInfo bed={bed} lastLog={lastLog} />
      </View>
    </List.Accordion>
  );
};

export default BedDetails;