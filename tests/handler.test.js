import * as handler from '../handler';

test('handler', async () => {

  const event = 'event';
  const context = 'context';

  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };

  await handler.run(event, context, callback);
});
