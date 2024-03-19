import globalStyles from "@styles/globalStyles";
import { convertTimestamp } from "@utils/dateUtils";
import moment from "moment";
import { Card, Divider, Headline, Paragraph } from "react-native-paper";

const BedModificationInfo = ({ bed, lastLog }) => {
  const lastModification =
    convertTimestamp(bed.updated_at).format("DD/MM/YYYY HH:mm:ss") || "N/A";
  const lastModificationLabel = bed.updated_at
    ? "Última Modificação"
    : "Criado em";
  const hours = moment().diff(
    moment(lastModification, "DD/MM/YYYY HH:mm:ss"),
    "hours"
  );
  const diff =
    hours > 24
      ? `${moment().diff(
          moment(lastModification, "DD/MM/YYYY HH:mm:ss"),
          "days"
        )} dias`
      : `${hours} horas`;

  return (
    <Card style={globalStyles.card}>
      <Card.Content>
        <Headline style={globalStyles.title}>{lastModificationLabel}</Headline>
        <Divider style={globalStyles.divider} />
        <Paragraph style={globalStyles.paragraph}>
          {lastModification} - {diff} atrás
        </Paragraph>
        {lastLog?.userName && (
          <Paragraph style={globalStyles.paragraph}>
            Modificado por: {lastLog.userName}
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );
};

export default BedModificationInfo;