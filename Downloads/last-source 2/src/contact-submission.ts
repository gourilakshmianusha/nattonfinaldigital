import {submitAppointmentRequest, type AppointmentRequest} from './growth/appointments';
import {createRequestId} from './utils/requestId.mjs';

/** Reuse the request ID after a failed response so retries cannot create duplicates. */
export function createContactSubmitter(save = submitAppointmentRequest) {
  let current: {snapshot: string; id: string; pending?: Promise<any>} | undefined;
  return (payload: AppointmentRequest) => {
    const snapshot = JSON.stringify(payload);
    if (!current || current.snapshot !== snapshot) current = {snapshot, id: createRequestId()};
    const request = current;
    if (!request.pending) {
      request.pending = Promise.resolve().then(() => save(payload, request.id)).then(response => {
        if (response.saved !== true || !response.appointmentId) {
          throw new Error('We could not confirm your enquiry was saved. Please try again.');
        }
        return response;
      }).catch(error => {
        request.pending = undefined;
        throw error;
      });
    }
    return request.pending;
  };
}
