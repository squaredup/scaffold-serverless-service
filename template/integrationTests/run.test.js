import { service } from '../../shared/serviceHelper'; 

describe('run', () => {

  test('should respond with a success message', async () => {
    let response = await service.get('/resources');
    expect(response.data.message).toMatch('Hello World!');
  });
});

