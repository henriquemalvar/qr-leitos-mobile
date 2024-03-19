import globalStyles from "@styles/globalStyles";
import { theme } from "@styles/theme";
import { Card, Divider, Headline, Paragraph, Text } from "react-native-paper";

const CardTitle = ({ title }) => (
  <Card style={globalStyles.card}>
    <Card.Content style={{ marginTop: 0, paddingBottom: 0 }}>
      <Text
        style={{
          ...globalStyles.title,
          textAlign: "center",
          color: theme.colors.primary,
        }}
      >
        {title}
      </Text>
    </Card.Content>
  </Card>
);

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

const BedDetails = ({ bed }) => {
  return (
    <>
      <CardTitle title={bed.name} />
      <CardInfo header="Endereço" content={bed.location} />
      <CardInfo header="Tipo" content={bed.type} />
    </>
  );
};

export default BedDetails;