import globalData from '@csstools/postcss-global-data';
import customMedia from 'postcss-custom-media';

/*
 * Pipeline:
 *   1. global-data loads `breakpoints.css` once and exposes its
 *      @custom-media declarations to every subsequent CSS file
 *      (including isolated CSS Modules).
 *   2. custom-media expands `@media (--mobile)` into `@media (max-width: 480px)`.
 *
 * Single source of truth: src/styles/breakpoints.css.
 */
export default {
  plugins: [
    globalData({ files: ['./src/styles/breakpoints.css'] }),
    customMedia(),
  ],
};
