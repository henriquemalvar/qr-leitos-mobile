export const translatePermissions = {
  medico: "Médico",
  enfermeira: "Enfermagem",
  limpeza: "Limpeza",
  camareira: "Camareira",
  admin: "Administrador",
  portaria: "Portaria",
};

export const permissionsIcons = {
  medico: "stethoscope",
  enfermeira: "stethoscope",
  limpeza: "broom",
  camareira: "bed",
  admin: "security",
};

export const permissions = {
  medico: [
    {
      from: "available",
      to: "occupied",
    },
    {
      from: "occupied",
      to: "discharge",
    },
    {
      from: "discharge",
      to: "final_discharge",
    },
  ],
  enfermeira: [
    {
      from: "available",
      to: "occupied",
    },
    {
      from: "occupied",
      to: "discharge",
    },
    {
      from: "discharge",
      to: "final_discharge",
    },
  ],
  limpeza: [
    {
      from: "awaiting_for_cleaning",
      to: "cleaning_in_progress",
    },
    {
      from: "cleaning_in_progress",
      to: "awaiting_for_bedding",
    },
  ],
  camareira: [
    {
      from: "awaiting_for_bedding",
      to: "bedding_in_progress",
    },
    {
      from: "bedding_in_progress",
      to: "available",
    },
  ],
  portaria: [
    {
      from: "occupied",
      to: "discharge",
    },
    {
      from: "final_discharge",
      to: "awaiting_for_cleaning",
    },
  ],
  admin: [
    {
      from: "available",
      to: "occupied",
    },
    {
      from: "occupied",
      to: "discharge",
    },
    {
      from: "discharge",
      to: "final_discharge",
    },
    {
      from: "final_discharge",
      to: "awaiting_for_cleaning",
    },
    {
      from: "awaiting_for_cleaning",
      to: "cleaning_in_progress",
    },
    {
      from: "cleaning_in_progress",
      to: "awaiting_for_bedding",
    },
    {
      from: "awaiting_for_bedding",
      to: "bedding_in_progress",
    },
    {
      from: "bedding_in_progress",
      to: "available",
    },
  ],
};

export const status = [
  "available",
  "occupied",
  "discharge",
  "awaiting_for_cleaning",
  "cleaning_in_progress",
  "awaiting_for_bedding",
  "bedding_in_progress",
  "final_discharge",
];

export const translateStatusConstant = {
  available: "Livre",
  occupied: "Ocupado",
  discharge: "Em alta",
  awaiting_for_cleaning: "Aguardando higienização",
  cleaning_in_progress: "Em higienização",
  awaiting_for_bedding: "Aguardando forragem",
  bedding_in_progress: "Em forragem",
  blocked: "Bloqueado",
  maintenance: "Em manutenção",
  final_discharge: "Alta final",
};

export const statusColor = {
  available: "green",
  occupied: "red",
  discharge: "red",
  awaiting_for_cleaning: "blue",
  cleaning_in_progress: "blue",
  awaiting_for_bedding: "yellow",
  bedding_in_progress: "yellow",
  blocked: "gray",
  maintenance: "gray",
  final_discharge: "gray",
};

export const statusIcon = {
  available: "check",
  occupied: "bed",
  discharge: "hospital",
  awaiting_for_cleaning: "clock",
  cleaning_in_progress: "clock",
  awaiting_for_bedding: "clock",
  bedding_in_progress: "clock",
  blocked: "ban",
  maintenance: "wrench",
  final_discharge: "hospital",
};
