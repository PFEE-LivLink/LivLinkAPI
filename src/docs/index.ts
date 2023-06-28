import { RedocModule } from '@juicyllama/nestjs-redoc';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { readFileSync, writeFileSync } from 'fs';
import * as yaml from 'js-yaml';

const logger = new Logger('DocsService');

const API_TITLE = 'LivLink API';
const API_DESCRIPTION = 'TODO description';

const docsEndpoint = 'docs';
const swaggerEndpoint = `${docsEndpoint}/swagger-ui`;
const openAPIYamlEndpoint = `${docsEndpoint}/docs.yml`;
const openAPIJsonEndpoint = `${docsEndpoint}/docs.json`;
const redocEndpoint = `${docsEndpoint}/redoc`;

let document: OpenAPIObject | null = null;

export function getVersion(): string {
  const packageJson = readFileSync('package.json', 'utf8');
  const data = JSON.parse(packageJson);
  const version = data.version ?? '0.0.0';
  return version;
}

export async function generateOpenApiDocument(app: INestApplication, env?: string): Promise<void> {
  let title = API_TITLE;
  if (env !== undefined) {
    title += ` - ${env}`;
  }
  const config = new DocumentBuilder().setTitle(title).setDescription(API_DESCRIPTION).setVersion(getVersion()).build();
  document = SwaggerModule.createDocument(app, config);
  logger.log('OpenAPI document generated');
}

export function getOpenApiDocument(): OpenAPIObject {
  if (document === null) {
    throw new Error('OpenAPI document not generated, call generateOpenApiDocument() first');
  }
  return document;
}

export async function setupSwagger(app: INestApplication): Promise<void> {
  const document = getOpenApiDocument();
  SwaggerModule.setup(swaggerEndpoint, app, document, {
    jsonDocumentUrl: openAPIJsonEndpoint,
    yamlDocumentUrl: openAPIYamlEndpoint,
  });
  logger.log(`Swagger UI available at /${swaggerEndpoint}`);
  logger.log(`Swagger JSON available at /${openAPIJsonEndpoint}`);
  logger.log(`Swagger YAML available at /${openAPIYamlEndpoint}`);
}

export async function setupRedoc(app: INestApplication): Promise<void> {
  const document = getOpenApiDocument();
  await RedocModule.setup(redocEndpoint, app, document, {});
  logger.log(`Redoc available at /${redocEndpoint}`);
}

export function saveAsJson(filename: string): void {
  const jsonString = JSON.stringify(getOpenApiDocument(), null, 2);
  writeFileSync(filename, jsonString, 'utf8');
  logger.log(`OpenAPI document saved as JSON in ${filename}`);
}

export function saveAsYaml(filename: string): void {
  const yamlString = yaml.dump(getOpenApiDocument());
  writeFileSync(filename, yamlString, 'utf8');
  logger.log(`OpenAPI document saved as YAML in ${filename}`);
}
