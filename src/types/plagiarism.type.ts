export interface TPlagiarismDocument extends Record<string, unknown> {
  _id?: string;
  originalName: string;
  name: string;
  url: string; // URL
  size: number;
  contentType?: string;
  timeCreated: string;
  updated: string;
}

export type TPlagiarismDocumentsResponse = {
  success: boolean;
  message: string;
  data: TPlagiarismDocument[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
};

export type TPlagiarismDocumentResponse = {
  success: boolean;
  message: string;
  data: TPlagiarismDocument;
};
