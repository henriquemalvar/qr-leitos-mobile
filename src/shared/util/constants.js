export const permissionsToLabel = {
    'medico': 'Médico',
    'enfermeira': 'Enfermeira',
    'limpeza': 'Limpeza',
    'camareira': 'Camareira',
    'admin': 'Administrador',
};

export const permissions = {
    'medico': [
        {
            from: 'available',
            to: 'occupied',
        },
        {
            from: 'occupied',
            to: 'discharge',
        },
        {
            from: 'discharge',
            to: 'awaiting_for_cleaning',
        },
    ],
    'enfermeira': [
        {
            from: 'available',
            to: 'occupied',
        },
        {
            from: 'occupied',
            to: 'discharge',
        },
        {
            from: 'discharge',
            to: 'awaiting_for_cleaning',
        },
        {
            from: 'blocked',
            to: 'available',
        }
    ],
    'limpeza': [
        {
            from: 'awaiting_for_cleaning',
            to: 'cleaning_in_progress',
        },
        {
            from: 'cleaning_in_progress',
            to: 'awaiting_for_bedding',
        },
    ],
    'camareira': [
        {
            from: 'awaiting_for_bedding',
            to: 'bedding_in_progress',
        },
    ],
    'admin': [
        {
            from: 'available',
            to: 'occupied',
        },
        {
            from: 'occupied',
            to: 'discharge',
        },
        {
            from: 'discharge',
            to: 'awaiting_for_cleaning',
        },
        {
            from: 'awaiting_for_cleaning',
            to: 'cleaning_in_progress',
        },
        {
            from: 'cleaning_in_progress',
            to: 'awaiting_for_bedding',
        },
        {
            from: 'awaiting_for_bedding',
            to: 'bedding_in_progress',
        },
        {
            from: 'blocked',
            to: 'available',
        }
    ]
};

export const status = [
    "available",
    "occupied",
    "discharge",
    "awaiting_for_cleaning",
    "cleaning_in_progress",
    "awaiting_for_bedding",
    "bedding_in_progress",
    'blocked',
    "maintenance",
    "ata_final",
];

export const statusToLabel = {
    available: "Livre",
    occupied: "Ocupado",
    discharge: "Em alta",
    awaiting_for_cleaning: "Aguardando higienização",
    cleaning_in_progress: "Higienização em progresso",
    awaiting_for_bedding: "Aguardando arrumação",
    bedding_in_progress: "Arrumação em progresso",
    blocked: 'Bloqueado',
    maintenance: 'Manutenção',
    ata_final: 'ATA Final'
};

export const statusToColor = {
    available: "green",
    occupied: "red",
    discharge: "red",
    awaiting_for_cleaning: "blue",
    cleaning_in_progress: "blue",
    awaiting_for_bedding: "yellow",
    bedding_in_progress: "yellow",
    blocked: 'gray',
    maintenance: 'gray',
    ata_final: 'gray'
};

export const statusToIcon = {
    available: "check",
    occupied: "bed",
    discharge: "hospital",
    awaiting_for_cleaning: "clock",
    cleaning_in_progress: "clock",
    awaiting_for_bedding: "clock",
    bedding_in_progress: "clock",
    blocked: 'ban',
    maintenance: 'wrench',
    ata_final: 'file'
};