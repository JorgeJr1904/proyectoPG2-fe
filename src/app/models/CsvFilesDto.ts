import { RequestInfoDto } from "./requestInfoDto";

export class CsvFilesDto {
    id!: number;
    filename!: string;
    info!: RequestInfoDto[];
    uuid!: string;
}