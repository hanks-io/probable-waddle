import { Emitter } from 'strict-event-emitter'
import { EventConfig } from './config';

export const emitter = new Emitter<EventConfig>()


