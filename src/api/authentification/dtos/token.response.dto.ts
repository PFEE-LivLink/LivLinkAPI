import { IsJWT } from 'class-validator';

export class TokenResponseDTO {
  @IsJWT()
  public access_token: string;
}
