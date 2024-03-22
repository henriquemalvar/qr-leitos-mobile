import globalStyles from "@styles/globalStyles";
import { Card, Divider, Headline, Paragraph } from "react-native-paper";
import { Timestamp } from 'firebase/firestore'; 

const BedModificationInfo = ({ bed, lastLog }) => {
    const lastModification = bed.updated_at
        ? new Timestamp(bed.updated_at.seconds, bed.updated_at.nanoseconds).toDate()
        : null;
    const lastModificationLabel = bed.updated_at
        ? "Última Modificação"
        : "Criado em";
    const hours = lastModification
        ? Math.abs(new Date() - lastModification) / 36e5
        : null;
    const diff = hours 
        ? hours > 24 ? `${Math.floor(hours / 24)} dias` : `${Math.floor(hours)} horas`
        : "N/A";

    return (
        <Card style={globalStyles.card}>
            <Card.Content>
                <Headline style={globalStyles.title}>{lastModificationLabel}</Headline>
                <Divider style={globalStyles.divider} />
                <Paragraph style={globalStyles.paragraph}>
                    {lastModification ? lastModification.toLocaleString() : "N/A"} - {diff} atrás
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