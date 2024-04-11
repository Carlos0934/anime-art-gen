import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { FileService } from "./interface";

export class S3FileService implements FileService {
  private readonly s3: S3Client;
  constructor() {
    this.s3 = new S3Client();
  }

  async upload(file: File | Blob, path: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: path,
      Body: file,
    });

    await this.s3.send(command);

    const url = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${path}`;

    return url;
  }
}
