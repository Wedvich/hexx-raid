import * as constants from './constants';
import { classIdToName, specToRole } from './characterUtils';
import Loader from './Loader';

let isInIframe;
try {
  isInIframe = window.self !== window.top;
} catch (e) {
  isInIframe = true;
}

export const IS_IN_IFRAME = isInIframe;

export {
  classIdToName,
  constants,
  Loader,
  specToRole
};
