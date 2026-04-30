import type { Decorator, Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { ConfirmProvider } from '@/shared/components/Confirm';
import { EmojiExplosionProvider } from '@/shared/components/EmojiExplosion';
import '@/styles/global.css';

/**
 * Every story is wrapped in the same providers the real app mounts at
 * the root: a router (so <Link> resolves), the confirm dialog
 * provider, and the emoji explosion provider. All three are inert
 * unless the component under test actually uses them.
 */
const withProviders: Decorator = (Story) => (
  <MemoryRouter initialEntries={['/']}>
    <ConfirmProvider>
      <EmojiExplosionProvider>
        <Story />
      </EmojiExplosionProvider>
    </ConfirmProvider>
  </MemoryRouter>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#ffffff' },
        { name: 'muted', value: '#f3f3f5' },
        { name: 'banner', value: '#e7f3ec' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
