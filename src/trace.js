import appConfigs from "./app-configs";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { MongooseInstrumentation } from "opentelemetry-instrumentation-mongoose";
import { SocketIoInstrumentation } from "opentelemetry-instrumentation-socket.io";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { CompositePropagator, W3CTraceContextPropagator, W3CBaggagePropagator } from "@opentelemetry/core";
import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";

const trace = new NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: process.env.APP_NAME,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: appConfigs.sentry.env,
    }),
    spanProcessor: new BatchSpanProcessor(
        new JaegerExporter({
            tags: [],
            endpoint: appConfigs.otel?.endpoint,
        })
    ),
    textMapPropagator: new CompositePropagator({
        propagators: [
            new JaegerPropagator(),
            new W3CTraceContextPropagator(),
            new W3CBaggagePropagator(),
            new B3Propagator({
                injectEncoding: B3InjectEncoding.MULTI_HEADER,
            }),
        ],
    }),
    instrumentations: [
        new HttpInstrumentation({
            ignoreIncomingRequestHook: (req) => {
                return req.method === "GET" || req.statusCode === 204;
            },
        }),
        new ExpressInstrumentation(),
        new MongooseInstrumentation(),
        new SocketIoInstrumentation(),
    ],
});

export default trace;
