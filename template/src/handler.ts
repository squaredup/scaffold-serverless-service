import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import API, { Request } from 'lambda-api';
import { withValidator } from 'lambda-helper';

/**
 * Initialize router
 */
const api = API();

//
// GET and POST route examples, with validation.
//

/**
 * List all resources
 * GET /resource
 */
api.get('/resources', async () => {
    return 'Hello World!';
});

/**
 * Create a resources
 * POST /resource
 */
api.post('/resources', withValidator({
    required: ['name'],
    properties: {
        name: {
            type: 'string'
        }
    }
}), async (req: Request) => {
    const name = req.body.name;
    return name;
});

/**
 * Entrypoint for all requests to this lambda
 * @param event API Gateway Event
 * @param context Execution Context
 */
export const run: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context):
    Promise<APIGatewayProxyResult> => {

    //TODO: Find out why the path includes the stage, it shouldn't... 
    // We fix it by stripping it before passing it to the router
    // See https://github.com/jeremydaly/lambda-api/issues/136
    // See https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html
    if (event.path.startsWith(`/${event.requestContext.stage}`)) {
        event.path = event.path.substring(event.requestContext.stage.length + 1);
    }

    // Send the request through our router
    return api.run(event, context);
};