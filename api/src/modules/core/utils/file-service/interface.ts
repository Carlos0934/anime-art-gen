export interface FileService {
  upload(file: File, path: string): Promise<string>;
}
