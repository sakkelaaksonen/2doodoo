export default class EventBase {

  constructor() {
    /**
     * Internal event target for custom event dispatching.
     * @type {EventTarget}
     * @private
     */
    this._eventTarget = document.createElement('span');
  }
   /**
     * Adds an event listener for collection changes.
     * @param {string} type - The event type.
     * @param {Function} listener - The event handler.
     * @param {Object|boolean} [options] - Optional options.
     */
    addEventListener(...args) {
        this._eventTarget.addEventListener(...args);
    }

    /**
     * Removes an event listener for collection changes.
     * @param {string} type - The event type.
     * @param {Function} listener - The event handler.
     * @param {Object|boolean} [options] - Optional options.
     */
    removeEventListener(...args) {
        //Not needed atm but keeping for symmetry
        this._eventTarget.removeEventListener(...args);
    }
}
