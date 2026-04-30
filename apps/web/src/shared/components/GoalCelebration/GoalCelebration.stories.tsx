import type { Meta, StoryObj } from '@storybook/react-vite';
import { GoalCelebration } from './GoalCelebration';

/**
 * GoalCelebration has no UI of its own. It watches the applications
 * count and fires the emoji explosion on the 4 → 5+ transition. To see
 * it in action, run the app and create five letters; the integration
 * test for it is the EmojiExplosion stories above.
 */
const meta = {
  title: 'App/GoalCelebration',
  component: GoalCelebration,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GoalCelebration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headless: Story = {
  render: () => (
    <div style={{ color: '#6b6b73', fontSize: 14, maxWidth: 360 }}>
      <GoalCelebration />
      <p>This component is headless. It only fires its effect on the
      4 → 5 transition of <code>applicationsAtom</code>. To exercise the
      celebration, use the EmojiExplosion stories or run the live app.</p>
    </div>
  ),
};
