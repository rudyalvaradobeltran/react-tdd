import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  worker
}