import { randomUUID } from "node:crypto";
import path from "node:path";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

import { configs } from "../config/configs";
import { FileItemTypeEnum } from "../enums/file-item.type-enum";

class S3Service {
  constructor(
    private client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KEY,
      },
    }),
  ) {}
  public async uploadFile(
    file: UploadedFile,
    itemType: FileItemTypeEnum,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPass(itemType, itemId, file.name);
      await this.client.send(
        new PutObjectCommand({
          Bucket: configs.AWS_S3_BUCKET_NAME,
          Key: filePath,
          Body: file.data,
          ContentType: file.mimetype,
          ACL: configs.AWS_S3_ACL,
        }),
      );
      return filePath;
    } catch (e) {
      console.error("Error upload: ", e);
    }
  }

  private buildPass(
    itemType: FileItemTypeEnum,
    itemId: string,
    filename: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(filename)}`;
  }
}
export const s3Service = new S3Service();
