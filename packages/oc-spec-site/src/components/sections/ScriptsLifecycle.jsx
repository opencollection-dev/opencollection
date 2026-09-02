import React from 'react'
import PropertyTable from '../PropertyTable'
import CodeBlock from '../CodeBlock'
import { useTheme } from '../../theme/ThemeProvider'
import { convertToYaml } from '../../utils/yamlConverter'

function ScriptsLifecycle({ schema }) {
  const theme = useTheme();
  const { typography, spacing } = theme;
  const scripts = schema.$defs.Scripts;
  const script = schema.$defs.Script;
  
  const example = [
    {
      type: "before-request",
      code: "// Set timestamp\nbru.setVar('timestamp', new Date().getTime());"
    },
    {
      type: "after-response",
      code: "// Extract auth token\nconst token = res.body.token;\nbru.setVar('authToken', token);"
    },
    {
      type: "grpc:before-call-start",
      code: "// set a metadata value before the call is opened.\nbru.grpc.request.metadata.upsert('x-api-key', {{apikey}});"
    },
    {
      type: "grpc:before-message-send",
      code: "// Update a var with the sent count.\nbru.setVar('sentCount', (bru.getVar('sentCount') || 0) + 1);"
    },
    {
      type: "grpc:after-message-receive",
      code: "// Update a var with the received count.\nbru.setVar('receivedCount', bru.grpc.response.messages.count());"
    },
    {
      type: "grpc:after-call-end",
      code: "// Extract a value from a message.\nbru.setVar('user', bru.grpc.response.messages.get(0).data.value);"
    },
    {
      type: "tests",
      code: "// Test response\ntest('Status is 200', () => {\n    expect(res.status).to.equal(200);\n});"
    },
    // {
    //   type: "hooks",
    //   code: "// Custom lifecycle hooks"
    // }
  ];

  return (
    <section>
      <h2 className={typography.heading.h2}>Scripts & Lifecycle</h2>
      <p className={`${typography.body.default} ${spacing.element}`}>{scripts.description}</p>
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Script Object Properties</h3>
      <PropertyTable 
        properties={script.properties}
        order={Object.keys(script.properties)}
        required={script.required}
      />
      
      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Script Types</h3>
      <ul className={`list-disc list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><strong>before-request</strong> - Executed before the request is sent. Use for setting up authentication, generating dynamic values, etc.</li>
        <li><strong>after-response</strong> - Executed after receiving the response. Use for extracting values, setting variables, etc.</li>
        <li><strong>grpc:before-call-start</strong> - Executed before the call is opened. Use for setting metadata, generating dynamic values, etc.</li>
        <li><strong>grpc:before-message-send</strong> - Executed before each message is sent, once per message on client-streaming and bidi-streaming calls.</li>
        <li><strong>grpc:after-message-receive</strong> - Executed after each message is received, once per message on server-streaming and bidi-streaming calls.</li>
        <li><strong>grpc:after-call-end</strong> - Executed after the call ends, whether it completed or errored. Use for extracting values, setting variables, etc.</li>
        <li><strong>tests</strong> - Run test assertions against the response</li>
      </ul>

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Execution Lifecycle</h3>
      <p className={`${typography.body.small} ${spacing.paragraph}`}><strong>HTTP & GraphQL</strong></p>
      <ol className={`list-decimal list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><strong>Before-Request</strong> - Executed before the request is sent</li>
        <li><strong>Request Sent</strong> - The actual HTTP request is made</li>
        <li><strong>After-Response</strong> - Executed after receiving the response</li>
        <li><strong>Tests</strong> - Run test assertions against the response</li>
      </ol>
      <p className={`${typography.body.small} ${spacing.paragraph}`}><strong>gRPC</strong></p>
      <ol className={`list-decimal list-inside space-y-2 ${spacing.element} ${typography.body.default}`}>
        <li><strong>gRPC:Before-Call-Start</strong> - Executed before a gRPC call is opened</li>
        <li><strong>Call Established</strong> - The channel is opened and the method is invoked</li>
        <li><strong>gRPC:Before-Message-Send</strong> - Executed before each outgoing message on a gRPC call</li>
        <li><strong>gRPC:After-Message-Receive</strong> - Executed after each incoming message on a gRPC call</li>
        <li><strong>gRPC:After-Call-End</strong> - Executed once a gRPC call ends</li>
      </ol>

      <h3 className={`${typography.heading.h3} ${spacing.paragraph}`}>Example</h3>
      <CodeBlock code={convertToYaml(example)} language="yaml" />
    </section>
  )
}

export default ScriptsLifecycle