import { TuiDocPage } from '@taiga-ui/addon-doc';

import { EXAMPLES_PAGES } from './examples/examples.pages';
import { GUIDES_PAGES } from './guides/guides.pages';

export const APP_PAGES: TuiDocPage[] = [...GUIDES_PAGES, ...EXAMPLES_PAGES];
