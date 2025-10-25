export type SilaboListItem = {
  cursoCodigo: string | null;
  cursoNombre: string | null;
  estadoRevision: string | null;
};

export type SilaboFilters = {
  codigo?: string;
  nombre?: string;
};
