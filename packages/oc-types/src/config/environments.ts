/**
 * Environment configuration types
 */

import type { Description } from '../common/description';
import type { Variable, SecretVariable } from '../common/variables';
import type { ClientCertificate } from './certificates';

export interface Environment {
  name: string;
  color?: string;
  description?: Description;
  variables?: (Variable | SecretVariable)[];
  clientCertificates?: ClientCertificate[];
  extends?: string;
  dotEnvFilePath?: string;
}
