
import { success, fail } from '../shared/responseHelper';

export const run = async (event, context) => {
  return success("Hello World!");
};