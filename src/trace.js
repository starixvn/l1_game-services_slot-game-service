import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { MongooseInstrumentation } from "opentelemetry-instrumentation-mongoose";
import { SocketIoInstrumentation } from "opentelemetry-instrumentation-socket.io";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { CompositePropagator } from "@opentelemetry/core";

const trace = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.APP_NAME,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "LOCAL_1",
    }),
    spanProcessor: new BatchSpanProcessor(
        new JaegerExporter({
            tags: [],
            endpoint: "http://10.10.50.69:14268/api/traces",
        })
    ),
    textMapPropagator: new CompositePropagator({
        propagators: [new JaegerPropagator()],
    }),
    instrumentations: [
        new HttpInstrumentation({
            ignoreOutgoingRequestHook: (req) => {
                return req.hostname.includes("health");
            },
        }),
        new MongooseInstrumentation(),
        new SocketIoInstrumentation(),
    ],
});

export default trace;
