import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmojiExplosionProvider, useEmojiExplosion } from './EmojiExplosion';
import { Button } from '@/shared/components/Button';

const meta = {
  title: 'App/EmojiExplosion',
  component: EmojiExplosionProvider,
  args: { children: null },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof EmojiExplosionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Trigger = ({ count, message }: { count?: number; message?: string | null }) => {
  const explode = useEmojiExplosion();
  return (
    <Button onClick={() => explode({ count, message })}>Explode</Button>
  );
};

export const Default: Story = {
  render: () => <Trigger />,
};

export const BigBurst: Story = {
  render: () => <Trigger count={80} message="Big day!" />,
};

export const SilentEmojisOnly: Story = {
  render: () => <Trigger count={48} message={null} />,
};
