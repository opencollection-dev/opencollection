import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function ExternalSecrets({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const externalSecrets = schema.$defs.ExternalSecrets;
  const secretProviders = externalSecrets.properties.type.enum;

  const secretVariants = [
    { label: 'HashiCorp Vault', def: schema.$defs.HashicorpVaultExternalSecret },
    { label: 'AWS Secrets Manager', def: schema.$defs.AwsSecretsManagerExternalSecret },
    { label: 'Azure Key Vault', def: schema.$defs.AzureKeyVaultExternalSecret }
  ];

  const example = {
    type: "hashicorp-vault-server",
    variables: [
      {
        name: "apiKey",
        path: "secret/data/production/api-key",
        description: "API key resolved from HashiCorp Vault"
      }
    ]
  };

  return (
    <section>
      <h2 className={typography.heading.h2}>External Secrets</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>External secrets let an environment reference secrets that are resolved at runtime from a secret provider, instead of storing their values inline. Each environment can declare a single <code>externalSecrets</code> block with a provider <code>type</code> and its <code>variables</code>.</p>

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Properties</h3>
      <PropertyTable
        properties={externalSecrets.properties}
        order={Object.keys(externalSecrets.properties)}
        required={externalSecrets.required}
      />

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Supported Providers</h3>
      <p className={`${typography.body.default} ${spacing.element}`}>The <code>type</code> field selects the provider that resolves the secrets.</p>
      <div className={`flex flex-wrap gap-2 ${spacing.element}`}>
        {secretProviders.map(provider => (
          <span key={provider} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">{provider}</span>
        ))}
      </div>

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>External Secret Variables</h3>
      <p className={`${typography.body.default} ${spacing.element}`}>Each entry in <code>variables</code> is shaped by the provider that resolves it. Every variant shares a <code>name</code>, optional <code>description</code>, and <code>disabled</code> flag, plus a provider-specific reference to the secret.</p>

      {secretVariants.map(({ label, def }) => (
        <div key={label}>
          <h4 className="text-base font-semibold mb-2">{label}</h4>
          <PropertyTable
            properties={def.properties}
            order={Object.keys(def.properties)}
            required={def.required}
          />
        </div>
      ))}

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default ExternalSecrets
