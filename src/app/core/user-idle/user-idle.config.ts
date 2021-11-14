import { IdleEvents } from './user-idle.constants';

/**
 * @ignore
 */
export class UserIdleConfig {
  /**
   * idle value in seconds.
   */
  idle?: number;
  /**
   * timeout value in seconds.
   */
  timeout?: number;
  /**
   * ping value in seconds.
   */
  ping?: number;
  /**
   * idleSensitivity time that activity must remain below the idle detection threshold
   * before idle buffer timer count user's activity actions, in seconds.
   */
  idleSensitivity?: number;
  /**
   * Events for interruput idle.
   */
  interruptEvents?: Array<IdleEvents>;
}
