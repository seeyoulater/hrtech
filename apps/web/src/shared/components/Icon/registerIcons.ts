import { addIcon } from '@iconify/react';

import add from '@iconify-icons/carbon/add';
import arrowUpRight from '@iconify-icons/carbon/arrow-up-right';
import checkmark from '@iconify-icons/carbon/checkmark';
import copy from '@iconify-icons/carbon/copy';
import home from '@iconify-icons/carbon/home';
import renew from '@iconify-icons/carbon/renew';
import trashCan from '@iconify-icons/carbon/trash-can';

import barsRotateFade from '@iconify-icons/svg-spinners/bars-rotate-fade';

/**
 * Icons used in the app are bundled and registered synchronously at
 * module-init time. `<Icon name="carbon:home" />` resolves from the
 * in-memory store on first paint, no network request, no cache, no
 * waiting. Each `@iconify-icons/<set>/<name>` import ships ~150–300
 * bytes of SVG path data, tree-shaken so we ship only what we use
 * (~2 KB total in this app).
 *
 * Add new icons here when the app starts using them. Storybook-only
 * icons can stay lazy-loaded.
 */
addIcon('carbon:add', add);
addIcon('carbon:arrow-up-right', arrowUpRight);
addIcon('carbon:checkmark', checkmark);
addIcon('carbon:copy', copy);
addIcon('carbon:home', home);
addIcon('carbon:renew', renew);
addIcon('carbon:trash-can', trashCan);

addIcon('svg-spinners:bars-rotate-fade', barsRotateFade);
