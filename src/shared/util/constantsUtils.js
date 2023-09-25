export const translatePermissions = {
  medico: "Médico",
  enfermeira: "Enfermeira",
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
      from: "final_discharge",
      to: "awaiting_for_cleaning",
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
      from: "final_discharge",
      to: "awaiting_for_cleaning",
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
  ],
  portaria: [
    {
      from: "discharge",
      to: "final_discharge",
    },
  ],
  admin: [
    // representa o fluxo completo de um leito, porem ele tem livre acesso a qualquer status
    {
      from: "available",
      to: "occupied",
    },
    {
      from: "occupied",
      to: "final_discharge",
    },
    {
      from: "discharge",
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
      from: "discharge",
      to: "final_discharge",
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
  "blocked",
  "maintenance",
  "final_discharge",
];

export const translateStatusConstant = {
  available: "Livre",
  occupied: "Ocupado",
  discharge: "Em alta",
  awaiting_for_cleaning: "Aguardando higienização",
  cleaning_in_progress: "Higienização em progresso",
  awaiting_for_bedding: "Aguardando arrumação",
  bedding_in_progress: "Arrumação em progresso",
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
